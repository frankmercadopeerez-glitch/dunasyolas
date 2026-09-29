const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data', 'google-reviews.json'), 'utf8'));
const cssLink = '<link rel="stylesheet" href="/css/google-reviews.css?v=20260929a">';
const scriptTag = '<script src="/js/google-reviews.js?v=20260929a" defer></script>';

function esc(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function stars(rating, lang = 'es') {
  return `<span class="google-review-stars" aria-label="${lang === 'en' ? `${rating} out of 5 stars` : `${rating} de 5 estrellas`}">★★★★★</span>`;
}

function card(review, lang) {
  const text = lang === 'en' ? review.textEn : review.textEs;
  const source = lang === 'en' ? 'Verified public review on Google' : 'Reseña pública verificada en Google';
  return `<article class="google-review-card"><div>${stars(review.rating, lang)}</div><blockquote>“${esc(text)}”</blockquote><div class="google-review-attribution"><cite>${esc(review.author)}</cite><span class="google-review-source">${source}</span></div></article>`;
}

function section(lang, compact = false) {
  const en = lang === 'en';
  const cards = data.reviews.map((review) => card(review, lang)).join('');
  const title = en ? 'Travelers recommend Dunas & Olas' : 'Viajeros que ya confiaron en Dunas & Olas';
  const note = en
    ? `Google currently reports ${data.reviewCount} public reviews. Three include public text visible for quotation; open the profile to see the live total and latest updates.`
    : `Google informa actualmente ${data.reviewCount} reseñas públicas. Tres muestran texto público verificable para citar; abre la ficha para consultar el total y las actualizaciones más recientes.`;
  return `<section class="google-reviews-section" data-google-reviews aria-labelledby="google-reviews-title"><div class="google-reviews-shell"><div class="google-reviews-head"><div><p class="google-reviews-kicker">Google Reviews</p><h2 id="google-reviews-title">${title}</h2></div><div class="google-reviews-score" aria-label="${en ? `${data.rating} out of 5, ${data.reviewCount} reviews on Google` : `${data.rating} de 5, ${data.reviewCount} reseñas en Google`}"><strong>${data.rating.toFixed(1)}</strong><div>${stars(5, lang)}<span>${data.reviewCount} ${en ? 'reviews on Google' : 'reseñas en Google'}</span></div></div></div><div class="google-reviews-actions"><a class="google-reviews-link" href="${data.profileUrl}" target="_blank" rel="noopener noreferrer">${en ? 'View live Google profile' : 'Ver ficha en Google'}</a><button class="google-reviews-pause" type="button" aria-pressed="false" data-pause-label="${en ? 'Pause carousel' : 'Pausar carrusel'}" data-play-label="${en ? 'Resume carousel' : 'Reanudar carrusel'}">${en ? 'Pause carousel' : 'Pausar carrusel'}</button></div><div class="google-reviews-viewport"><div class="google-reviews-track"><div class="google-reviews-set">${cards}</div></div></div><p class="google-reviews-note">${note} ${en ? 'Verified' : 'Verificado'}: ${data.verifiedOn}.</p>${compact ? '' : `<a class="google-reviews-page-cta" href="${data.profileUrl}" target="_blank" rel="noopener noreferrer">${en ? 'Read all reviews directly on Google' : 'Leer todas las reseñas directamente en Google'} →</a>`}</div></section>`;
}

function organizationSchema() {
  return {
    '@type': ['TravelAgency', 'LocalBusiness'],
    '@id': 'https://dunasyolas.com/#org',
    name: 'Dunas & Olas',
    alternateName: 'Mexicana en Cartagena & Dunas y Olas Agencia Turística Multicultural',
    url: 'https://dunasyolas.com',
    logo: { '@type': 'ImageObject', url: 'https://dunasyolas.com/images/favicon-512.png', width: 512, height: 512 },
    telephone: '+573163030589',
    areaServed: { '@type': 'City', name: 'Cartagena de Indias' },
    priceRange: '$$',
    currenciesAccepted: 'COP',
    openingHours: 'Mo-Su 08:00-20:00',
    hasMap: data.profileUrl,
    sameAs: [
      data.profileUrl,
      'https://www.instagram.com/mexicanaencartagena',
      'https://www.facebook.com/dunasyolas',
      'https://www.tiktok.com/@mexicanaencartagena',
      'https://youtube.com/@mexicanaencartagena'
    ]
  };
}

function patchSchema(html) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (!match) return html;
  let parsed;
  try { parsed = JSON.parse(match[1]); } catch { return html; }
  const graph = parsed['@graph'];
  if (!Array.isArray(graph)) return html;
  const org = graph.find((entry) => entry && entry['@id'] === 'https://dunasyolas.com/#org');
  if (org) Object.assign(org, organizationSchema());
  else graph.unshift(organizationSchema());
  return html.replace(match[0], () => `<script type="application/ld+json">${JSON.stringify(parsed).replace(/</g, '\\u003c')}</script>`);
}

