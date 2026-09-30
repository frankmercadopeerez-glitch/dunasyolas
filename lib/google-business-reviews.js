"use strict";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_REVIEWS_BASE = "https://mybusiness.googleapis.com/v4";
const GOOGLE_ACCOUNTS_BASE = "https://mybusinessaccountmanagement.googleapis.com/v1";
const GOOGLE_LOCATIONS_BASE = "https://mybusinessbusinessinformation.googleapis.com/v1";

function stripResourcePrefix(value, prefix) {
  const resource = String(value || "").trim().replace(/\/$/, "");
  const marker = `${String(prefix).toLowerCase()}/`;
  const index = resource.toLowerCase().lastIndexOf(marker);
  return index >= 0 ? resource.slice(index + marker.length).split("/")[0] : resource;
}

function ratingToNumber(value) {
  const ratings = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  if (typeof value === "number") return Math.max(1, Math.min(5, value));
  return ratings[String(value || "").toUpperCase()] || 5;
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " y ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function locationMatchScore(title, requestedName) {
  const candidate = normalizeName(title);
  const requested = normalizeName(requestedName || "Dunas y Olas");
  if (!candidate) return 0;
  if (candidate === requested) return 100;
  if (candidate.includes(requested) || requested.includes(candidate)) return 80;

  const requestedTokens = new Set(requested.split(" ").filter((token) => token.length > 2));
  const overlap = candidate.split(" ").filter((token) => requestedTokens.has(token)).length;
  return overlap >= 2 ? overlap * 10 : 0;
}

function normalizeReview(review) {
  const reviewer = review.reviewer || {};
  return {
    id: String(review.reviewId || review.name || ""),
    author: String(reviewer.displayName || "Viajero de Google"),
    authorImage: String(reviewer.profilePhotoUrl || ""),
    rating: ratingToNumber(review.starRating),
    text: String(review.comment || "").trim(),
    createTime: review.createTime || null,
    updateTime: review.updateTime || review.createTime || null,
  };
}

async function getAccessToken(options) {
  const response = await options.fetchFn(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: options.clientId,
      client_secret: options.clientSecret,
      refresh_token: options.refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.access_token) {
    const error = new Error("Google no pudo renovar el acceso a las reseñas.");
    error.status = response.status;
    throw error;
  }
  return payload.access_token;
}

async function fetchJson(fetchFn, url, accessToken, errorMessage) {
  const response = await fetchFn(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function discoverBusinessProfile(options) {
  const accounts = [];
  let accountPageToken = "";
  do {
    const url = new URL(`${GOOGLE_ACCOUNTS_BASE}/accounts`);
    url.searchParams.set("pageSize", "20");
    if (accountPageToken) url.searchParams.set("pageToken", accountPageToken);
    const payload = await fetchJson(options.fetchFn, url, options.accessToken, "Google no pudo listar las cuentas empresariales.");
    accounts.push(...(payload.accounts || []));
    accountPageToken = String(payload.nextPageToken || "");
  } while (accountPageToken);

  const candidates = [];
  for (const account of accounts) {
    const accountId = stripResourcePrefix(account.name, "accounts");
    if (!accountId) continue;
    let locationPageToken = "";
    do {
      const url = new URL(`${GOOGLE_LOCATIONS_BASE}/accounts/${encodeURIComponent(accountId)}/locations`);
      url.searchParams.set("readMask", "name,title,metadata");
      url.searchParams.set("pageSize", "100");
      if (locationPageToken) url.searchParams.set("pageToken", locationPageToken);
      const payload = await fetchJson(options.fetchFn, url, options.accessToken, "Google no pudo listar las ubicaciones empresariales.");
      for (const location of payload.locations || []) {
        candidates.push({
          accountId,
          locationId: stripResourcePrefix(location.name, "locations"),
          title: String(location.title || ""),
        });
      }
      locationPageToken = String(payload.nextPageToken || "");
    } while (locationPageToken);
  }

  const requestedName = options.profileName || "Dunas y Olas";
  // A partial name can select a similarly named, unverified duplicate.
  const matches = candidates.filter((candidate) => candidate.locationId && normalizeName(candidate.title) === normalizeName(requestedName));
  if (matches.length !== 1) throw new Error(`Google no encontró una ficha única para ${requestedName}.`);
  const match = matches[0];
  return { accountId: match.accountId, locationId: match.locationId, title: match.title };
}

async function fetchAllReviews(options) {
  const accountId = stripResourcePrefix(options.accountId, "accounts");
  const locationId = stripResourcePrefix(options.locationId, "locations");
  if (!accountId || !locationId) throw new Error("Faltan los identificadores de la ficha de Google.");

  const reviews = [];
  let pageToken = "";
  let totalReviewCount = 0;
  let averageRating = 0;
  let pages = 0;

  do {
    const url = new URL(`${GOOGLE_REVIEWS_BASE}/accounts/${encodeURIComponent(accountId)}/locations/${encodeURIComponent(locationId)}/reviews`);
    url.searchParams.set("pageSize", "50");
    url.searchParams.set("orderBy", "updateTime desc");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const response = await options.fetchFn(url, {
      headers: { Authorization: `Bearer ${options.accessToken}` },
    });
    const payload = await response.json();
    if (!response.ok) {
      const error = new Error("Google no pudo entregar las reseñas de la ficha.");
      error.status = response.status;
      throw error;
    }

    reviews.push(...(payload.reviews || []).map(normalizeReview));
    totalReviewCount = Number(payload.totalReviewCount || totalReviewCount || reviews.length);
    averageRating = Number(payload.averageRating || averageRating || 0);
    pageToken = String(payload.nextPageToken || "");
    pages += 1;
    if (pages > 100) throw new Error("Google devolvió demasiadas páginas de reseñas.");
  } while (pageToken);

  return {
    rating: averageRating || (reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0),
    reviewCount: totalReviewCount || reviews.length,
    reviews,
  };
}

module.exports = {
  discoverBusinessProfile,
  fetchAllReviews,
  getAccessToken,
  locationMatchScore,
  normalizeReview,
  normalizeName,
  ratingToNumber,
  stripResourcePrefix,
};
