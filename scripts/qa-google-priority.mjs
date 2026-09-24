import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const root = process.cwd();
const output = path.join(root, "tmp", "google-qa");
fs.mkdirSync(output, { recursive: true });

const routes = [
  "/",
  "/experiences.html",
  "/arma-tu-viaje.html",
  "/pasadia-isla-palma.html",
  "/pasadia-isla-lizamar.html",
  "/pasadia-mucura-tintipan.html",
  "/islas-del-rosario.html",
  "/volcan-del-totumo.html",
  "/3-luxury-beach-clubs.html",
  "/kitesurf.html",
  "/blog/mejor-epoca-para-visitar-cartagena/",
  "/blog/viajar-cartagena-desde-mexico/",
  "/blog/precios-tours-cartagena/",
  "/blog/cuanto-cuesta-tour-islas-del-rosario-2026/",
  "/blog/seguro-obligatorio-islas-rosario-san-bernardo-2026/",
  "/blog/como-verificar-agencia-rnt-cartagena/",
  "/blog/derechos-turista-cobros-excesivos-cartagena/",
  "/blog/requisitos-lancha-segura-islas-cartagena/",
  "/en/",
  "/en/experiences.html",
  "/en/blog/cartagena-tour-prices/",
];

const mime = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const clean = pathname === "/" ? "index.html" : pathname.replace(/^\//, "").replace(/\/$/, "");
  const candidates = [clean, `${clean}.html`, path.join(clean, "index.html")];
  const file = candidates
    .map((candidate) => path.join(root, candidate))
    .find((candidate) => candidate.startsWith(root) && fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!file) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "content-type": mime[path.extname(file).toLowerCase()] || "application/octet-stream" });
  fs.createReadStream(file).pipe(response);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const chrome = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
].find(fs.existsSync);
if (!chrome) throw new Error("Chrome no encontrado");

const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
try {
  for (const viewport of [
    { width: 1440, height: 900, name: "desktop" },
    { width: 390, height: 844, name: "mobile" },
  ]) {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    for (const route of routes) {
      const failed = [];
      const onFailed = (request) => {
        const url = request.url();
        if (url.startsWith(`http://127.0.0.1:${port}`)) failed.push(url);
      };
      page.on("requestfailed", onFailed);
      const response = await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle0", timeout: 30000 });
      await page.evaluate(async () => {
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((resolve) => setTimeout(resolve, 200));
        window.scrollTo(0, 0);
        await new Promise((resolve) => setTimeout(resolve, 100));
      });
      const result = await page.evaluate(() => ({
        title: document.title.trim(),
        h1: document.querySelector("h1")?.textContent.trim(),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        missingImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
        unnamedButtons: [...document.querySelectorAll("button")].filter((button) => !button.textContent.trim() && !button.querySelector('img[alt]:not([alt=""])') && !button.getAttribute("aria-label") && !button.getAttribute("title")).length,
      }));
      page.off("requestfailed", onFailed);
      if (response.status() !== 200 || !result.title || !result.h1 || result.overflow || result.missingImages.length || result.unnamedButtons || failed.length) {
        throw new Error(`${viewport.name} ${route}: ${JSON.stringify({ status: response.status(), ...result, failed })}`);
      }
      if (["/experiences.html", "/en/experiences.html"].includes(route)) {
        const navbar = await page.evaluate(() => {
          const brand = document.querySelector(".site-navbar .site-brand")?.getBoundingClientRect();
          const actions = document.querySelector(".site-navbar .site-navbar-tools")?.getBoundingClientRect();
          const nav = document.querySelector(".site-navbar")?.getBoundingClientRect();
          const hero = document.querySelector(".hero-section")?.getBoundingClientRect();
          return brand && actions ? {
            brandLeft: brand.left,
            brandRight: brand.right,
            actionsLeft: actions.left,
            actionsRight: actions.right,
            navTop: nav?.top,
            navBottom: nav?.bottom,
            heroTop: hero?.top,
            scrollY: window.scrollY,
            viewport: innerWidth,
          } : null;
        });
        if (!navbar || navbar.brandLeft < -0.5 || navbar.actionsRight > navbar.viewport + 0.5 || navbar.brandRight > navbar.actionsLeft + 0.5 || Math.abs(navbar.navTop) > 0.5 || (navbar.heroTop != null && navbar.heroTop + navbar.scrollY < navbar.navBottom - 4)) {
          throw new Error(`${viewport.name} ${route}: navbar recortado o solapado ${JSON.stringify(navbar)}`);
        }
      }
      if (["/islas-del-rosario.html", "/blog/viajar-cartagena-desde-mexico/", "/blog/precios-tours-cartagena/", "/blog/cuanto-cuesta-tour-islas-del-rosario-2026/", "/blog/derechos-turista-cobros-excesivos-cartagena/", "/en/blog/cartagena-tour-prices/"].includes(route)) {
        const slug = route === "/islas-del-rosario.html" ? "islas-del-rosario" : route.split("/").filter(Boolean).at(-1);
        await page.screenshot({ path: path.join(output, `${slug}-${viewport.name}.png`), fullPage: true });
      }
    }
    if (viewport.name === "mobile") {
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle0" });
      await page.type("#site-search", "Islas");
      await page.waitForSelector("#site-search-results:not(.hidden) .site-search-result", { timeout: 5000 });
      const search = await page.evaluate(() => {
        const hero = document.querySelector(".home-hero");
        const first = document.querySelector("#site-search-results .site-search-result");
        const panel = document.querySelector("#site-search-results");
        const rect = first?.getBoundingClientRect();
        const panelRect = panel?.getBoundingClientRect();
        if (!hero || !rect) return null;
        const visibleHeight = Math.max(0, Math.min(rect.bottom, panelRect?.bottom || innerHeight, innerHeight - 12) - Math.max(rect.top, panelRect?.top || 0));
        return {
          open: hero.classList.contains("site-search-open"),
          visibleAtBottom: visibleHeight >= 44,
          visibleHeight,
          resultBottom: rect.bottom,
          resultTop: rect.top,
          panelBottom: panelRect?.bottom,
          heroBottom: hero.getBoundingClientRect().bottom,
        };
      });
      if (!search?.open || !search.visibleAtBottom) {
        throw new Error(`mobile /: resultados de busqueda ocultos ${JSON.stringify(search)}`);
      }
      await page.screenshot({ path: path.join(output, "inicio-mobile-busqueda.png"), fullPage: false });
      await page.goto(`http://127.0.0.1:${port}/experiences.html`, { waitUntil: "networkidle0" });
      await page.screenshot({ path: path.join(output, "experiencias-mobile.png"), fullPage: false });
    } else {
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle0" });
      await page.screenshot({ path: path.join(output, "inicio-desktop.png"), fullPage: false });
    }
    await page.close();
  }
  console.log(`QA Google: ${routes.length} rutas verificadas en escritorio y móvil, sin desbordamientos, recursos rotos ni controles sin nombre.`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
