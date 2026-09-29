(function () {
  "use strict";

  var REFRESH_INTERVAL = 60000;
  var ADVANCE_INTERVAL = 5000;

  function isEnglish(carousel) {
    return (carousel.dataset.lang || document.documentElement.lang || "es").toLowerCase().startsWith("en");
  }

  function createReviewCard(review, english) {
    var article = document.createElement("article");
    article.className = "google-review-card";
    article.setAttribute("data-review-id", review.id || "");
    var stars = document.createElement("div");
    var starText = document.createElement("span");
    starText.className = "google-review-stars";
    starText.setAttribute("aria-label", english ? review.rating + " out of 5 stars" : review.rating + " de 5 estrellas");
    starText.textContent = "★★★★★";
    stars.appendChild(starText);
    var quote = document.createElement("blockquote");
    quote.textContent = review.text || (english ? "Rating submitted without a written comment." : "Calificación publicada sin comentario escrito.");
    var attribution = document.createElement("div");
    attribution.className = "google-review-attribution";
    var cite = document.createElement("cite");
    cite.textContent = review.author || (english ? "Google traveler" : "Viajero de Google");
    var source = document.createElement("span");
    source.className = "google-review-source";
    source.textContent = english ? "Public review on Google" : "Reseña pública en Google";
    attribution.append(cite, source);
    article.append(stars, quote, attribution);
    return article;
  }

  function fingerprint(payload) {
    return [payload.reviewCount, payload.rating].concat((payload.reviews || []).map(function (review) {
      return [review.id, review.updateTime, review.text].join(":");
    })).join("|");
  }

  document.querySelectorAll("[data-google-reviews]").forEach(function (carousel) {
    var viewport = carousel.querySelector(".google-reviews-viewport");
    var track = carousel.querySelector(".google-reviews-track");
    var set = carousel.querySelector(".google-reviews-set");
    var pause = carousel.querySelector(".google-reviews-pause");
    var previous = carousel.querySelector("[data-review-prev]");
    var next = carousel.querySelector("[data-review-next]");
    var score = carousel.querySelector("[data-review-score]");
    var count = carousel.querySelector("[data-review-count]");
    var scoreBox = carousel.querySelector(".google-reviews-score");
    var note = carousel.querySelector("[data-review-note]");
    var english = isEnglish(carousel);
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!track || !set || !viewport) return;

    var clone = set.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("data-review-clone", "true");
    track.appendChild(clone);

    var manuallyPaused = false;
    var hoverPaused = false;
    var focusPaused = false;
    var advanceTimer = null;
    var lastFingerprint = "";

    function isPaused() { return manuallyPaused || hoverPaused || focusPaused || reducedMotion; }
    function renderPauseState() {
      track.classList.toggle("is-paused", isPaused());
      if (!pause) return;
      pause.setAttribute("aria-pressed", manuallyPaused ? "true" : "false");
      pause.textContent = manuallyPaused ? pause.dataset.playLabel : pause.dataset.pauseLabel;
    }
    function cardStep() {
      var card = set.querySelector(".google-review-card");
      if (!card) return viewport.clientWidth;
      var gap = parseFloat(window.getComputedStyle(set).gap) || 0;
      return card.getBoundingClientRect().width + gap;
    }
    function move(direction) {
      if (!track.classList.contains("is-dynamic")) return;
      var maximum = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      var destination = viewport.scrollLeft + direction * cardStep();
      if (direction > 0 && destination >= maximum - 4) destination = 0;
      if (direction < 0 && destination <= 4) destination = maximum;
      viewport.scrollTo({ left: destination, behavior: reducedMotion ? "auto" : "smooth" });
    }
    function startAdvance() {
      window.clearInterval(advanceTimer);
      advanceTimer = window.setInterval(function () { if (!isPaused()) move(1); }, ADVANCE_INTERVAL);
    }
    function render(payload) {
      var currentFingerprint = fingerprint(payload);
      if (currentFingerprint === lastFingerprint) return;
      lastFingerprint = currentFingerprint;
      set.replaceChildren();
      (payload.reviews || []).forEach(function (review) { set.appendChild(createReviewCard(review, english)); });
      track.querySelectorAll('[data-review-clone="true"]').forEach(function (node) { node.remove(); });
      track.classList.add("is-dynamic");
      viewport.classList.add("is-dynamic");
      viewport.scrollLeft = 0;
      if (score) score.textContent = Number(payload.rating || 0).toFixed(1);
      if (count) count.textContent = payload.reviewCount + (english ? " reviews on Google" : " reseñas en Google");
      if (scoreBox) scoreBox.setAttribute("aria-label", Number(payload.rating || 0).toFixed(1) + (english ? " out of 5, " : " de 5, ") + payload.reviewCount + (english ? " reviews on Google" : " reseñas en Google"));
      document.querySelectorAll("[data-google-fact-rating]").forEach(function (node) { node.textContent = Number(payload.rating || 0).toFixed(1); });
      document.querySelectorAll("[data-google-fact-count]").forEach(function (node) { node.textContent = payload.reviewCount; });
      if (note) {
        var updated = payload.updatedAt ? new Date(payload.updatedAt) : new Date();
        var date = Number.isNaN(updated.getTime()) ? "" : new Intl.DateTimeFormat(english ? "en" : "es-CO", { dateStyle: "medium", timeStyle: "short" }).format(updated);
        note.textContent = payload.live
          ? (english ? "Reviews are loaded automatically from the official Google profile. Last refresh: " : "Las reseñas se cargan automáticamente desde la ficha oficial de Google. Última actualización: ") + date + "."
          : (english ? "Showing the latest verified backup while the live Google connection is being completed." : "Mostramos la última copia verificada mientras se completa la conexión en vivo con Google.");
      }
      startAdvance();
    }
    async function refresh() {
      try {
        var response = await fetch("/api/google-reviews", { cache: "no-store", headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("reviews_unavailable");
        var payload = await response.json();
        if (payload && Array.isArray(payload.reviews) && payload.reviews.length) render(payload);
      } catch (error) { carousel.dataset.liveState = "fallback"; }
    }

    if (pause) pause.addEventListener("click", function () { manuallyPaused = !manuallyPaused; renderPauseState(); });
    if (previous) previous.addEventListener("click", function () { move(-1); });
    if (next) next.addEventListener("click", function () { move(1); });
    carousel.addEventListener("mouseenter", function () { hoverPaused = true; renderPauseState(); });
    carousel.addEventListener("mouseleave", function () { hoverPaused = false; renderPauseState(); });
    carousel.addEventListener("focusin", function () { focusPaused = true; renderPauseState(); });
    carousel.addEventListener("focusout", function (event) { if (!carousel.contains(event.relatedTarget)) { focusPaused = false; renderPauseState(); } });
    renderPauseState();
    refresh();
    window.setInterval(refresh, REFRESH_INTERVAL);
  });
})();
