const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const roots = [path.join(root, "blog"), path.join(root, "en", "blog")];
const stylesheetPattern = /\s*<link[^>]+data-blog-article-styles=["']["'][^>]*>\s*/i;
let updated = 0;
let covered = 0;

for (const blogRoot of roots) {
  if (!fs.existsSync(blogRoot)) continue;
  const stylesheetHref = blogRoot.includes(`${path.sep}en${path.sep}`)
    ? "../../../css/blog-article.css?v=20261004b"
    : "../../css/blog-article.css?v=20261004b";
  const stylesheet = `<link rel="stylesheet" href="${stylesheetHref}" data-blog-article-styles="">`;
  for (const entry of fs.readdirSync(blogRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = path.join(blogRoot, entry.name, "index.html");
    if (!fs.existsSync(file)) continue;

    let html = fs.readFileSync(file, "utf8");
    if (!/<aside\b|(?:article|editorial)-shell|side-card|editorial-card/.test(html)) continue;
    covered += 1;

    html = html.replace(/<aside\b([^>]*)>/i, (tag, attributes) => {
      if (/\bblog-article-aside\b/.test(attributes)) return tag;
      if (/\bclass\s*=\s*(["'])/i.test(attributes)) {
        return `<aside${attributes.replace(/\bclass\s*=\s*(["'])/i, (match, quote) => `class=${quote}blog-article-aside `)}>`;
      }
      return `<aside class="blog-article-aside"${attributes}>`;
    });

    const next = stylesheetPattern.test(html)
      ? html.replace(stylesheetPattern, `\n  ${stylesheet}\n`)
      : html.replace(/<\/head>/i, `  ${stylesheet}\n</head>`);

    if (next !== html) {
      fs.writeFileSync(file, next, "utf8");
      updated += 1;
    }
  }
}

console.log(`Blog UI: ${covered} articles covered; ${updated} files updated`);
