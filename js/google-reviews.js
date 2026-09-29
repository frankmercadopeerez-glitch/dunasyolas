(function () {
  "use strict";

  document.querySelectorAll("[data-google-reviews]").forEach(function (carousel) {
    var track = carousel.querySelector(".google-reviews-track");
    var set = carousel.querySelector(".google-reviews-set");
    var pause = carousel.querySelector(".google-reviews-pause");
    if (!track || !set) return;

    if (!track.querySelector('[data-review-clone="true"]')) {
      var clone = set.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("data-review-clone", "true");
      clone.querySelectorAll("a,button").forEach(function (node) { node.setAttribute("tabindex", "-1"); });
      track.appendChild(clone);
    }

    var manuallyPaused = false;
    var hoverPaused = false;
    var focusPaused = false;

    function renderPauseState() {
      track.classList.toggle("is-paused", manuallyPaused || hoverPaused || focusPaused);
      if (!pause) return;
      pause.setAttribute("aria-pressed", manuallyPaused ? "true" : "false");
      pause.textContent = manuallyPaused ? pause.dataset.playLabel : pause.dataset.pauseLabel;
    }

    if (pause) {
      pause.addEventListener("click", function () {
        manuallyPaused = !manuallyPaused;
        renderPauseState();
      });
    }
    carousel.addEventListener("mouseenter", function () { hoverPaused = true; renderPauseState(); });
    carousel.addEventListener("mouseleave", function () { hoverPaused = false; renderPauseState(); });
    carousel.addEventListener("focusin", function () { focusPaused = true; renderPauseState(); });
    carousel.addEventListener("focusout", function (event) {
      if (!carousel.contains(event.relatedTarget)) { focusPaused = false; renderPauseState(); }
    });
  });
})();
