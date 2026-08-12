(function () {
  "use strict";

  document.documentElement.classList.add("brand-refresh-active");

  function initBrandIdentity() {
    document.querySelectorAll("nav span").forEach(function (node) {
      if (node.textContent.trim() === "Cartagena de Indias") {
        node.textContent = "Mexicana en Cartagena";
      }
    });
  }

  function initGalleryNavigation() {
    var isEnglish = (document.documentElement.lang || "es").toLowerCase().indexOf("en") === 0;
    var label = isEnglish ? "GALLERY" : "GALERÍA";

    function addLink(container, mobile) {
      if (!container || container.querySelector('a[href*="galeria"]')) return;
      var links = Array.prototype.slice.call(container.querySelectorAll("a"));
      var experiences = links.find(function (link) {
        return /experien/i.test(link.textContent || "");
      });
      var link = document.createElement("a");
      link.href = "/galeria.html";
      link.textContent = label;
      link.className = experiences && experiences.className
        ? experiences.className
        : (mobile ? "text-2xl font-bold text-white hover:text-blue-400" : "text-white hover:text-blue-400 transition");
      if (experiences) experiences.insertAdjacentElement("afterend", link);
      else container.appendChild(link);
    }

    var nav = document.querySelector("nav");
    if (!nav) return;
    addLink(nav.querySelector(".hidden.md\\:flex"), false);
    addLink(document.getElementById("mobile-menu"), true);
  }

  function removeNewsletterSections() {
    document.querySelectorAll("#newsletter-form").forEach(function (form) {
      var section = form.closest("section");
      if (section) section.remove();
      else form.remove();
    });
  }

  function initSiteFooter() {
    var footer = document.querySelector("footer");
    if (!footer) {
      footer = document.createElement("footer");
      var whatsapp = document.querySelector(".whatsapp-container");
      if (whatsapp) whatsapp.before(footer);
      else document.body.appendChild(footer);
    }
    var isEnglish = (document.documentElement.lang || "es").toLowerCase().indexOf("en") === 0;
    var copy = isEnglish ? {
      signature: "Mexican in Cartagena",
      tagline: "The warmth of the north, the magic of the Caribbean.",
      explore: "Explore",
      planner: "Plan your trip",
      experiences: "Experiences",
      about: "About us",
      contact: "Contact",
      social: "Social media",
      rights: "All rights reserved.",
      terms: "Terms and Conditions",
      privacy: "Privacy Policy",
      faq: "Frequently Asked Questions",
    } : {
      signature: "Mexicana en Cartagena",
      tagline: "La calidez del norte, la magia del Caribe.",
      explore: "Explorar",
      planner: "Arma tu viaje",
      experiences: "Experiencias",
      about: "Nosotros",
      contact: "Contacto",
      social: "Redes",
      rights: "Todos los derechos reservados.",
      terms: "Terminos y Condiciones",
      privacy: "Politica de Privacidad",
      faq: "Preguntas Frecuentes",
    };

    footer.className = "site-footer bg-gray-900 text-white pt-12 pb-8 border-t border-gray-800";
    footer.innerHTML = `
      <div class="container mx-auto px-6 text-center md:text-left">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 md:mb-12">
          <div class="flex flex-col items-center md:items-start">
            <picture><source srcset="/images/logo-master.webp" type="image/webp"/><img src="/images/logo-master.png" alt="Dunas & Olas - ${copy.signature}" width="315" height="148" class="h-12 w-auto object-contain mb-2" loading="lazy" decoding="async"/></picture>
            <span class="block mb-4 leading-none select-none">
              <span class="block font-extrabold tracking-tight text-xl text-white">Dunas <span class="text-yellow-500">&amp; Olas</span></span>
              <span class="brand-signature block text-[9px] uppercase tracking-[0.25em] text-gray-400 font-semibold mt-1">${copy.signature}</span>
            </span>
            <p class="text-gray-400 text-xs leading-relaxed max-w-xs">${copy.tagline}</p>
          </div>
          <div>
            <h3 class="text-white font-bold mb-4 text-sm">${copy.explore}</h3>
            <ul class="space-y-2 text-gray-400 text-xs">
              <li><a href="/arma-tu-viaje" class="hover:text-yellow-400">&#10022; ${copy.planner}</a></li>
              <li><a href="/experiences" class="hover:text-blue-400">${copy.experiences}</a></li>
              <li><a href="/galeria" class="hover:text-blue-400">${isEnglish ? "Gallery" : "Galeria"}</a></li>
              <li><a href="/kitesurf" class="hover:text-blue-400">Kitesurf</a></li>
              <li><a href="${isEnglish ? "/en/about" : "/about"}" class="hover:text-blue-400">${copy.about}</a></li>
              <li><a href="${isEnglish ? "/en/blog/" : "/blog/"}" class="hover:text-blue-400">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-bold mb-4 text-sm">${copy.contact}</h3>
            <ul class="space-y-2 text-gray-400 text-xs flex flex-col items-center md:items-start">
              <li class="flex items-center"><i class="fas fa-map-marker-alt mr-2 text-blue-500"></i>Manga, Cartagena</li>
              <li class="flex items-center"><i class="fab fa-whatsapp mr-2 text-blue-500"></i>+57 316 303 0589</li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-bold mb-4 text-sm">${copy.social}</h3>
            <div class="flex justify-center md:justify-start gap-2">
              <a href="https://www.instagram.com/mexicanaencartagena?igsh=MTJ2MjZwdmU5NjZ4Nw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="transition hover:opacity-80"><img src="/images/instagram-logo.png" alt="Instagram" class="w-12 h-12 hover:scale-110 transition transform" width="512" height="512" loading="lazy" decoding="async"/></a>
              <a href="https://www.facebook.com/share/1aQqHEvkyG/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="transition hover:opacity-80"><img src="/images/logo-facebook.png" alt="Facebook" class="w-12 h-12 hover:scale-110 transition transform" width="512" height="512" loading="lazy" decoding="async"/></a>
              <a href="https://www.tiktok.com/@mexicanaencartagena?_r=1&amp;_t=ZS-97Sfx04blGW" target="_blank" rel="noopener noreferrer" aria-label="TikTok" class="social-badge transition hover:opacity-80" style="background:#000"><i class="fab fa-tiktok"></i></a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-6 text-[10px] md:text-xs text-gray-400 text-center">
          <p>&copy; 2026 Dunas &amp; Olas. ${copy.rights}</p>
          <p class="mt-1">RNT No. 292710</p>
          <div class="mt-2 space-x-3"><a href="/policies" class="hover:text-white">${copy.terms}</a> &middot; <a href="/privacy" class="hover:text-white">${copy.privacy}</a> &middot; <a href="/faq" class="hover:text-white">${copy.faq}</a></div>
        </div>
      </div>`;
  }

  function removeLegacyBookingBars() {
    document.querySelectorAll('body > div[class~="fixed"][class~="bottom-0"]').forEach(function (bar) {
      if (bar.querySelector('button[onclick*="addToCart"]')) bar.remove();
    });
  }

  function initWhatsAppMessages() {
    var nativeOpen = window.open.bind(window);
    var clickContext = "";

    function cleanLabel(value) {
      return String(value || "")
        .replace(/\s+/g, " ")
        .replace(/^[\s\-–—:|]+|[\s\-–—:|]+$/g, "")
        .trim()
        .slice(0, 140);
    }

    // WhatsApp messages can contain a complete itinerary, notes and contact
    // details. Keep those line breaks and characters intact; the 140-character
    // limit above is only appropriate for a card/page title.
    function cleanMessage(value) {
      return String(value || "")
        .replace(/\r\n?/g, "\n")
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
        .trim();
    }

    function messageHasSitePrefix(value) {
      return /^¡?Hola,\s*vengo\s+desde\s+la\s+web\s+de\s+Dunas\s+y\s+Olas/i.test(value);
    }

    function normalize(value) {
      return cleanLabel(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
    }

    function pageContext(trigger) {
      var scope = trigger && trigger.closest
        ? trigger.closest("[data-experience-name], [data-tour-name], article, .experience-card, .tour-card, .package-card, .day-card")
        : null;
      var explicit = scope && (scope.getAttribute("data-experience-name") || scope.getAttribute("data-tour-name"));
      var scopedTitle = scope && scope.querySelector("h2, h3, h4, [data-title], .title");
      var heading = document.querySelector("main h1, body > header h1, h1");
      var titleNode = scopedTitle || heading;
      var titleText = titleNode && (titleNode.innerText || titleNode.textContent);
      var title = cleanLabel(explicit || titleText || clickContext);

      if (!title || /^(inicio|contacto|tu carrito|arma tu viaje|dunas\s*&\s*olas)$/i.test(title)) {
        title = cleanLabel(document.title.split("|")[0].split("–")[0]);
      }
      return title || "las experiencias en Cartagena";
    }

    function personalizedMessage(original, trigger) {
      var context = pageContext(trigger);
      var base = "Hola, vengo desde la web de Dunas y Olas y quiero más información sobre " + context + ".";
      var source = cleanMessage(original);

      // Reservation messages are already fully composed by the itinerary
      // checkout. Never replace or shorten them: doing so used to cut the
      // message at 140 characters and hide the selected activities, total and
      // customer details in WhatsApp.
      if (messageHasSitePrefix(source) || /MI ITINERARIO|TOTAL ESTIMADO|PAGO ELEGIDO|Nombre:\s|WhatsApp:\s|Correo:\s/i.test(source)) {
        return source;
      }

      var detail = cleanMessage(source
        .replace(/^hola[,!\s]*/i, "")
        .replace(/^vengo desde la web de dunas y olas[^.]*\.?/i, ""));

      if (!detail || /^(quiero|quisiera|me gustar[ií]a)\s+m[aá]s informaci[oó]n\.?$/i.test(detail)) return base;
      var contextKey = normalize(context);
      var detailKey = normalize(detail);
      if (contextKey && detailKey.indexOf(contextKey) !== -1 && detailKey.length < contextKey.length + 55) return base;
      return base + "\n\nDetalle de mi consulta: " + detail;
    }

    function personalizeUrl(rawUrl, trigger) {
      try {
        var url = new URL(String(rawUrl), window.location.href);
        if (!/(^|\.)wa\.me$|(^|\.)api\.whatsapp\.com$/i.test(url.hostname)) return rawUrl;
        var original = url.searchParams.get("text") || "";
        if (messageHasSitePrefix(original) || /MI ITINERARIO|TOTAL ESTIMADO|PAGO ELEGIDO|Nombre:\s|WhatsApp:\s|Correo:\s/i.test(original)) return url.toString();
        url.searchParams.set("text", personalizedMessage(original, trigger));
        return url.toString();
      } catch (_error) {
        return rawUrl;
      }
    }

    document.addEventListener("click", function (event) {
      var trigger = event.target.closest("a, button");
      if (!trigger) return;
      var nearbyTitle = trigger.closest("article, .experience-card, .tour-card, .package-card, .day-card");
      var heading = nearbyTitle && nearbyTitle.querySelector("h2, h3, h4, [data-title], .title");
      clickContext = cleanLabel(heading && heading.textContent);
      window.setTimeout(function () { clickContext = ""; }, 1000);

      if (trigger.tagName === "A" && trigger.href && /wa\.me|api\.whatsapp\.com/i.test(trigger.href)) {
        trigger.href = personalizeUrl(trigger.href, trigger);
      }
    }, true);

    window.open = function (url, target, features) {
      return nativeOpen(personalizeUrl(url, document.activeElement), target, features);
    };
  }

  function addMarineSectionTransitions() {
    function solidBackground(node, fallback) {
      var current = node;
      while (current && current !== document.documentElement) {
        var styles = getComputedStyle(current);
        var color = styles.backgroundColor;
        if (color && color !== "rgba(0, 0, 0, 0)" && color !== "transparent") return color;
        if (styles.backgroundImage && styles.backgroundImage !== "none") {
          var gradientColors = styles.backgroundImage.match(/rgba?\([^\)]+\)/g) || [];
          var gradientColor = gradientColors.find(function (candidate) {
            return !/rgba\([^\)]+,\s*0(?:\.0+)?\s*\)/.test(candidate);
          });
          if (gradientColor) return gradientColor;
        }
        current = current.parentElement;
      }
      return fallback;
    }

    var sections = Array.prototype.slice.call(document.querySelectorAll("body > section, main > section"));
    sections.forEach(function (section) {
      var previous = section.previousElementSibling;
      if (!previous || previous.classList.contains("dyo-wave-divider")) return;
      if (!(previous.matches("section") || previous.matches("header") || previous.matches("main"))) return;

      var previousColor = solidBackground(previous, "#10293a");
      var nextColor = solidBackground(section, "#fffdf9");
      if (previousColor === nextColor) return;

      var wave = document.createElement("div");
      wave.className = "dyo-wave-divider";
      wave.setAttribute("aria-hidden", "true");
      wave.style.setProperty("--dyo-wave-from", previousColor);
      wave.style.setProperty("--dyo-wave-to", nextColor);
      wave.innerHTML = '<svg viewBox="0 0 1440 70" preserveAspectRatio="none"><rect width="1440" height="70"/><path d="M0 40C120 20 240 20 360 40s240 20 360 0 240-20 360 0 240 20 360 0v30H0Z"/></svg>';
      section.before(wave);
    });
  }

  function initReveal() {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var nodes = document.querySelectorAll("main section, body > section, article");
    nodes.forEach(function (node) { node.classList.add("reveal-ready"); });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -5%", threshold: 0.001 });
    nodes.forEach(function (node) { observer.observe(node); });
  }

  function initGallery() {
    var tiles = document.querySelectorAll("[data-gallery-src]");
    if (!tiles.length) return;
    var box = document.createElement("div");
    box.className = "gallery-lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Vista ampliada de la galería");
    box.innerHTML = '<button type="button" aria-label="Cerrar galería">&times;</button><img alt="" />';
    document.body.appendChild(box);
    var image = box.querySelector("img");
    var close = box.querySelector("button");
    function hide() { box.classList.remove("is-open"); document.body.style.overflow = ""; }
    tiles.forEach(function (tile) {
      tile.setAttribute("tabindex", "0");
      tile.setAttribute("role", "button");
      tile.setAttribute("aria-label", "Ver " + (tile.getAttribute("data-label") || "fotografía") + " en tamaño completo");
      function show() {
        image.src = tile.getAttribute("data-gallery-src");
        image.alt = tile.querySelector("img")?.alt || "Fotografía de una experiencia en Cartagena";
        box.classList.add("is-open");
        document.body.style.overflow = "hidden";
        close.focus();
      }
      tile.addEventListener("click", show);
      tile.addEventListener("keydown", function (event) { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); show(); } });
    });
    close.addEventListener("click", hide);
    box.addEventListener("click", function (event) { if (event.target === box) hide(); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") hide(); });
  }

  if (document.readyState === "loading") {
    initWhatsAppMessages();
    document.addEventListener("DOMContentLoaded", function () { initBrandIdentity(); initGalleryNavigation(); removeNewsletterSections(); initSiteFooter(); removeLegacyBookingBars(); addMarineSectionTransitions(); initReveal(); initGallery(); });
  } else {
    initWhatsAppMessages();
    initBrandIdentity(); initGalleryNavigation(); removeNewsletterSections(); initSiteFooter(); removeLegacyBookingBars(); addMarineSectionTransitions(); initReveal(); initGallery();
  }
})();
