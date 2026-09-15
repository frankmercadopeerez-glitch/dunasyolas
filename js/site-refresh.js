(function () {
  "use strict";

  document.documentElement.classList.add("brand-refresh-active");
  // French and German pages ship their complete localized navigation in HTML.
  if (/^(fr|de)(-|$)/i.test(document.documentElement.lang)) return;

  function initBrandIdentity() {
    document.querySelectorAll("nav span").forEach(function (node) {
      if (node.textContent.trim() === "Cartagena de Indias") {
        node.textContent = "Mexicana en Cartagena";
      }
    });
  }

  function initSiteNavigation() {
    var nav = document.querySelector("nav");
    if (!nav) return;

    var path = (window.location.pathname || "/")
      .toLowerCase()
      .replace(/\/index\.html$/, "/")
      .replace(/\.html$/, "")
      .replace(/\/+$/, "") || "/";
    var isEnglish = (document.documentElement.lang || "es").toLowerCase().indexOf("en") === 0
      || path === "/en"
      || path.indexOf("/en/") === 0;
    var routePath = path.replace(/^\/en(?=\/|$)/, "") || "/";
    var isCatalog = routePath === "/experiences";
    var isPlanner = routePath === "/arma-tu-viaje";
    var hasExperienceAction = !!document.querySelector('button[onclick*="addToCart"], .booking, [data-experience-name]');
    var active = routePath === "/" ? "home"
      : routePath.indexOf("/galeria") === 0 ? "gallery"
      : routePath.indexOf("/kitesurf") === 0 ? "kitesurf"
      : routePath.indexOf("/about") === 0 ? "about"
      : routePath.indexOf("/blog") === 0 ? "blog"
      : isPlanner ? "planner"
      : (routePath.indexOf("/experiences") === 0 || hasExperienceAction) ? "experiences"
      : "";
    var root = isEnglish ? "/en" : "";
    var labels = isEnglish ? {
      home: "HOME",
      experiences: "EXPERIENCES",
      gallery: "GALLERY",
      kitesurf: "KITESURF",
      about: "ABOUT US",
      blog: "BLOG",
      planner: "PLAN YOUR TRIP",
      signature: "MEXICAN IN CARTAGENA",
      language: "ES"
    } : {
      home: "INICIO",
      experiences: "EXPERIENCIAS",
      gallery: "GALERÍA",
      kitesurf: "KITESURF",
      about: "NOSOTROS",
      blog: "BLOG",
      planner: "ARMA TU VIAJE",
      signature: "MEXICANA EN CARTAGENA",
      language: "EN"
    };
    var links = [
      { key: "home", href: root + "/" },
      { key: "experiences", href: root + "/experiences" },
      { key: "gallery", href: root + "/galeria" },
      { key: "kitesurf", href: root + "/kitesurf" },
      { key: "about", href: root + "/about" },
      { key: "blog", href: root + "/blog/" }
    ];
    var sharedAssetVersion = "20260914a";
    var sharedStyles = document.querySelector('link[href*="brand-refresh.css"]');
    if (sharedStyles) {
      sharedStyles.setAttribute("data-site-brand-refresh", "");
    } else {
      sharedStyles = document.createElement("link");
      sharedStyles.rel = "stylesheet";
      sharedStyles.href = "/css/brand-refresh.css?v=" + sharedAssetVersion;
      sharedStyles.setAttribute("data-site-brand-refresh", "");
      document.head.appendChild(sharedStyles);
    }
    var languageHref = isEnglish
      ? (routePath === "/" ? "/" : "/" + routePath.replace(/^\/+/, ""))
      : (["/", "/experiences", "/kitesurf", "/about", "/blog"].indexOf(routePath) >= 0
          ? "/en" + (routePath === "/" ? "/" : routePath)
          : "/en/experiences");
    var translation = document.querySelector('link[rel="alternate"][hreflang="' + (isEnglish ? 'es' : 'en') + '"]');
    if (translation) {
      var translatedUrl = new URL(translation.href, window.location.href);
      languageHref = translatedUrl.pathname + translatedUrl.search + translatedUrl.hash;
    }
    var desktopLinks = links.map(function (item) {
      var current = active === item.key;
      return '<a class="site-nav-link' + (current ? ' is-active' : '') + '" href="' + item.href + '"' +
        (current ? ' aria-current="page"' : '') + '>' + labels[item.key] + '</a>';
    }).join("");
    var languageLinks = [["es", "Español", "/"], ["en", "English", "/en/"], ["fr", "Français", "/fr/"], ["de", "Deutsch", "/de/"]].map(function (item) {
      var alternate = document.querySelector('link[rel="alternate"][hreflang="' + item[0] + '"]');
      var target = alternate ? new URL(alternate.href).pathname : item[2];
      return '<a href="' + target + '" lang="' + item[0] + '" hreflang="' + item[0] + '">' + item[1] + (alternate ? '' : (isEnglish ? ' · Home' : ' · Inicio')) + '</a>';
    }).join("");
    var languageMenu = '<details class="site-language-menu"><summary aria-label="' + (isEnglish ? 'Language' : 'Idioma') + '">' + (isEnglish ? 'EN' : 'ES') + ' ▾</summary><div>' + languageLinks + '</div></details>';
    var mobileLinks = links.map(function (item) {
      var current = active === item.key;
      return '<a class="site-mobile-link' + (current ? ' is-active' : '') + '" href="' + item.href + '"' +
        (current ? ' aria-current="page"' : '') + '>' + labels[item.key] + '</a>';
    }).join("");
    var plannerDesktop = isPlanner ? "" :
      '<a class="site-planner-cta" href="' + root + '/arma-tu-viaje">&#10022; ' + labels.planner + '</a>';
    var plannerMobile = isPlanner ? "" :
      '<a class="site-mobile-link site-mobile-planner" href="' + root + '/arma-tu-viaje">&#10022; ' + labels.planner + '</a>';
    var cartButton = isCatalog
      ? '<button class="site-cart-button" type="button" aria-label="' + (isEnglish ? "Open cart" : "Abrir carrito") + '" data-site-cart-button>' +
          '<i class="fas fa-shopping-cart" aria-hidden="true"></i><span id="cart-badge" class="site-cart-badge hidden">0</span></button>'
      : "";

    nav.className = "site-navbar fixed top-0 left-0 right-0 z-50";
    nav.innerHTML =
      '<div class="site-navbar-inner">' +
        '<a class="site-brand" href="' + root + '/" aria-label="Dunas y Olas">' +
          '<picture><source srcset="/images/logo-master.webp" type="image/webp"><img src="/images/logo-master.png" alt="" width="315" height="148"></picture>' +
          '<span class="site-brand-copy"><strong>Dunas <em>&amp; Olas</em></strong><small>' + labels.signature + '</small></span>' +
        '</a>' +
        '<div class="site-navbar-links" aria-label="' + (isEnglish ? "Main navigation" : "Navegación principal") + '">' + desktopLinks + '</div>' +
        '<div class="site-navbar-tools">' +
          languageMenu +
          plannerDesktop + cartButton +
          '<button class="site-menu-button" id="mobile-menu-btn" type="button" aria-controls="mobile-menu" aria-expanded="false" aria-label="' + (isEnglish ? "Open menu" : "Abrir menú") + '"><i class="fas fa-bars" aria-hidden="true"></i></button>' +
        '</div>' +
      '</div>' +
      '<div class="site-mobile-menu hidden" id="mobile-menu">' +
        '<div class="site-mobile-menu-head"><span>Dunas <strong>&amp; Olas</strong></span><button type="button" data-close-menu aria-label="' + (isEnglish ? "Close menu" : "Cerrar menú") + '">&times;</button></div>' +
        mobileLinks + '<a class="site-mobile-link site-mobile-language" href="' + languageHref + '">' + (isEnglish ? "ESPAÑOL" : "ENGLISH") + '</a>' + plannerMobile +
      '</div>';

    var menuButton = nav.querySelector("#mobile-menu-btn");
    var mobileMenu = nav.querySelector("#mobile-menu");
    var closeButton = nav.querySelector("[data-close-menu]");
    function setMenu(open) {
      var wasOpen = mobileMenu.classList.contains("is-open");
      mobileMenu.classList.toggle("hidden", !open);
      mobileMenu.classList.toggle("is-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("site-menu-open", open);
      if (open) closeButton.focus();
      else if (wasOpen) menuButton.focus();
    }
    menuButton.addEventListener("click", function () { setMenu(mobileMenu.classList.contains("hidden")); });
    closeButton.addEventListener("click", function () { setMenu(false); });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (event) {
      if (!mobileMenu.classList.contains("is-open")) return;
      if (event.key === "Escape") setMenu(false);
      if (event.key === "Tab") {
        var focusable = [menuButton].concat(Array.from(mobileMenu.querySelectorAll('a[href], button')));
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener("resize", function () {
      if (getComputedStyle(menuButton).display === "none") setMenu(false);
    });

    var cartTrigger = nav.querySelector("[data-site-cart-button]");
    if (cartTrigger) {
      cartTrigger.addEventListener("click", function () {
        if (typeof window.toggleCart === "function") window.toggleCart(true);
      });
      window.setTimeout(function () {
        if (typeof window.renderCart === "function") window.renderCart();
      }, 0);
    }
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
              <li><a href="${isEnglish ? "/en" : ""}/arma-tu-viaje" class="hover:text-yellow-400">&#10022; ${copy.planner}</a></li>
              <li><a href="${isEnglish ? "/en" : ""}/experiences" class="hover:text-blue-400">${copy.experiences}</a></li>
              <li><a href="${isEnglish ? "/en" : ""}/galeria" class="hover:text-blue-400">${isEnglish ? "Gallery" : "Galeria"}</a></li>
              <li><a href="${isEnglish ? "/en" : ""}/kitesurf" class="hover:text-blue-400">Kitesurf</a></li>
              <li><a href="${isEnglish ? "/en/about" : "/about"}" class="hover:text-blue-400">${copy.about}</a></li>
              <li><a href="${isEnglish ? "/en/blog/" : "/blog/"}" class="hover:text-blue-400">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-bold mb-4 text-sm">${copy.contact}</h3>
            <ul class="space-y-2 text-gray-400 text-xs flex flex-col items-center md:items-start">
              <li class="flex items-center"><i class="fas fa-map-marker-alt mr-2 text-blue-500"></i>Getsemaní, Cartagena</li>
              <li class="flex items-center"><i class="fab fa-whatsapp mr-2 text-blue-500"></i>+57 316 303 0589</li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-bold mb-4 text-sm">${copy.social}</h3>
            <div class="site-social-links flex justify-center md:justify-start gap-2">
              <a href="https://www.instagram.com/mexicanaencartagena?igsh=MTJ2MjZwdmU5NjZ4Nw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-badge social-badge-image"><img src="/images/instagram-logo.png" alt="" width="512" height="512" loading="lazy" decoding="async"/></a>
              <a href="https://www.facebook.com/share/1aQqHEvkyG/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="social-badge social-badge-image"><img src="/images/logo-facebook.png" alt="" width="512" height="512" loading="lazy" decoding="async"/></a>
              <a href="https://www.tiktok.com/@mexicanaencartagena?_r=1&amp;_t=ZS-97Sfx04blGW" target="_blank" rel="noopener noreferrer" aria-label="TikTok" class="social-badge" style="background:#000"><i class="fab fa-tiktok"></i></a>
              <a href="https://youtube.com/@mexicanaencartagena?si=9JDydMI-7EINl9ns" target="_blank" rel="noopener noreferrer" aria-label="YouTube" class="social-badge social-badge-youtube"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-6 text-[10px] md:text-xs text-gray-400 text-center">
          <p>&copy; 2026 Dunas &amp; Olas. ${copy.rights}</p>
          <p class="mt-1">RNT No. 292710</p>
          <div class="mt-2 space-x-3"><a href="${isEnglish ? "/en" : ""}/policies" class="hover:text-white">${copy.terms}</a> &middot; <a href="${isEnglish ? "/en" : ""}/privacy" class="hover:text-white">${copy.privacy}</a> &middot; <a href="${isEnglish ? "/en" : ""}/faq" class="hover:text-white">${copy.faq}</a> &middot; <a href="${isEnglish ? "/en" : ""}/creditos-fotograficos">${isEnglish ? "Photo credits" : "Créditos fotográficos"}</a></div>
        </div>
      </div>`;
  }

  function initWhatsAppWidget() {
    var container = document.querySelector(".whatsapp-container");
    if (!container) {
      container = document.createElement("div");
      document.body.appendChild(container);
    }
    var isEnglish = (document.documentElement.lang || "es").toLowerCase().indexOf("en") === 0;
    var heading = document.querySelector("main h1, body > header h1, h1");
    var title = String((heading && heading.textContent) || document.title.split("|")[0] || "")
      .replace(/\s+/g, " ")
      .trim();
    var message = isEnglish
      ? "Hello, I come from the Dunas y Olas website and I would like more information about " + (title || "experiences in Cartagena") + "."
      : "Hola, vengo desde la web de Dunas y Olas y quiero más información sobre " + (title || "las experiencias en Cartagena") + ".";

    container.className = "whatsapp-container site-whatsapp-widget";
    container.innerHTML =
      '<button type="button" class="whatsapp-float" aria-label="' + (isEnglish ? "Contact Dunas y Olas on WhatsApp" : "Contactar a Dunas y Olas por WhatsApp") + '">' +
        '<img src="/images/WhatsApp-96.webp" alt="" class="whatsapp-icon" width="96" height="96" decoding="async" loading="lazy"/>' +
        '<span class="whatsapp-text">WhatsApp</span>' +
      '</button>';
    container.querySelector("button").addEventListener("click", function () {
      window.open("https://wa.me/573163030589?text=" + encodeURIComponent(message), "_blank", "noopener");
    });
  }

  function normalizeExperienceBooking() {
    var route = (window.location.pathname || "").toLowerCase().replace(/\/index\.html$/, "").replace(/\.html$/, "");
    if (route === "/experiences" || route === "/en/experiences") return;
    var cartAction = document.querySelector('button[onclick*="addToCart"]');
    var booking = document.querySelector(".booking");
    if (!booking && cartAction) {
      var bookingAside = cartAction.closest("aside");
      booking = bookingAside && bookingAside.querySelector("div");
    }
    if (!booking && !cartAction) return;

    document.body.classList.add("experience-detail-page");
    if (booking) {
      booking.classList.add("booking-inline-card");
      var shell = booking.closest("aside") || booking.parentElement;
      if (shell) shell.classList.add("booking-inline-shell");
      var sticky = booking.closest(".sticky, [class*='sticky']");
      if (sticky) sticky.classList.remove("sticky", "top-16", "top-20", "top-24", "top-28");
    }

    var existingBar = Array.prototype.find.call(
      document.querySelectorAll('body > div[class~="fixed"][class~="bottom-0"], body > .mobile-bar'),
      function (bar) { return !!bar.querySelector('button[onclick*="addToCart"], .add-to-cart-btn, [data-booking-action]'); }
    );
    if (existingBar) existingBar.classList.add("experience-booking-bar");

    if (!existingBar && cartAction) {
      var title = (document.querySelector("main h1, header h1, h1") || {}).textContent || "";
      var priceNode = document.querySelector(".price-value, .price, [data-cop-val]");
      var whatsappAction = booking && booking.querySelector('.wa-btn, button[onclick*="WhatsApp"], button[onclick*="whatsapp"]');
      var bar = document.createElement("div");
      bar.className = "experience-booking-bar";
      bar.innerHTML =
        '<div class="experience-booking-summary"><span>' + (document.documentElement.lang === "en" ? "From" : "Por persona") + '</span><strong>' +
        (priceNode ? priceNode.textContent.trim() : title) + '</strong></div>' +
        '<div class="experience-booking-actions"></div>';
      var actions = bar.querySelector(".experience-booking-actions");
      var cartClone = cartAction.cloneNode(true);
      cartClone.className = "experience-booking-primary";
      cartClone.setAttribute("data-booking-action", "cart");
      cartClone.innerHTML = '<i class="fas fa-shopping-cart" aria-hidden="true"></i><span>' +
        (document.documentElement.lang === "en" ? "Book" : "Reservar") + '</span>';
      actions.appendChild(cartClone);
      if (whatsappAction) {
        var waClone = whatsappAction.cloneNode(true);
        waClone.className = "experience-booking-whatsapp";
        waClone.setAttribute("data-booking-action", "whatsapp");
        waClone.innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i><span>WhatsApp</span>';
        actions.appendChild(waClone);
      }
      document.body.appendChild(bar);
      existingBar = bar;
    }
    if (existingBar) document.body.classList.add("has-experience-booking-bar");
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
    var nodes = document.querySelectorAll("main section, body > section, article:not(.article-content)");
    // Keep the first viewport visible; only animate content entering below it.
    nodes = Array.from(nodes).filter(function (node) { return node.getBoundingClientRect().top >= window.innerHeight; });
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
    var opener;
    var previousOverflow = "";
    function hide() {
      if (!box.classList.contains("is-open")) return;
      box.classList.remove("is-open"); document.body.style.overflow = previousOverflow;
      if (opener) opener.focus();
    }
    tiles.forEach(function (tile) {
      tile.setAttribute("tabindex", "0");
      tile.setAttribute("role", "button");
      tile.setAttribute("aria-label", "Ver " + (tile.getAttribute("data-label") || "fotografía") + " en tamaño completo");
      function show() {
        opener = tile;
        previousOverflow = document.body.style.overflow;
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
    document.addEventListener("keydown", function (event) {
      if (!box.classList.contains("is-open")) return;
      if (event.key === "Escape") hide();
      if (event.key === "Tab") { event.preventDefault(); close.focus(); }
    });
  }

  if (document.readyState === "loading") {
    initWhatsAppMessages();
    document.addEventListener("DOMContentLoaded", function () { initBrandIdentity(); initSiteNavigation(); removeNewsletterSections(); initSiteFooter(); normalizeExperienceBooking(); initWhatsAppWidget(); addMarineSectionTransitions(); initReveal(); initGallery(); });
  } else {
    initWhatsAppMessages();
    initBrandIdentity(); initSiteNavigation(); removeNewsletterSections(); initSiteFooter(); normalizeExperienceBooking(); initWhatsAppWidget(); addMarineSectionTransitions(); initReveal(); initGallery();
  }
})();
