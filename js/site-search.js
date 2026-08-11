(function () {
  "use strict";
  var input = document.getElementById("site-search");
  var results = document.getElementById("site-search-results");
  if (!input || !results) return;
  var hero = input.closest(".home-hero");
  var index = [];
  function positionResults() {
    if (results.classList.contains("hidden")) return;
    var rect = input.getBoundingClientRect();
    var gap = 9;
    var roomBelow = window.innerHeight - rect.bottom - gap - 8;
    var roomAbove = rect.top - gap - 8;
    var placeAbove = roomBelow < 180 && roomAbove > roomBelow;
    var available = Math.max(96, Math.min(420, placeAbove ? roomAbove : roomBelow));
    var top = placeAbove ? Math.max(8, rect.top - gap - available) : rect.bottom + gap;
    results.style.setProperty("--search-results-top", top + "px");
    results.style.setProperty("--search-results-left", Math.max(8, rect.left) + "px");
    results.style.setProperty("--search-results-width", Math.min(rect.width, window.innerWidth - 16) + "px");
    results.style.setProperty("--search-results-height", available + "px");
    results.classList.toggle("site-search-results--above", placeAbove);
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
    results.classList.remove("site-search-results--above");
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
      results.innerHTML = '<div class="site-search-result"><strong>Sin coincidencias</strong><span>Prueba con isla, Barú, playa, kitesurf, comida o Cartagena.</span></div>';
    } else {
      matches.forEach(function (item) {
        var link = document.createElement("a"); link.className = "site-search-result"; link.href = item.url; link.setAttribute("role", "option");
        var title = document.createElement("strong"); title.textContent = item.title;
        var description = document.createElement("span"); description.textContent = item.description;
        link.appendChild(title); link.appendChild(description); results.appendChild(link);
      });
    }
    results.classList.remove("hidden");
    input.setAttribute("aria-expanded", "true");
    if (hero) hero.classList.add("site-search-open");
    positionResults();
  }
  fetch("/search-index.json").then(function (response) { return response.json(); }).then(function (data) {
    index = Array.isArray(data) ? data : []; input.addEventListener("input", render); input.addEventListener("focus", render);
  }).catch(function () { input.placeholder = "Busca experiencias en nuestro catálogo"; });
  document.addEventListener("click", function (event) { if (!event.target.closest(".site-search-shell")) close(); });
  input.addEventListener("keydown", function (event) { if (event.key === "Escape") close(); });
  window.addEventListener("resize", positionResults, { passive: true });
  window.addEventListener("scroll", positionResults, { passive: true });
})();
