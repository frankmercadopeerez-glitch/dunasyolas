"use strict";

const assert = require("node:assert/strict");
const { discoverBusinessProfile, fetchAllReviews, locationMatchScore, normalizeReview, ratingToNumber } = require("../lib/google-business-reviews");
const reviewsHandler = require("../api/google-reviews");

async function run() {
  assert.equal(ratingToNumber("FIVE"), 5);
  assert.equal(ratingToNumber("ONE"), 1);
  assert.equal(locationMatchScore("Dunas & Olas", "Dunas y Olas"), 100);
  assert.deepEqual(normalizeReview({
    reviewId: "r-1",
    reviewer: { displayName: "Cliente" },
    starRating: "FOUR",
    comment: " Muy bien ",
    createTime: "2026-01-01T00:00:00Z",
  }), {
    id: "r-1",
    author: "Cliente",
    authorImage: "",
    rating: 4,
    text: "Muy bien",
    createTime: "2026-01-01T00:00:00Z",
    updateTime: "2026-01-01T00:00:00Z",
  });

  const calls = [];
  const fetchFn = async (url) => {
    const parsed = new URL(String(url));
    calls.push(parsed);
    const page = parsed.searchParams.get("pageToken") || "page-1";
    const pageNumber = page === "page-1" ? 1 : page === "page-2" ? 2 : page === "page-3" ? 3 : 4;
    const count = pageNumber < 4 ? 50 : 50;
    return {
      ok: true,
      json: async () => ({
        reviews: Array.from({ length: count }, (_, index) => ({
          reviewId: `r-${pageNumber}-${index}`,
          reviewer: { displayName: `Cliente ${pageNumber}-${index}` },
          starRating: "FIVE",
          comment: `Reseña ${pageNumber}-${index}`,
        })),
        totalReviewCount: 200,
        averageRating: 5,
        nextPageToken: pageNumber < 4 ? `page-${pageNumber + 1}` : "",
      }),
    };
  };

  const result = await fetchAllReviews({
    fetchFn,
    accessToken: "test-token",
    accountId: "accounts/123",
    locationId: "locations/456",
  });
  assert.equal(result.reviews.length, 200);
  assert.equal(result.reviewCount, 200);
  assert.equal(result.rating, 5);
  assert.equal(calls.length, 4);
  assert.ok(calls.every((url) => url.searchParams.get("pageSize") === "50"));
  assert.equal(calls[3].searchParams.get("pageToken"), "page-4");

  const discovered = await discoverBusinessProfile({
    accessToken: "test-token",
    profileName: "MEXICANA EN CARTAGENA & DUNAS Y OLAS AGENCIA TURÍSTICA MULTICULTURAL",
    fetchFn: async (url) => {
      const value = String(url);
      if (value.includes("mybusinessaccountmanagement")) {
        return { ok: true, json: async () => ({ accounts: [{ name: "accounts/123" }] }) };
      }
      return {
        ok: true,
        json: async () => ({
          locations: [
            { name: "locations/999", title: "Otra empresa" },
            { name: "locations/456", title: "MEXICANA EN CARTAGENA & DUNAS Y OLAS AGENCIA TURÍSTICA MULTICULTURAL" },
          ],
        }),
      };
    },
  });
  assert.deepEqual(discovered, { accountId: "123", locationId: "456", title: "MEXICANA EN CARTAGENA & DUNAS Y OLAS AGENCIA TURÍSTICA MULTICULTURAL" });

  await assert.rejects(discoverBusinessProfile({
    accessToken: "test-token",
    profileName: "MEXICANA EN CARTAGENA & DUNAS Y OLAS AGENCIA TURÍSTICA MULTICULTURAL",
    fetchFn: async (url) => ({
      ok: true,
      json: async () => String(url).includes("mybusinessaccountmanagement")
        ? { accounts: [{ name: "accounts/123" }] }
        : { locations: [{ name: "locations/999", title: "Dunas & Olas" }] },
    }),
  }), /ficha única/);

  const response = {
    statusCode: 0,
    headers: {},
    status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name] = value; },
    end(body) { this.body = body; return this; },
  };
  await reviewsHandler({ method: "GET" }, response);
  const backup = JSON.parse(response.body);
  assert.equal(response.statusCode, 200);
  assert.equal(backup.source, "verified-backup");
  assert.equal(backup.live, false);
  assert.ok(backup.reviews.length >= 3);
  console.log("Google reviews API: pagination and normalization verified for 200 reviews.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
