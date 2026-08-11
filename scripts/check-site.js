const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const ignored = new Set(["node_modules", ".git", "tmp"]);
const failures = [];
let pages = 0;
const indexableCanonicals = new Map();

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (ignored.has(entry.name)) return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

for (const file of walk(root).filter((file) => file.endsWith(".html"))) {
  pages += 1;
  const rel = path.relative(root, file).replaceAll("\\", "/");
  const html = fs.readFileSync(file, "utf8");
  if (!/<title>\s*[^<]+/i.test(html)) failures.push(`${rel}: falta title`);
  if (!/<meta\s+[^>]*name=["']description["'][^>]*content=["'][^"']+/i.test(html)) failures.push(`${rel}: falta meta description`);
  if (!/<h1\b/i.test(html)) failures.push(`${rel}: falta h1`);
  if (/G-XXXXXXXXXX/i.test(html)) failures.push(`${rel}: contiene un ID ficticio de Analytics`);
  if (/"contactOption"\s*:\s*"TollFree"/i.test(html)) failures.push(`${rel}: teléfono móvil marcado incorrectamente como TollFree`);

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      failures.push(`${rel}: JSON-LD inválido (${error.message})`);
    }
  }

  const isNoindex = /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  const canonical = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1];
  if (!isNoindex && canonical) {
    if (indexableCanonicals.has(canonical)) failures.push(`${rel}: canonical duplicado con ${indexableCanonicals.get(canonical)}`);
    indexableCanonicals.set(canonical, rel);
  }
  if (rel !== "404.html" && !/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/dunasyolas\.com/i.test(html)) failures.push(`${rel}: falta canonical válido`);

  const ids = [...html.matchAll(/\bid=["']([^"']+)/gi)].map((match) => match[1]);
  for (const id of new Set(ids.filter((id, index) => ids.indexOf(id) !== index))) failures.push(`${rel}: id duplicado ${id}`);

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    if (tag.includes("${")) continue;
    if (!/\balt=["']/i.test(tag)) failures.push(`${rel}: imagen sin alt`);
    if (!/\bwidth=["']\d+/i.test(tag) || !/\bheight=["']\d+/i.test(tag)) failures.push(`${rel}: imagen sin dimensiones`);
    if (!/\bdecoding=["']async["']/i.test(tag)) failures.push(`${rel}: imagen sin decoding async`);
    if (!/\bloading=["'](?:lazy|eager)["']/i.test(tag)) failures.push(`${rel}: imagen sin estrategia de carga`);
  }
  for (const match of html.matchAll(/<button\b([^>]*)>(.*?)<\/button>/gis)) {
    const attrs = match[1];
    const body = match[2];
    const text = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const imageAlt = /<img[^>]*\balt=["'][^"']+/i.test(body);
    if (!text && !imageAlt && !/\b(?:aria-label|title)=["'][^"']+/i.test(attrs)) failures.push(`${rel}: botón sin nombre accesible`);
  }
  for (const match of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)) {
    if (!/\brel=["'][^"']*noopener/i.test(match[0])) failures.push(`${rel}: target=_blank sin noopener`);
  }
  for (const match of html.matchAll(/<a\b[^>]*href=["']#["'][^>]*>/gi)) {
    if (!/\bonclick=/i.test(match[0])) failures.push(`${rel}: enlace vacío sin acción`);
  }
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']*)/gi)) {
    const raw = match[1].trim();
    if (!raw || raw.includes("${") || /^(#|https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(raw)) continue;
    let clean;
    try { clean = decodeURIComponent(raw.split(/[?#]/)[0]); } catch { clean = raw.split(/[?#]/)[0]; }
    const target = clean.startsWith("/") ? path.join(root, clean.slice(1)) : path.resolve(path.dirname(file), clean);
    if (!fs.existsSync(target) && !fs.existsSync(`${target}.html`) && !fs.existsSync(path.join(target, "index.html"))) failures.push(`${rel}: recurso inexistente ${raw}`);
  }
}

const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
if (!/^Sitemap:\s*https:\/\/dunasyolas\.com\/sitemap\.xml\s*$/im.test(robots)) failures.push("robots.txt: falta la URL canónica del sitemap");
if (/^Disallow:\s*\/\s*$/im.test(robots)) failures.push("robots.txt: bloquea todo el sitio");

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
if (!/<urlset\b/i.test(sitemap)) failures.push("sitemap.xml: formato de sitemap no reconocido");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => match[1].trim());
const sitemapSet = new Set(sitemapUrls);
if (sitemapSet.size !== sitemapUrls.length) failures.push("sitemap.xml: contiene URLs duplicadas");
for (const url of sitemapUrls) {
  if (!/^https:\/\/dunasyolas\.com\//.test(url)) failures.push(`sitemap.xml: URL fuera del dominio canónico ${url}`);
  if (/\.html(?:$|[?#])/.test(url)) failures.push(`sitemap.xml: URL no limpia ${url}`);
  if (!indexableCanonicals.has(url)) failures.push(`sitemap.xml: URL sin página indexable correspondiente ${url}`);
}
for (const [canonical, rel] of indexableCanonicals) {
  if (!sitemapSet.has(canonical)) failures.push(`${rel}: canonical indexable ausente del sitemap (${canonical})`);
}
const today = new Date().toISOString().slice(0, 10);
for (const match of sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/gi)) {
  if (match[1].trim() > today) failures.push(`sitemap.xml: lastmod futuro ${match[1].trim()}`);
}

for (const file of walk(path.join(root, "images")).filter((file) => /\.(?:avif|gif|jpe?g|png|webp)$/i.test(file))) {
  const size = fs.statSync(file).size;
  if (size > 200 * 1024) failures.push(`${path.relative(root, file).replaceAll("\\", "/")}: supera 200 KB (${Math.ceil(size / 1024)} KB)`);
}

const vercel = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
const securityHeaders = new Set((vercel.headers?.[0]?.headers || []).map((header) => header.key.toLowerCase()));
for (const required of ["content-security-policy", "referrer-policy", "permissions-policy", "strict-transport-security", "x-content-type-options", "x-frame-options"]) {
  if (!securityHeaders.has(required)) failures.push(`vercel.json: falta ${required}`);
}
if (!fs.existsSync(path.join(root, "404.html"))) failures.push("falta 404.html");

if (failures.length) {
  console.error(failures.join("\n"));
  console.error(`\n${failures.length} problema(s) en ${pages} páginas.`);
  process.exit(1);
}
console.log(`Sitio validado: ${pages} páginas, ${sitemapUrls.length} URLs indexables, JSON-LD correcto, imágenes optimizadas y reglas de seguridad presentes.`);
