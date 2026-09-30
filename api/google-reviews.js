"use strict";

const fallback = require("../data/google-reviews.json");
const { discoverBusinessProfile, fetchAllReviews, getAccessToken } = require("../lib/google-business-reviews");

let resolvedProfileCache = null;

function json(res, status, body, cacheControl) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cacheControl || "public, s-maxage=60, stale-while-revalidate=300");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.end(JSON.stringify(body));
}

function fallbackPayload(reason) {
  return {
    source: "verified-backup",
    live: false,
    profileName: fallback.profileName,
    profileUrl: fallback.profileUrl,
    rating: fallback.rating,
    reviewCount: fallback.reviewCount,
    updatedAt: fallback.verifiedOn,
    reviews: fallback.reviews.map((review, index) => ({
      id: `backup-${index + 1}`,
      author: review.author,
      authorImage: "",
      rating: review.rating,
      text: review.textEs,
      textEn: review.textEn,
      createTime: null,
      updateTime: null,
    })),
    reason,
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Método no permitido." }, "no-store");
  }

  const config = {
    clientId: process.env.GOOGLE_BUSINESS_CLIENT_ID,
    clientSecret: process.env.GOOGLE_BUSINESS_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_BUSINESS_REFRESH_TOKEN,
    profileName: fallback.profileName,
  };
  if (!config.clientId || !config.clientSecret || !config.refreshToken) {
    return json(res, 200, fallbackPayload("google_business_not_configured"));
  }

  try {
    const accessToken = await getAccessToken({ ...config, fetchFn: fetch });
    if (!resolvedProfileCache || resolvedProfileCache.expiresAt < Date.now()) {
      const profile = await discoverBusinessProfile({
        fetchFn: fetch,
        accessToken,
        profileName: config.profileName,
      });
      resolvedProfileCache = { value: profile, expiresAt: Date.now() + 60 * 60 * 1000 };
    }
    const result = await fetchAllReviews({
      fetchFn: fetch,
      accessToken,
      accountId: resolvedProfileCache.value.accountId,
      locationId: resolvedProfileCache.value.locationId,
    });
    return json(res, 200, {
      source: "google-business-profile",
      live: true,
      profileName: fallback.profileName,
      profileUrl: fallback.profileUrl,
      rating: result.rating,
      reviewCount: result.reviewCount,
      updatedAt: new Date().toISOString(),
      reviews: result.reviews,
    });
  } catch (error) {
    console.error("Google Business reviews error", {
      status: error.status || 500,
      message: error.message,
    });
    return json(res, 200, fallbackPayload("google_business_temporarily_unavailable"), "public, s-maxage=30, stale-while-revalidate=300");
  }
};
