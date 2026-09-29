"use strict";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_REVIEWS_BASE = "https://mybusiness.googleapis.com/v4";

function stripResourcePrefix(value, prefix) {
  return String(value || "")
    .trim()
    .replace(new RegExp(`^${prefix}/`, "i"), "")
    .replace(/\/$/, "");
}

function ratingToNumber(value) {
  const ratings = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  if (typeof value === "number") return Math.max(1, Math.min(5, value));
  return ratings[String(value || "").toUpperCase()] || 5;
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
  fetchAllReviews,
  getAccessToken,
  normalizeReview,
  ratingToNumber,
  stripResourcePrefix,
};