function patchHome(relative, lang) {
  const file = path.join(root, relative);
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/\/\* --- Carrusel Doble de Reseñas --- \*\/[\s\S]*?(?=\s*\/\* FAQ accordion \*\/)/, '');
  html = html.replace(/(?:<!-- Carrusel Doble de Reseñas -->|<!-- Google Reviews -->)[\s\S]*?(?:<!-- \/Google Reviews -->\s*)?<!-- Blog Preview -->/, `<!-- Google Reviews -->\n${section(lang, true)}\n<!-- /Google Reviews -->\n\n    <!-- Blog Preview -->`);
  if (!html.includes('/css/google-reviews.css')) html = html.replace('</head>', `  ${cssLink}\n</head>`);
  if (!html.includes('/js/google-reviews.js')) html = html.replace('</body>', `  ${scriptTag}\n</body>`);
  html = patchSchema(html);
  fs.writeFileSync(file, html);
}

function page(lang) {
  const en = lang === 'en';
  const route = en ? '/en/reviews' : '/opiniones';
  const canonical = `https://dunasyolas.com${route}`;
  const title = en ? 'Dunas & Olas reviews on Google' : 'Opiniones de Dunas & Olas en Google';
  const description = en
    ? 'Read verified public Google reviews about Dunas & Olas and open the live Google Business Profile.'
    : 'Consulta reseñas públicas verificadas de Dunas & Olas y abre la ficha oficial de la agencia en Google.';
  const schema = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: canonical,
    inLanguage: en ? 'en' : 'es-CO', about: { '@id': 'https://dunasyolas.com/#org' }, isPartOf: { '@id': 'https://dunasyolas.com/#website' }
  };
  return `<!DOCTYPE html><html lang="${en ? 'en' : 'es'}" class="brand-refresh-active"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Dunas &amp; Olas</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="es" href="https://dunasyolas.com/opiniones"><link rel="alternate" hreflang="en" href="https://dunasyolas.com/en/reviews"><link rel="alternate" hreflang="x-default" href="https://dunasyolas.com/opiniones"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://dunasyolas.com/images/cartagena.webp"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/css/brand-refresh.css?v=20260915f">${cssLink}<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script></head><body><main class="google-reviews-page"><p class="google-reviews-kicker">Google Business Profile</p><h1>${title}</h1><p class="google-reviews-page-intro">${description} ${en ? 'The live profile is the authoritative source for the current rating and review count.' : 'La ficha en vivo es la fuente autorizada para la calificación y el número actual de reseñas.'}</p>${section(lang)}<section class="google-reviews-facts"><h2>${en ? 'How these reviews are verified' : 'Cómo verificamos estas opiniones'}</h2><p>${en ? `The names, ratings and excerpts shown here were checked against the public Google profile on ${data.verifiedOn}. Google currently displays a ${data.rating.toFixed(1)} rating from ${data.reviewCount} reviews. No unpublished review or rating has been invented.` : `Los nombres, calificaciones y fragmentos mostrados aquí se contrastaron con la ficha pública de Google el ${data.verifiedOn}. Google muestra actualmente una calificación de ${data.rating.toFixed(1)} basada en ${data.reviewCount} reseñas. No se inventó ninguna opinión ni puntuación no publicada.`}</p><p><strong>${en ? 'Business' : 'Negocio'}:</strong> ${esc(data.profileName)}<br><strong>${en ? 'Phone' : 'Teléfono'}:</strong> +57 316 303 0589<br><strong>${en ? 'Service area' : 'Zona de servicio'}:</strong> Cartagena de Indias</p></section></main><script src="/js/site-refresh.js?v=20260915f" defer></script>${scriptTag}</body></html>`;
}

patchHome('index.html', 'es');
patchHome(path.join('en', 'index.html'), 'en');
fs.writeFileSync(path.join(root, 'opiniones.html'), page('es'));
fs.writeFileSync(path.join(root, 'en', 'reviews.html'), page('en'));
console.log(`Google reviews: ${data.reviews.length} verified excerpts, ${data.reviewCount} public reviews, ES/EN pages generated.`);
