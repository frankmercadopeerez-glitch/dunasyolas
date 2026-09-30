import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const root = process.cwd();
const reviews = Array.from({ length: 200 }, (_, index) => ({
  id: `review-${index + 1}`,
  author: `Viajero ${index + 1}`,
  rating: 5,
  text: `Excelente experiencia en Cartagena. Reseña de prueba ${index + 1}.`,
  updateTime: "2026-09-29T12:00:00Z",
}));
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml" };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (pathname === "/api/google-reviews") {
    res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ live: true, rating: 5, reviewCount: 200, updatedAt: new Date().toISOString(), reviews }));
    return;
  }
  const rel = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
  const candidates = [rel, `${rel}.html`, path.join(rel, "index.html")];
  const file = candidates.map((candidate) => path.join(root, candidate)).find((candidate) => candidate.startsWith(root) && fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!file) { res.writeHead(404); res.end("Not found"); return; }
  res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const chrome = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(fs.existsSync);
if (!chrome) throw new Error("Chrome no encontrado");
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
try {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  for (const viewport of [{ width: 1440, height: 900, name: "desktop" }, { width: 390, height: 844, name: "mobile" }]) {
    await page.setViewport(viewport);
    for (const route of ["/opiniones", "/en/reviews", "/"]) {
      const response = await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle0", timeout: 30000 });
      const result = await page.evaluate(() => ({
        cards: document.querySelectorAll(".google-reviews-set:not([data-review-clone]) .google-review-card").length,
        count: document.querySelector("[data-review-count]")?.textContent.trim(),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        controls: document.querySelectorAll(".google-reviews-actions button").length,
        dynamic: document.querySelector(".google-reviews-track")?.classList.contains("is-ready"),
        logo: document.querySelectorAll(".google-review-brand").length,
        avatar: document.querySelector(".google-review-avatar img")?.getAttribute("src"),
        radius: parseFloat(getComputedStyle(document.querySelector(".google-review-card")).borderTopLeftRadius),
        note: document.body.textContent.includes("Mostramos la última copia verificada") || document.body.textContent.includes("Showing the latest verified backup"),
        animation: getComputedStyle(document.querySelector(".google-reviews-track")).animationName,
        duration: getComputedStyle(document.querySelector(".google-reviews-track")).animationDuration,
        playState: getComputedStyle(document.querySelector(".google-reviews-track")).animationPlayState,
        distance: getComputedStyle(document.querySelector(".google-reviews-track")).getPropertyValue("--review-distance"),
        keyframes: document.querySelector(".google-reviews-track").getAnimations().map((a) => a.effect?.getKeyframes()),
        currentTime: document.querySelector(".google-reviews-track").getAnimations().map((a) => [a.currentTime,a.playState]),
      }));
      if (response.status() !== 200 || result.cards !== 200 || !result.count?.includes("200") || result.overflow || result.controls !== 0 || !result.dynamic || result.logo < 200 || result.radius < 10 || result.note || result.animation === "none") {
        throw new Error(`${viewport.name} ${route}: ${JSON.stringify(result)}`);
      }
      await page.$eval(".google-reviews-section", (node) => node.scrollIntoView());
      const start = await page.$eval(".google-reviews-track", (node) => getComputedStyle(node).transform);
      await new Promise((resolve) => setTimeout(resolve, 250));
      const end = await page.$eval(".google-reviews-track", (node) => getComputedStyle(node).transform);
      if (start === end) throw new Error(`${viewport.name} ${route}: carrusel inmóvil ${JSON.stringify({start,end,result})}`);
    }
  }
  if (consoleErrors.length) throw new Error(`Errores de consola: ${consoleErrors.join(" | ")}`);
  console.log("Google reviews UI: 200 reseñas verificadas en inicio y páginas ES/EN, desktop 1440x900 y móvil 390x844.");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
