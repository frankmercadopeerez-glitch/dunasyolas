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
  "/tour-5-islas-vip.html",
  "/3-luxury-beach-clubs.html",
  "/kitesurf.html",
  "/blog/mejor-epoca-para-visitar-cartagena/",
  "/en/",
  "/en/experiences.html",
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
        if (request.url().startsWith(`http://127.0.0.1:${port}`)) failed.push(request.url());
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
      if (viewport.name === "mobile" && ["/experiences.html", "/en/experiences.html"].includes(route)) {
        const navbar = await page.evaluate(() => {
          const brand = document.querySelector("#navbar .catalog-brand")?.getBoundingClientRect();
          const actions = document.querySelector("#navbar .catalog-actions")?.getBoundingClientRect();
          return brand && actions ? {
            brandLeft: brand.left,
            brandRight: brand.right,
            actionsLeft: actions.left,
            actionsRight: actions.right,
            viewport: innerWidth,
          } : null;
        });
        if (!navbar || navbar.brandLeft < -0.5 || navbar.actionsRight > navbar.viewport + 0.5 || navbar.brandRight > navbar.actionsLeft + 0.5) {
          throw new Error(`${viewport.name} ${route}: navbar recortado o solapado ${JSON.stringify(navbar)}`);
        }
      }
    }
    if (viewport.name === "mobile") {
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle0" });
      await page.type("#site-search", "Islas");
      await page.waitForSelector("#site-search-results:not(.hidden) .site-search-result", { timeout: 5000 });
      const search = await page.evaluate(() => {
        const hero = document.querySelector(".home-hero");
        const first = document.querySelector("#site-search-results .site-search-result");
        const rect = first?.getBoundingClientRect();
        if (!hero || !rect) return null;
        const point = document.elementFromPoint(rect.left + rect.width / 2, Math.min(innerHeight - 1, rect.bottom - 3));
        return {
          open: hero.classList.contains("site-search-open"),
          visibleAtBottom: Boolean(point?.closest(".site-search-result")),
          resultBottom: rect.bottom,
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
