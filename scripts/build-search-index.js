const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const skip = new Set(["404.html", "privacy.html", "policies.html", "pago-resultado.html"]);
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", ".vercel", "node_modules", "en", "api", "css", "docs", "images", "js", "scripts", "tmp"].includes(entry.name)) return [];
      return walk(full);
    }
    return entry.name.endsWith(".html") ? [full] : [];
  });
}
function clean(text) { return String(text || "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim(); }
function attribute(html, selector, name) {
  const tags = html.match(new RegExp(`<${selector}\\b[^>]*>`, "gi")) || [];
  for (const tag of tags) {
    const match = tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
    if (match) return match[1];
  }
  return "";
}
function searchImage(html, relative) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  let source = "";
  for (const tag of metaTags) {
    if (/property=["']og:image["']/i.test(tag)) {
      source = (tag.match(/content=["']([^"']+)["']/i) || [])[1] || "";
      if (source) break;
    }
  }
  if (!source) source = attribute(html, "img", "src");
  if (!source || /^(?:data:|javascript:)/i.test(source)) return "/images/logo-icon-nav-small.webp";
  try {
    return new URL(source, `https://dunasyolas.com/${relative}`).pathname || "/images/logo-icon-nav-small.webp";
  } catch {
    return "/images/logo-icon-nav-small.webp";
  }
}
function buildIndex(directory, output) {
const items = walk(directory).filter((file) => !skip.has(path.basename(file))).map((file) => {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file).replace(/\\/g, "/");
  const title = clean((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]).replace(/\s*\|\s*Dunas\s*&\s*Olas.*$/i, "");
  const description = clean((html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i) || [])[1]);
  const keywords = clean((html.match(/<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']+)/i) || [])[1]);
  let url = "/" + relative.replace(/index\.html$/i, "").replace(/\.html$/i, "");
  const image = searchImage(html, relative);
  return { title, description: description.slice(0, 180), keywords, url, image };
}).filter((item) => item.title && item.url !== "/" && item.url !== "/en/");
const target = path.join(root, output);
const staged = target + ".tmp";
fs.writeFileSync(staged, JSON.stringify(items, null, 2) + "\n", "utf8");
fs.renameSync(staged, target);
console.log(`Search index ${output}: ${items.length} pages`);
}
buildIndex(root, "search-index.json");
buildIndex(path.join(root, "en"), "en/search-index.json");
