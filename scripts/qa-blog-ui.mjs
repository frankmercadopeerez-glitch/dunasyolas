import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const root = process.cwd();
const articleFiles = [path.join(root, "blog"), path.join(root, "en", "blog")]
  .flatMap((directory) => fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(directory, entry.name, "index.html")))
  .filter((file) => fs.existsSync(file) && fs.readFileSync(file, "utf8").includes("blog-article-aside"));

const routes = articleFiles.map((file) => `/${path.relative(root, path.dirname(file)).replaceAll("\\", "/")}/`);
const mime = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const clean = pathname === "/" ? "index.html" : pathname.replace(/^\//, "").replace(/\/$/, "");
  const file = [clean, `${clean}.html`, path.join(clean, "index.html")]
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
const failures = [];
try {
  for (const viewport of [
    { width: 1440, height: 900, name: "desktop" },
    { width: 390, height: 844, name: "mobile" },
  ]) {
    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height });
    for (const route of routes) {
      const response = await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      if (!response?.ok()) {
        failures.push(`${viewport.name} ${route}: HTTP ${response?.status()}`);
        continue;
      }
      const result = await page.evaluate(() => {
        const aside = document.querySelector(".blog-article-aside");
        const card = aside?.firstElementChild;
        const article = aside?.parentElement?.querySelector(":scope > article, :scope > .article-content, :scope > .editorial-content");
        if (!aside) return { error: "estructura incompleta" };
        if (!card) return { empty: true };
        const buttons = [...card.querySelectorAll(":scope > a, :scope > button")];
        const styles = buttons.map((button) => {
          const style = getComputedStyle(button);
          const rect = button.getBoundingClientRect();
          return { radius: style.borderRadius, width: Math.round(rect.width), minHeight: Math.round(rect.height) };
        });
        const cardStyle = getComputedStyle(card);
        const articleRect = article?.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        return {
          position: cardStyle.position,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          overlap: articleRect ? Math.max(0, articleRect.right - cardRect.left) > 2 && cardRect.left >= articleRect.left : false,
          buttonCount: styles.length,
          uniformRadius: new Set(styles.map((item) => item.radius)).size <= 1,
          uniformWidth: styles.length < 2 || Math.max(...styles.map((item) => item.width)) - Math.min(...styles.map((item) => item.width)) <= 2,
          adequateHeight: styles.every((item) => item.minHeight >= 50),
        };
      });
      if (result.error) failures.push(`${viewport.name} ${route}: ${result.error}`);
      if (result.empty) continue;
      if (result.position !== "static") failures.push(`${viewport.name} ${route}: tarjeta ${result.position}`);
      if (result.overflow > 3) failures.push(`${viewport.name} ${route}: overflow ${result.overflow}px`);
      if (viewport.name === "desktop" && result.overlap) failures.push(`${viewport.name} ${route}: tarjeta invade el artículo`);
      if (!result.uniformRadius || !result.uniformWidth || !result.adequateHeight) failures.push(`${viewport.name} ${route}: botones no uniformes`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Blog UI QA: ${routes.length} articles × desktop/mobile passed`);
}
