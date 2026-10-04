const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const today = '2026-10-04';
const markerStart = '<!-- SEO-GROWTH:START -->';
const markerEnd = '<!-- SEO-GROWTH:END -->';
const blockPattern = /\s*<!-- SEO-GROWTH:START -->[\s\S]*?<!-- SEO-GROWTH:END -->\s*/g;
const cssPattern = /\s*<link[^>]+data-seo-growth=["']["'][^>]*>\s*/i;

const metadata = {
  'blog/cartagena-noviembre-clima-que-llevar/index.html': {
    title: 'Clima en Cartagena en noviembre 2026: lluvia y qué llevar | Dunas & Olas',
    description: 'Consulta el clima de Cartagena en noviembre de 2026: lluvias, temperatura, ropa recomendada, eventos y consejos para reservar playa e islas.'
  },
  'blog/horarios-playas-cartagena-2026/index.html': {
    title: 'Horario de playas en Cartagena 2026: apertura y cierres | Dunas & Olas',
    description: 'Conoce a qué hora abren y cierran las playas de Cartagena en 2026, cuándo hay salvavidas y cómo confirmar cierres en Barú e islas.'
  },
  'blog/navidad-cartagena-2026/index.html': {
    title: 'Navidad en Cartagena 2026: eventos, clima y planes | Dunas & Olas',
    description: 'Agenda de Navidad en Cartagena 2026: luces, novenas, Festival del Pastel, clima de diciembre y planes para familias, parejas y grupos.'
  },
  'blog/fiestas-independencia-cartagena-2026/index.html': {
    title: 'Fiestas de Independencia Cartagena 2026: fechas y desfile | Dunas & Olas',
    description: 'Fechas oficiales de las Fiestas de Independencia de Cartagena 2026: Gran Desfile, Festival Náutico, Cabildo de Getsemaní y coronación.'
  },
  'blog/calendario-eventos-cartagena-2026/index.html': {
    title: 'Eventos en Cartagena 2026: calendario de octubre a diciembre | Dunas & Olas',
    description: 'Calendario de eventos en Cartagena 2026 con fechas de octubre, Fiestas de Independencia, Festival Náutico, Navidad y Festival del Pastel.'
  },
  'blog/cartagena-en-un-dia-crucero/index.html': {
    title: 'Qué hacer en Cartagena en un día de crucero: itinerario | Dunas & Olas',
    description: 'Itinerario para conocer Cartagena durante una escala de crucero: Centro Histórico, Getsemaní, tiempos de regreso y opciones en bote.'
  },
  'en/blog/historia-nombre-cartagena/index.html': {
    title: 'Why Is Cartagena Called Cartagena de Indias? | Dunas & Olas',
    description: 'Learn why the city is called Cartagena de Indias, who lived here before 1533, and how its port, walls and Caribbean history shaped its name.'
  },
  'experiences.html': {
    title: 'Tours y pasadías en Cartagena con precios 2026 | Dunas & Olas',
    description: 'Compara tours y pasadías en Cartagena con precios, horarios e inclusiones: Islas del Rosario, Barú, playa, ciudad, aventura y actividades acuáticas.'
  },
  'islas-del-rosario.html': {
    title: 'Pasadías Islas del Rosario desde Cartagena: precios 2026 | Dunas & Olas',
    description: 'Compara pasadías a Islas del Rosario desde Cartagena, precios 2026, transporte, alimentación, tasas e inclusiones antes de reservar.'
  },
  'kitesurf.html': {
    title: 'Kitesurf en Cartagena: clases y alquiler 2026 | Dunas & Olas',
    description: 'Clases de kitesurf en La Boquilla para principiantes y riders, alquiler de equipo, supervisión, kitefoil, wingfoil y SUP con precios 2026.'
  },
  'renta-de-botes.html': {
    title: 'Alquiler de botes privados en Cartagena 2026 | Dunas & Olas',
    description: 'Cotiza un bote privado en Cartagena para recorrer la bahía o las islas. Compara capacidad, fecha, duración, servicios y ruta para tu grupo.'
  },
  'hospedaje-cartagena.html': {
    title: 'Apartamentos y apartaestudios en Cartagena 2026 | Dunas & Olas',
    description: 'Consulta apartamentos y apartaestudios en Cartagena cerca de la playa, con fotos reales, capacidad, recargos y disponibilidad según tus fechas.'
  }
};

const commercialGuides = {
  'experiences.html': [
    ['/blog/que-hacer-cartagena/', 'Qué hacer en Cartagena', 'Ideas para elegir actividades según tus días.'],
    ['/blog/zarpar-seguro-islas-cartagena/', 'Cómo zarpar de forma segura', 'Muelle, operador, chaleco y condiciones del mar.'],
    ['/blog/cartagena-en-un-dia-crucero/', 'Cartagena en una escala de crucero', 'Itinerarios según el tiempo disponible.']
  ],
  'islas-del-rosario.html': [
    ['/blog/mejores-islas-rosario/', 'Mejores Islas del Rosario', 'Compara ambientes, trayectos y tipo de pasadía.'],
    ['/blog/tour-o-pasadia/', 'Tour o pasadía: diferencias', 'Elige el formato correcto antes de pagar.'],
    ['/blog/zarpar-seguro-islas-cartagena/', 'Zarpar seguro hacia las islas', 'Revisa las señales de un operador responsable.']
  ],
  'kitesurf.html': [
    ['/blog/kitesurf-cartagena/', 'Guía de kitesurf en Cartagena', 'Temporada, viento, niveles y La Boquilla.'],
    ['/blog/wing-foil-vs-kitesurf-cartagena/', 'Wing foil o kitesurf', 'Diferencias de equipo, nivel y aprendizaje.'],
    ['/blog/mejor-epoca-para-visitar-cartagena/', 'Cuándo viajar a Cartagena', 'Clima, viento y temporadas para elegir fechas.']
  ],
  'renta-de-botes.html': [
    ['/blog/plan-finde-islas-rosario/', 'Cómo planear un fin de semana en las islas', 'Ruta, horarios y tiempos para organizar el viaje.'],
    ['/blog/zarpar-seguro-islas-cartagena/', 'Seguridad antes de zarpar', 'Documentos, chalecos y condiciones marítimas.'],
    ['/blog/mejores-islas-rosario/', 'Qué islas visitar', 'Compara destinos antes de definir la ruta.']
  ],
  'hospedaje-cartagena.html': [
    ['/blog/donde-alojarse-en-cartagena/', 'Dónde alojarse en Cartagena', 'Compara sectores según tu tipo de viaje.'],
    ['/blog/cartagena-noviembre-clima-que-llevar/', 'Clima y equipaje', 'Prepara la maleta según la temporada.'],
    ['/blog/que-hacer-cartagena/', 'Planes para completar tu estadía', 'Organiza los días alrededor del alojamiento.']
  ]
};

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function setTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function updateMetadata(html, values) {
  html = setTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(values.title)}</title>`);
  html = setTag(html, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeHtml(values.description)}">`);
  html = setTag(html, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeHtml(values.title.replace(/\s*\|\s*Dunas\s*&\s*Olas$/i, ''))}">`);
  html = setTag(html, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeHtml(values.description)}">`);
  html = setTag(html, /<meta\s+(?:name|property)=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(values.title.replace(/\s*\|\s*Dunas\s*&\s*Olas$/i, ''))}">`);
  html = setTag(html, /<meta\s+(?:name|property)=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(values.description)}">`);
  return html;
}

