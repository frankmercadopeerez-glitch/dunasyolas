const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');

const root = path.resolve(__dirname, '../..');
for (const [file, question, answer] of [
  ['faq.html', '¿Qué métodos de pago aceptan?', 'Los métodos disponibles se confirman al coordinar cada experiencia. Escríbenos por WhatsApp para verificar cómo reservar y pagar tu plan antes de confirmar.'],
  ['en/faq.html', 'What payment methods do you accept?', 'Available payment methods are confirmed when we arrange each experience. Contact us on WhatsApp to verify how to book and pay for your plan before confirming.'],
]) {
  const fullPath = path.join(root, file);
  const $ = cheerio.load(fs.readFileSync(fullPath, 'utf8'));
  const row = $('details').filter((_, element) => $(element).find('summary').text().trim() === question).first();
  if (!row.length) throw new Error(`Payment FAQ not found in ${file}`);
  row.find('p').first().text(answer);
  for (const script of $('script[type="application/ld+json"]').toArray()) {
    let schema;
    try { schema = JSON.parse($(script).text()); } catch { continue; }
    const visit = node => {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) return node.forEach(visit);
      if (node['@type'] === 'Question' && node.name === question && node.acceptedAnswer) node.acceptedAnswer.text = answer;
      Object.values(node).forEach(visit);
    };
    visit(schema);
    $(script).text(JSON.stringify(schema));
  }
  fs.writeFileSync(fullPath, $.html().replace(/[ \t]+$/gm, ''));
}

for (const [file, replacements] of Object.entries({
  'privacy.html': [
    ['<li>Información de pago (procesada de forma segura por nuestra pasarela de pagos, nunca almacenada por nosotros)</li>', '<li>Si se habilita un pago en línea para tu reserva, el proveedor indicado antes del pago procesa esos datos. No compartas información bancaria por WhatsApp.</li>'],
    ['<li><strong>Pasarela de pagos (Mercado Pago):</strong> para procesar pagos en línea de forma segura</li>', '<li>Si se habilita el pago en línea, el proveedor de pago identificado en el checkout procesa la transacción.</li>'],
    ['            <li>Recordar que aceptaste el aviso de cookies</li>\n', ''],
  ],
  'en/privacy.html': [
    ['<li>Payment information (processed securely by our payment gateway, never stored by us)</li>', '<li>If online payment is enabled for your booking, the provider identified before checkout processes that data. Do not share banking details over WhatsApp.</li>'],
    ['<li><strong>Payment gateway (Mercado Pago):</strong> to process online payments securely</li>', '<li>If online payment is enabled, the provider identified at checkout processes the transaction.</li>'],
    ['            <li>Remember that you accepted the cookie notice</li>\n', ''],
  ],
})) {
  const fullPath = path.join(root, file);
  let html = fs.readFileSync(fullPath, 'utf8');
  for (const [oldText, newText] of replacements) html = html.replace(oldText, newText);
  fs.writeFileSync(fullPath, html);
}

for (const fullPath of walkHtml(root)) {
  const html = fs.readFileSync(fullPath, 'utf8');
  if (html.includes('js/cookie-consent.js')) {
    fs.writeFileSync(fullPath, html.replace(/\s*<script[^>]+src=["'][^"']*js\/cookie-consent\.js[^"']*["'][^>]*><\/script>/g, ''));
  }
}
const blogBuilder = path.join(root, 'scripts/build-current-blog.js');
fs.writeFileSync(blogBuilder, fs.readFileSync(blogBuilder, 'utf8').replace(/<script src="\.\.\/\.\.\/js\/cookie-consent\.js\?v=[^"]+"><\/script>/g, ''));
console.log('Aligned payment disclosures with the pending online checkout and removed stale cookie-consent references.');

function walkHtml(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (['node_modules', '.git', 'tmp'].includes(entry.name)) return [];
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walkHtml(fullPath) : fullPath.endsWith('.html') ? [fullPath] : [];
  });
}
