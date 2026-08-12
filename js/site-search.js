(function () {
  "use strict";
  var input = document.getElementById("site-search");
  var results = document.getElementById("site-search-results");
  if (!input || !results) return;
  var hero = input.closest(".home-hero");
  var index = [];
  var revealTimer = 0;
  function positionResults() {
    if (results.classList.contains("hidden")) return;
    var rect = input.getBoundingClientRect();
    var gap = 9;
    var safeBottom = 12;
    var desiredHeight = Math.min(420, Math.max(220, window.innerHeight * 0.4));
    var roomBelow = window.innerHeight - rect.bottom - gap - safeBottom;
    var available = Math.min(desiredHeight, Math.max(120, roomBelow));
    var top = Math.min(rect.bottom + gap, window.innerHeight - available - safeBottom);
    results.style.setProperty("--search-results-top", Math.max(8, top) + "px");
    results.style.setProperty("--search-results-left", Math.max(8, rect.left) + "px");
    results.style.setProperty("--search-results-width", Math.min(rect.width, window.innerWidth - 16) + "px");
    results.style.setProperty("--search-results-height", available + "px");
  }
  function revealResultsBelowInput() {
    window.clearTimeout(revealTimer);
    revealTimer = window.setTimeout(function () {
      var rect = input.getBoundingClientRect();
      var desiredRoom = Math.min(320, Math.max(200, window.innerHeight * 0.33));
      var roomBelow = window.innerHeight - rect.bottom - 18;
      if (roomBelow >= desiredRoom) return;
      var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollBy({ top: desiredRoom - roomBelow + 12, behavior: reduceMotion ? "auto" : "smooth" });
      window.setTimeout(positionResults, reduceMotion ? 0 : 260);
    }, 90);
  }
  function normalize(value) { return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function close() {
    results.classList.add("hidden");
    input.setAttribute("aria-expanded", "false");
    if (hero) hero.classList.remove("site-search-open");
    results.style.removeProperty("--search-results-top");
    results.style.removeProperty("--search-results-left");
    results.style.removeProperty("--search-results-width");
    results.style.removeProperty("--search-results-height");
  }
  function render() {
    var query = normalize(input.value.trim());
    if (query.length < 2) { close(); return; }
    var terms = query.split(/\s+/).filter(Boolean);
    var matches = index.filter(function (item) {
      var haystack = normalize(item.title + " " + item.description + " " + item.keywords);
      return terms.every(function (term) { return haystack.indexOf(term) !== -1; });
    }).slice(0, 8);
    results.innerHTML = "";
    if (!matches.length) {
      results.innerHTML = '<div class="site-search-result site-search-result--empty"><strong>Sin coincidencias</strong><span>Prueba con isla, Barú, playa, kitesurf, comida o Cartagena.</span></div>';
    } else {
      matches.forEach(function (item) {
        var link = document.createElement("a"); link.className = "site-search-result"; link.href = item.url; link.setAttribute("role", "option");
        var image = document.createElement("img");
        image.className = "site-search-result-image";
        image.src = item.image || "/images/logo-icon-nav-small.webp";
        image.alt = "";
        image.loading = "lazy";
        image.decoding = "async";
        var copy = document.createElement("span"); copy.className = "site-search-result-copy";
        var title = document.createElement("strong"); title.textContent = item.title;
        var description = document.createElement("span"); description.textContent = item.description;
        copy.appendChild(title); copy.appendChild(description);
        link.appendChild(image); link.appendChild(copy); results.appendChild(link);
      });
    }
    results.classList.remove("hidden");
    input.setAttribute("aria-expanded", "true");
    if (hero) hero.classList.add("site-search-open");
    positionResults();
    revealResultsBelowInput();
  }
  fetch("/search-index.json").then(function (response) { return response.json(); }).then(function (data) {
    index = Array.isArray(data) ? data : []; input.addEventListener("input", render); input.addEventListener("focus", render);
  }).catch(function () { input.placeholder = "Busca experiencias en nuestro catálogo"; });
  document.addEventListener("click", function (event) { if (!event.target.closest(".site-search-shell")) close(); });
  input.addEventListener("keydown", function (event) { if (event.key === "Escape") close(); });
  window.addEventListener("resize", positionResults, { passive: true });
  window.addEventListener("scroll", positionResults, { passive: true });
})();
