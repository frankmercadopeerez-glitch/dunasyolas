const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');

const root = path.resolve(__dirname, '../..');
for (const file of ['data/catalog.json', 'data/catalog-en.json']) {
  const fullPath = path.join(root, file);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  delete data.products?.sabores_locales;
  delete data.sabores_locales;
  fs.writeFileSync(fullPath, `${JSON.stringify(data, null, 2)}\n`);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (['node_modules', '.git', 'tmp'].includes(entry.name)) return [];
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

for (const fullPath of walk(root).filter(file => file.endsWith('.html'))) {
  const $ = cheerio.load(fs.readFileSync(fullPath, 'utf8'));
  $('#experiencia-sabores-locales').remove();
  $('a').filter((_, element) => /(?:^|\/)sabores-locales(?:\.html)?(?:[?#].*)?$/.test($(element).attr('href') || '')).each((_, element) => {
    if ($(element).closest('li').length) $(element).closest('li').remove();
    else $(element).remove();
  });
  $('[data-category="gastronomia"]').remove();
  fs.writeFileSync(fullPath, $.html().replace(/[ \t]+$/gm, ''));
}

for (const route of ['sabores-locales.html', 'en/sabores-locales.html']) {
  const fullPath = path.join(root, route);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
}

const preferenceFile = path.join(root, 'js/pref-banner.js');
fs.writeFileSync(preferenceFile, fs.readFileSync(preferenceFile, 'utf8').replace("    'recorrido-gastronomico.html', 'sabores-locales.html',\n", ''));
const oldMigration = path.join(root, 'scripts/migrations/finish-catalog-localization.js');
fs.writeFileSync(oldMigration, fs.readFileSync(oldMigration, 'utf8').replace("$('#experiencia-sabores-locales a').attr('href','/en/sabores-locales');", ''));
console.log('Removed the discontinued gastronomic experience from product data, experience cards, related links and routes.');
