const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const tailwindPath = path.join(root, 'css', 'tailwind-home.css');
const brandPath = path.join(root, 'css', 'brand-refresh.css');
const outputPath = path.join(root, 'css', 'home.css');
const homepages = [
  path.join(root, 'index.html'),
  path.join(root, 'en', 'index.html'),
];

const banner = '/* Generated homepage bundle: tailored Tailwind utilities + brand-refresh.css. */\n';
const stylePattern = /<style id="home-styles">[\s\S]*?<\/style>/;
const placeholder = '<style id="home-styles">\n/* build:home-css injects the homepage bundle here */\n</style>';

function updateHomepages(replacement, label) {
  for (const homepagePath of homepages) {
    const html = fs.readFileSync(homepagePath, 'utf8');

    if (!stylePattern.test(html)) {
      throw new Error(`Missing home-styles block in ${path.relative(root, homepagePath)}`);
    }

    fs.writeFileSync(homepagePath, html.replace(stylePattern, replacement), 'utf8');
    console.log(`${label}: ${path.relative(root, homepagePath)}`);
  }
}

if (process.argv.includes('--prepare')) {
  updateHomepages(placeholder, 'Prepared homepage CSS');
  process.exit(0);
}

const tailwind = fs.readFileSync(tailwindPath, 'utf8');
const brand = fs.readFileSync(brandPath, 'utf8');
const fontFacePattern = /@font-face\s*{[^}]*}/g;
const desktopFontFaces = brand.match(fontFacePattern) || [];
const homeBrand = brand.replace(fontFacePattern, '').trimStart();
const desktopFonts = desktopFontFaces.length
  ? `@media (min-width: 768px) {\n${desktopFontFaces.join('\n')}\n}\n`
  : '';
const bundle = `${banner}${tailwind}\n${desktopFonts}${homeBrand}`;

fs.writeFileSync(outputPath, bundle, 'utf8');
console.log(`Homepage CSS: ${path.relative(root, outputPath)}`);
updateHomepages(`<style id="home-styles">\n${bundle}\n</style>`, 'Inlined homepage CSS');
