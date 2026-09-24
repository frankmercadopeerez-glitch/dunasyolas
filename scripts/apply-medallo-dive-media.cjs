const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const root = process.cwd();
const sourceUploads = [
  ['codex-clipboard-d40fc48e-5602-40bf-87d9-06258ee55673.jpg', '01-puerto-medallo-beach-club.webp', 1000, 76],
  ['codex-clipboard-afc2a95e-4c95-4588-a001-cf66eb59a918.jpg', '02-puerto-medallo-beach-club.webp', 1000, 76],
  ['codex-clipboard-dfb9cf82-3540-4c4b-99f4-5f42071f01f2.jpg', '03-puerto-medallo-pool.webp', 1000, 76],
  ['codex-clipboard-d2dfaac5-23c5-40fa-a83e-ca505c2d378e.jpg', '04-puerto-medallo-club.webp', 960, 72],
];

async function optimize(input, output, width = 1800, quality = 76) {
  await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(output);
}

async function main() {
  const photoDir = path.join(root, 'images', 'puerto-medallo');
  fs.mkdirSync(photoDir, { recursive: true });
  for (const [upload, name, width, quality] of sourceUploads) {
    const from = path.join(process.env.TEMP || '', upload);
    if (!fs.existsSync(from)) throw new Error(`Missing supplied photo: ${from}`);
    await optimize(from, path.join(photoDir, name), width, quality);
  }
  const generated = 'C:/Users/Dell/.codex/generated_images/01a08f5d-b26e-7560-80e3-d116fcc3b41f/exec-756a3173-529e-46bd-8d2d-e585290cb03b.png';
  await optimize(generated, path.join(root, 'images', 'buceo-snorkel-cartagena.webp'), 1440, 76);

  const catalogPath = path.join(root, 'data', 'catalog.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  catalog.products.buceo.image = '/images/buceo-snorkel-cartagena.webp';
  catalog.products.playablanca.image = '/images/puerto-medallo/01-puerto-medallo-beach-club.webp';
  catalog.products.medalloislas.image = '/images/puerto-medallo/03-puerto-medallo-pool.webp';
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n');

  const replacements = new Map([
    ['../images/foto%20(10).webp', '/images/buceo-snorkel-cartagena.webp'],
    ['images/foto%20(10).webp', '/images/buceo-snorkel-cartagena.webp'],
    ['https://dunasyolas.com/images/foto%20(10).webp', 'https://dunasyolas.com/images/buceo-snorkel-cartagena.webp'],
    ['https://dunasyolas.com/images/backpackers/family-eco-route/02.webp', 'https://dunasyolas.com/images/buceo-snorkel-cartagena.webp'],
    ['/images/backpackers/family-eco-route/02.webp', '/images/buceo-snorkel-cartagena.webp'],
    ['images/playa-blanca-piscina.webp', '/images/puerto-medallo/01-puerto-medallo-beach-club.webp'],
    ['images/playa-blanca-baru.webp', '/images/puerto-medallo/03-puerto-medallo-pool.webp'],
    ['/images/playa-blanca-piscina.webp', '/images/puerto-medallo/01-puerto-medallo-beach-club.webp'],
    ['/images/playa-blanca-baru.webp', '/images/puerto-medallo/03-puerto-medallo-pool.webp'],
  ]);
  for (const rel of ['experiences.html','en/experiences.html','buceo-snorkel.html','en/buceo-snorkel.html','playa-blanca-baru.html','en/playa-blanca-baru.html']) {
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    for (const [from, to] of replacements) html = html.split(from).join(to);
    fs.writeFileSync(file, html);
  }

  for (const rel of ['blog/itinerario-3-dias-cartagena/index.html', 'en/blog/itinerario-3-dias-cartagena/index.html']) {
    const file = path.join(root, rel);
    let html = fs.readFileSync(file, 'utf8');
    if (rel.startsWith('blog/')) {
      html = html.replaceAll('sumar actividades como un tour gastronómico', 'sumar una comida en un restaurante local');
      html = html.replaceAll('un tour gastronómico por el Centro', 'una comida en un restaurante local del Centro');
    } else {
      html = html.replaceAll('add activities like a food tour', 'enjoy a meal at a local restaurant');
      html = html.replaceAll('a food tour through the Center', 'a meal at a local restaurant in the Center');
    }
    fs.writeFileSync(file, html);
  }
  for (const [rel, from, to] of [
    ['blog/viajar-con-un-local-cartagena/index.html', 'Depende del plan. Las experiencias van desde 3 horas (recorrido gastronómico) hasta un día completo (pasadía en islas). También organizamos itinerarios de varios días para quienes tienen más tiempo.', 'Depende del plan: algunas actividades ocupan varias horas y otras, como los pasadías en islas, duran todo el día. También organizamos itinerarios de varios días para quienes tienen más tiempo.'],
    ['en/blog/viajar-con-un-local-cartagena/index.html', 'It depends on the plan. Experiences range from 3 hours (food tour) to a full day (island day trip). We also organize multi-day itineraries for those with more time.', 'It depends on the plan: some activities take several hours, while island day trips last a full day. We also organize multi-day itineraries for travelers with more time.'],
  ]) {
    const file = path.join(root, rel);
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(from, to));
  }

  const foodFile = path.join(root, 'blog', 'cocinas-del-caribe', 'index.html');
  let food = fs.readFileSync(foodFile, 'utf8');
  food = food.replace(/<h2>La experiencia gastronómica con Nohemi<\/h2>[\s\S]*?<h2>Preguntas frecuentes<\/h2>/, '<h2>Preguntas frecuentes</h2>');
  food = food.replace(/\s*<aside class="lg:w-1\/3 space-y-6">[\s\S]*?<\/aside>/, '\n        <aside class="lg:w-1/3 space-y-6">\n          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-32">\n            <h3 class="text-xl font-bold text-gray-900 mb-3">Más sabores del Caribe</h3>\n            <p class="text-gray-600 text-sm mb-5">Consulta nuestra guía de restaurantes y sabores locales para seguir descubriendo la cocina de Cartagena.</p>\n            <a href="../gastronomia-cartagena/" class="whatsapp-info-btn w-full inline-flex justify-center">Leer la guía de gastronomía</a>\n          </div>\n          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">\n            <h3 class="text-base font-bold text-gray-900 mb-3">Artículos relacionados</h3>\n            <ul class="space-y-2"><li><a href="../viajar-con-un-local-cartagena/" class="text-blue-600 hover:underline text-sm">Viajar con un local en Cartagena</a></li><li><a href="../mejores-islas-rosario/" class="text-blue-600 hover:underline text-sm">Las mejores islas del Rosario</a></li></ul>\n          </div>\n        </aside>');
  food = food.replaceAll('Hola, quiero más información sobre el tour gastronómico en Cartagena.', 'Hola, tengo una pregunta sobre la guía de gastronomía de Cartagena.');
  fs.writeFileSync(foodFile, food);

  const foodFileEn = path.join(root, 'en', 'blog', 'cocinas-del-caribe', 'index.html');
  let foodEn = fs.readFileSync(foodFileEn, 'utf8');
  foodEn = foodEn.replaceAll('Hi, I would like more information about the food tour in Cartagena.', 'Hi, I have a question about the Cartagena food guide.');
  foodEn = foodEn.replace(/<h2>Food experience with Nohemi<\/h2>[\s\S]*?<h2>Frequently asked questions<\/h2>/, '<h2>Frequently asked questions</h2>');
  foodEn = foodEn.replace(/\s*<aside class="lg:w-1\/3 space-y-6">[\s\S]*?<\/aside>/, '\n        <aside class="lg:w-1/3 space-y-6">\n          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-32">\n            <h3 class="text-xl font-bold text-gray-900 mb-3">More Caribbean flavors</h3>\n            <p class="text-gray-600 text-sm mb-5">Read our local food guide to keep discovering Cartagena’s cuisine.</p>\n            <a href="../gastronomia-cartagena/" class="whatsapp-info-btn w-full inline-flex justify-center">Read the food guide</a>\n          </div>\n        </aside>');
  fs.writeFileSync(foodFileEn, foodEn);

  for (const rel of ['en/about.html','en/faq.html','en/policies.html','en/privacy.html','en/blog/index.html']) {
    const file = path.join(root, rel);
    if (fs.existsSync(file)) {
      const text = fs.readFileSync(file, 'utf8').replaceAll('culinary tours', 'Caribbean food experiences');
      fs.writeFileSync(file, text);
    }
  }

  // Add a responsive, captioned gallery of all supplied Puerto Medallo photographs.
  const galleryEs = `          <section class="my-10" aria-labelledby="puerto-medallo-gallery-title">\n            <h2 id="puerto-medallo-gallery-title">Así se vive Puerto Medallo</h2>\n            <p>Playa, piscina y espacios del club frente al mar en Playa Blanca, Barú.</p>\n            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">\n              <figure><img src="/images/puerto-medallo/01-puerto-medallo-beach-club.webp" alt="Cabaña de playa en Puerto Medallo, Playa Blanca, Barú" class="w-full h-64 object-cover rounded-lg" width="1200" height="1600" loading="lazy" decoding="async"><figcaption class="text-sm text-gray-600 mt-2">Descanso en las cabañas junto al mar.</figcaption></figure>\n              <figure><img src="/images/puerto-medallo/02-puerto-medallo-beach-club.webp" alt="Visitante disfruta de Puerto Medallo frente al mar Caribe" class="w-full h-64 object-cover rounded-lg" width="1200" height="1600" loading="lazy" decoding="async"><figcaption class="text-sm text-gray-600 mt-2">Un día de playa en Playa Blanca.</figcaption></figure>\n              <figure><img src="/images/puerto-medallo/03-puerto-medallo-pool.webp" alt="Piscina y descanso en Puerto Medallo, Barú" class="w-full h-64 object-cover rounded-lg" width="1200" height="1600" loading="lazy" decoding="async"><figcaption class="text-sm text-gray-600 mt-2">Piscina para alternar con el mar.</figcaption></figure>\n              <figure><img src="/images/puerto-medallo/04-puerto-medallo-club.webp" alt="Barra y zona de atención de Puerto Medallo" class="w-full h-64 object-cover rounded-lg" width="1200" height="1600" loading="lazy" decoding="async"><figcaption class="text-sm text-gray-600 mt-2">Espacios del club para disfrutar la jornada.</figcaption></figure>\n            </div>\n          </section>\n\n`;
  const pageEs = path.join(root, 'playa-blanca-baru.html');
  let htmlEs = fs.readFileSync(pageEs, 'utf8');
  if (!htmlEs.includes('puerto-medallo-gallery-title')) htmlEs = htmlEs.replace('          <h2>¿Qué incluye?</h2>', galleryEs + '          <h2>¿Qué incluye?</h2>');
  fs.writeFileSync(pageEs, htmlEs);

  const pageEn = path.join(root, 'en', 'playa-blanca-baru.html');
  let htmlEn = fs.readFileSync(pageEn, 'utf8');
  const galleryEn = galleryEs.replaceAll('puerto-medallo-gallery-title', 'puerto-medallo-gallery-title-en').replace('Así se vive Puerto Medallo','Puerto Medallo by the sea').replace('Playa, piscina y espacios del club frente al mar en Playa Blanca, Barú.','Beach, pool and club spaces by the sea at Playa Blanca, Barú.').replace('Cabaña de playa en Puerto Medallo, Playa Blanca, Barú','Beach cabana at Puerto Medallo, Playa Blanca, Barú').replace('Descanso en las cabañas junto al mar.','Relax in a beach cabana.').replace('Visitante disfruta de Puerto Medallo frente al mar Caribe','Visitor enjoying Puerto Medallo by the Caribbean Sea').replace('Un día de playa en Playa Blanca.','A beach day at Playa Blanca.').replace('Piscina y descanso en Puerto Medallo, Barú','Pool and lounge area at Puerto Medallo, Barú').replace('Piscina para alternar con el mar.','Enjoy the pool between swims in the sea.').replace('Barra y zona de atención de Puerto Medallo','Bar and guest area at Puerto Medallo').replace('Espacios del club para disfrutar la jornada.','Club spaces for your day by the sea.');
  if (!htmlEn.includes('puerto-medallo-gallery-title-en')) htmlEn = htmlEn.replace(/<h2>What's Included\?<\/h2>/, galleryEn + '<h2>What\'s Included?</h2>');
  fs.writeFileSync(pageEn, htmlEn);

  // Remove empty remnants where the former food-tour product card used to sit.
  for (const rel of ['experiences.html', 'en/experiences.html']) {
    const file = path.join(root, rel);
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(/\s*<!-- Recorrido gastronómico por Cartagena -->/gi, ''));
  }
  for (const rel of ['buceo-snorkel.html','en/buceo-snorkel.html']) {
    const file = path.join(root, rel);
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replaceAll('https://dunasyolas.com//images/buceo-snorkel-cartagena.webp', 'https://dunasyolas.com/images/buceo-snorkel-cartagena.webp').replaceAll('..//images/buceo-snorkel-cartagena.webp', '/images/buceo-snorkel-cartagena.webp'));
  }
  for (const rel of ['en/playa-blanca-baru.html','experiences.html','en/experiences.html']) {
    const file = path.join(root, rel);
    if (fs.existsSync(file)) fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replaceAll('//images/puerto-medallo/', '/images/puerto-medallo/').replaceAll('//images/buceo-snorkel-cartagena.webp', '/images/buceo-snorkel-cartagena.webp'));
  }
  console.log('Optimized four Puerto Medallo photos and generated diving image; updated pages and content.');
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
