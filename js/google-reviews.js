(function () {
  "use strict";
  var REFRESH_INTERVAL = 60000;
  function card(review, english) {
    var article = document.createElement("article");
    article.className = "google-review-card";
    article.dataset.reviewId = review.id || "";
    var top = document.createElement("div");
    top.className = "google-review-top";
    var stars = document.createElement("span");
    stars.className = "google-review-stars";
    stars.setAttribute("aria-label", review.rating + (english ? " out of 5 stars" : " de 5 estrellas"));
    stars.textContent = "★★★★★";
    var brand = document.createElement("img");
    brand.className = "google-review-brand";
    brand.src = "/images/google-g.png";
    brand.alt = "Google";
    brand.width = brand.height = 24;
    top.append(stars, brand);
    var quote = document.createElement("blockquote");
    quote.textContent = review.text || (english ? "Rating submitted without a written comment." : "Calificación publicada sin comentario escrito.");
    var attribution = document.createElement("div");
    attribution.className = "google-review-attribution";
    var avatar = document.createElement("span");
    avatar.className = "google-review-avatar";
    var avatarImage = document.createElement("img");
    avatarImage.src = /^https:\/\//i.test(review.authorImage || "") ? review.authorImage : "/images/google-g.png";
    avatarImage.alt = "";
    avatarImage.width = avatarImage.height = 32;
    avatarImage.loading = "lazy";
    avatarImage.addEventListener("error", function () { if (!avatarImage.src.endsWith("/images/google-g.png")) avatarImage.src = "/images/google-g.png"; });
    avatar.appendChild(avatarImage);
    var text = document.createElement("span");
    var name = document.createElement("cite");
    name.textContent = review.author || (english ? "Google traveler" : "Viajero de Google");
    var source = document.createElement("span");
    source.className = "google-review-source";
    source.textContent = english ? "Review on Google" : "Reseña en Google";
    text.append(name, source);
    attribution.append(avatar, text);
    article.append(top, quote, attribution);
    return article;
  }
  document.querySelectorAll("[data-google-reviews]").forEach(function (carousel) {
    var viewport = carousel.querySelector(".google-reviews-viewport");
    var track = carousel.querySelector(".google-reviews-track");
    var set = carousel.querySelector(".google-reviews-set");
    if (!viewport || !track || !set) return;
    var english = (carousel.dataset.lang || document.documentElement.lang || "es").toLowerCase().startsWith("en");
    var score = carousel.querySelector("[data-review-score]");
    var count = carousel.querySelector("[data-review-count]");
    var scoreBox = carousel.querySelector(".google-reviews-score");
    var baseCards = Array.from(set.children).map(function (node) { return node.cloneNode(true); });
    var lastFingerprint = "";
    var arrangedWidth = 0;
    function arrange() {
      arrangedWidth = viewport.clientWidth;
      track.classList.remove("is-ready");
      track.querySelectorAll('[data-review-clone="true"]').forEach(function (node) { node.remove(); });
      while (set.children.length > baseCards.length) set.lastElementChild.remove();
      if (!baseCards.length) return;
      var originalWidth = set.getBoundingClientRect().width;
      var repeats = Math.max(1, Math.ceil((viewport.clientWidth + 310) / Math.max(originalWidth, 1)));
      for (var index = 1; index < repeats; index++) baseCards.forEach(function (node) { set.appendChild(node.cloneNode(true)); });
      var clone = set.cloneNode(true);
      clone.dataset.reviewClone = "true";
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
      var width = set.getBoundingClientRect().width;
      track.style.setProperty("--review-distance", -width + "px");
      track.style.setProperty("--review-duration", Math.max(20, width / 48) + "s");
      track.classList.add("is-ready");
    }
    function render(payload) {
      var fingerprint = [payload.reviewCount, payload.rating].concat(payload.reviews.map(function (review) { return [review.id, review.updateTime, review.text, review.authorImage].join(":"); })).join("|");
      if (fingerprint === lastFingerprint) return;
      lastFingerprint = fingerprint;
      baseCards = payload.reviews.map(function (review) { return card(review, english); });
      set.replaceChildren.apply(set, baseCards.map(function (node) { return node.cloneNode(true); }));
      arrange();
      var rating = Number(payload.rating || 0).toFixed(1);
      if (score) score.textContent = rating;
      if (count) count.textContent = payload.reviewCount + (english ? " reviews on Google" : " reseñas en Google");
      if (scoreBox) scoreBox.setAttribute("aria-label", rating + (english ? " out of 5, " : " de 5, ") + payload.reviewCount + (english ? " reviews on Google" : " reseñas en Google"));
      document.querySelectorAll("[data-google-fact-rating]").forEach(function (node) { node.textContent = rating; });
      document.querySelectorAll("[data-google-fact-count]").forEach(function (node) { node.textContent = payload.reviewCount; });
      carousel.dataset.liveState = payload.live ? "live" : "fallback";
    }
    async function refresh() {
      try {
        var response = await fetch("/api/google-reviews", { cache: "no-store", headers: { Accept: "application/json" } });
        if (!response.ok) return;
        var payload = await response.json();
        if (payload && Array.isArray(payload.reviews) && payload.reviews.length) render(payload);
      } catch (error) { carousel.dataset.liveState = "fallback"; }
    }
    arrange();
    refresh();
    window.setInterval(refresh, REFRESH_INTERVAL);
    if (window.ResizeObserver) new ResizeObserver(function () { if (viewport.clientWidth !== arrangedWidth) arrange(); }).observe(viewport);
    else window.addEventListener("resize", function () { if (viewport.clientWidth !== arrangedWidth) arrange(); });
  });
})();