function updateArticleSchema(html, values) {
  return html.replace(/<script([^>]*type=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi, (tag, attributes, source) => {
    try {
      const data = JSON.parse(source);
      const nodes = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];
      let changed = false;
      for (const node of nodes) {
        const types = Array.isArray(node?.['@type']) ? node['@type'] : [node?.['@type']];
        if (!types.includes('BlogPosting') && !types.includes('Article')) continue;
        if (values) {
          node.headline = values.title.replace(/\s*\|\s*Dunas\s*&\s*Olas$/i, '');
          node.description = values.description;
        }
        node.dateModified = today;
        changed = true;
      }
      return changed ? `<script${attributes}>${JSON.stringify(data).replace(/</g, '\\u003c')}</script>` : tag;
    } catch {
      return tag;
    }
  }).replace(/<meta\s+property=["']article:modified_time["'][^>]*>/i, `<meta property="article:modified_time" content="${today}T08:00:00-05:00">`);
}

function stylesheet(html, href) {
  const tag = `<link rel="stylesheet" href="${href}" data-seo-growth="">`;
  return cssPattern.test(html) ? html.replace(cssPattern, `\n  ${tag}\n`) : html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function cards(items) {
  return `<div class="seo-path-grid">${items.map(([href, title, text]) => `<a class="seo-path-card" href="${href}">${escapeHtml(title)}<span>${escapeHtml(text)}</span></a>`).join('')}</div>`;
}

function articleLinks(rel, html) {
  const en = rel.startsWith('en/');
  const haystack = rel.toLowerCase();
  let items;
  if (/kite|wingfoil|kitefoil|sup\b/.test(haystack)) {
    items = en
      ? [['/en/kitesurf', 'Kitesurf in Cartagena', 'Classes, rentals and water sports.'], ['/en/experiences', 'All experiences', 'Compare current activities and inclusions.'], ['/en/arma-tu-viaje', 'Plan your trip', 'Get written help for your dates.']]
      : [['/kitesurf', 'Kitesurf en Cartagena', 'Clases, alquiler y deportes de viento.'], ['/experiences', 'Todas las experiencias', 'Compara actividades, precios e inclusiones.'], ['/arma-tu-viaje', 'Arma tu viaje', 'Recibe orientación para tus fechas.']];
  } else if (/isla|island|bar[uú]|playa|beach|snorkel|boat|bote|lancha|mar\b/.test(haystack)) {
    items = en
      ? [['/en/islas-del-rosario', 'Rosario Islands', 'Compare island day trips from Cartagena.'], ['/en/experiences', 'Tours and day trips', 'See prices and current inclusions.'], ['/en/private-boats', 'Private boats', 'Plan a route for your group.']]
      : [['/islas-del-rosario', 'Pasadías en las islas', 'Compara destinos, precios e inclusiones.'], ['/experiences', 'Tours y experiencias', 'Revisa todos los planes disponibles.'], ['/renta-de-botes', 'Botes privados', 'Planea una ruta para tu grupo.']];
  } else {
    items = en
      ? [['/en/experiences', 'Experiences in Cartagena', 'Compare tours, prices and inclusions.'], ['/en/cartagena-accommodations', 'Places to stay', 'Apartments and studios for your dates.'], ['/en/arma-tu-viaje', 'Plan your trip', 'Ask for written local guidance.']]
      : [['/experiences', 'Experiencias en Cartagena', 'Compara planes, precios e inclusiones.'], ['/hospedaje-cartagena', 'Alojamientos', 'Consulta apartamentos para tus fechas.'], ['/arma-tu-viaje', 'Arma tu viaje', 'Recibe orientación local por escrito.']];
  }
  const heading = en ? 'Continue planning your Cartagena trip' : 'Sigue planeando tu viaje a Cartagena';
  const intro = en ? 'Useful options connected with this guide.' : 'Opciones útiles relacionadas con esta guía.';
  return `${markerStart}<section class="blog-commercial-paths" aria-labelledby="seo-paths-title"><h2 id="seo-paths-title">${heading}</h2><p>${intro}</p>${cards(items)}</section>${markerEnd}`;
}

function injectArticleBlock(html, block) {
  html = html.replace(blockPattern, '\n');
  const asideAt = html.search(/<aside\b/i);
  if (asideAt > -1) {
    const closeAt = html.lastIndexOf('</article>', asideAt);
    if (closeAt > -1) return `${html.slice(0, closeAt)}${block}\n${html.slice(closeAt)}`;
  }
  const mainAt = html.lastIndexOf('</main>');
  if (mainAt > -1) return `${html.slice(0, mainAt)}${block}\n${html.slice(mainAt)}`;
  return html;
}

function processArticle(file) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  let html = fs.readFileSync(file, 'utf8');
  if (metadata[rel]) html = updateMetadata(html, metadata[rel]);
  html = updateArticleSchema(html, metadata[rel]);
  html = stylesheet(html, rel.startsWith('en/') ? '../../../css/seo-growth.css?v=20261004a' : '../../css/seo-growth.css?v=20261004a');
  html = injectArticleBlock(html, articleLinks(rel, html));
  fs.writeFileSync(file, html, 'utf8');
}

function articleFiles(base) {
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => path.join(base, entry.name, 'index.html')).filter(fs.existsSync);
}

for (const file of [...articleFiles(path.join(root, 'blog')), ...articleFiles(path.join(root, 'en', 'blog'))]) processArticle(file);

for (const [rel, items] of Object.entries(commercialGuides)) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8').replace(blockPattern, '\n');
  if (metadata[rel]) html = updateMetadata(html, metadata[rel]);
  html = stylesheet(html, '/css/seo-growth.css?v=20261004a');
  const block = `${markerStart}<section class="commercial-guides" aria-labelledby="commercial-guides-title"><h2 id="commercial-guides-title">Guías para reservar con más claridad</h2><p>Respuestas locales para comparar opciones y evitar costos o condiciones inesperadas.</p>${cards(items)}</section>${markerEnd}`;
  const mainAt = html.lastIndexOf('</main>');
  html = mainAt > -1 ? `${html.slice(0, mainAt)}${block}\n${html.slice(mainAt)}` : html.replace(/<\/body>/i, `${block}\n</body>`);
  fs.writeFileSync(file, html, 'utf8');
}

for (const [rel, values] of Object.entries(metadata)) {
  if (rel.startsWith('blog/') || rel.startsWith('en/blog/') || commercialGuides[rel]) continue;
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  fs.writeFileSync(file, updateMetadata(fs.readFileSync(file, 'utf8'), values), 'utf8');
}

console.log(`SEO growth: ${articleFiles(path.join(root, 'blog')).length + articleFiles(path.join(root, 'en', 'blog')).length} articles linked; ${Object.keys(commercialGuides).length} commercial hubs reinforced; ${today}`);
