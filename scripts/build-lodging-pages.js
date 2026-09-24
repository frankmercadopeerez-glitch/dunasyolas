const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const sharp = require('sharp');

const base = 'https://dunasyolas.com';
const data = require('../data/accommodations.json');
const localeNames = { es: 'Español', en: 'English', fr: 'Français', de: 'Deutsch' };
const messageStart = {
  es: 'Hola, quisiera consultar este alojamiento de Dunas & Olas:',
  en: 'Hello, I would like to ask about this Dunas & Olas accommodation:',
  fr: 'Bonjour, je voudrais me renseigner sur ce logement Dunas & Olas :',
  de: 'Hallo, ich möchte diese Unterkunft von Dunas & Olas anfragen:'
};
const wordings = {
  es: { fees: 'Recargos publicados', fee: 'Aseo final y registro', wristbands: 'Manillas por grupo', price: 'Tarifa por noche', feeSuffix: 'por estancia', wristbandSuffix: 'por grupo', capacity: 'Capacidad indicada', guests: 'personas', ask: 'Consultar disponibilidad', catalog: 'Abrir catálogo de WhatsApp', before: 'Confirma el total antes de reservar', note: 'La tarifa por noche depende de la fecha. Envía fechas de entrada y salida y cuántas personas viajan para confirmar disponibilidad, precio y recargos.', location: 'Cartagena, cerca de la playa', breadcrumb: 'Inicio', home: 'Alojamientos' },
  en: { fees: 'Catalogue-listed extra fees', fee: 'Final cleaning and registration', wristbands: 'Guest wristbands per group', price: 'Nightly rate', feeSuffix: 'per stay', wristbandSuffix: 'per group', capacity: 'Listed capacity', guests: 'guests', ask: 'Ask about availability', catalog: 'Open WhatsApp catalogue', before: 'Confirm the total before booking', note: 'Nightly rates depend on your dates. Send check-in and check-out dates and guest count to confirm availability, price and extra fees.', location: 'Cartagena, near the beach', breadcrumb: 'Home', home: 'Accommodation' },
  fr: { fees: 'Frais supplémentaires du catalogue', fee: 'Ménage final et enregistrement', wristbands: 'Bracelets par groupe', price: 'Tarif par nuit', feeSuffix: 'par séjour', wristbandSuffix: 'par groupe', capacity: 'Capacité indiquée', guests: 'personnes', ask: 'Demander la disponibilité', catalog: 'Ouvrir le catalogue WhatsApp', before: 'Confirmez le total avant de réserver', note: 'Le tarif par nuit dépend des dates. Envoyez les dates d’arrivée et de départ et le nombre de voyageurs pour confirmer la disponibilité, le prix et les frais.', location: 'Carthagène, près de la plage', breadcrumb: 'Accueil', home: 'Hébergements' },
  de: { fees: 'Zusatzkosten laut Katalog', fee: 'Endreinigung und Registrierung', wristbands: 'Armbänder pro Gruppe', price: 'Preis pro Nacht', feeSuffix: 'pro Aufenthalt', wristbandSuffix: 'pro Gruppe', capacity: 'Angegebene Kapazität', guests: 'Personen', ask: 'Verfügbarkeit anfragen', catalog: 'WhatsApp-Katalog öffnen', before: 'Gesamtpreis vor der Buchung bestätigen', note: 'Der Übernachtungspreis hängt vom Reisedatum ab. Senden Sie Anreise, Abreise und Gästezahl, um Verfügbarkeit, Preis und Zusatzkosten zu bestätigen.', location: 'Cartagena, nahe am Strand', breadcrumb: 'Startseite', home: 'Unterkünfte' }
};
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const routeFile = (route) => route.slice(1) + '.html';
const money = (amount, lang) => '$' + new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-CO').format(amount) + ' COP';
const waHref = (lang, property) => 'https://wa.me/573163030589?text=' + encodeURIComponent(messageStart[lang] + ' ' + property.name[lang] + '. ' + wordings[lang].note);

function card(property, lang, meta) {
  const w = wordings[lang];
  const fees = `<div class="stay-card-fees"><h3>${w.fees}</h3><p><span>${escape(property.feeLabel?.[lang] || w.fee)}</span><strong>${money(property.feeCOP, lang)} <small>${w.feeSuffix}</small></strong></p>${property.wristbandCOP ? `<p><span>${w.wristbands}</span><strong>${money(property.wristbandCOP, lang)} <small>${w.wristbandSuffix}</small></strong></p>` : ''}</div>`;
  const capacity = property.capacity ? `<p class="stay-capacity"><span>${w.capacity}:</span> ${property.capacity} ${w.guests}</p>` : '';
  return `<article class="stay-card"><img src="${property.image}" alt="${escape(property.name[lang])}" width="${meta.width}" height="${meta.height}" loading="lazy" decoding="async"><div class="stay-card-content"><p class="stay-catalog-name">${escape(property.catalogName)}</p><h2>${escape(property.name[lang])}</h2><p class="stay-copy">${escape(property.copy[lang])}</p>${capacity}<p class="stay-rate"><span>${w.price}</span><strong>${lang === 'en' ? 'Ask for the rate' : lang === 'fr' ? 'Tarif à demander' : lang === 'de' ? 'Preis bitte anfragen' : 'Consultar tarifa'}</strong></p>${fees}<a class="stay-button" href="${waHref(lang, property)}" target="_blank" rel="noopener noreferrer">${w.ask}</a></div></article>`;
}

async function writePage(lang) {
  const route = data.routes[lang];
  const sourceFile = ({ es: 'about.html', en: 'en/about.html', fr: 'fr/a-propos.html', de: 'de/ueber-uns.html' })[lang];
  const template = cheerio.load(fs.readFileSync(sourceFile, 'utf8'));
  const locale = data.locale[lang];
  const words = wordings[lang];
  const runtimeScripts = template('body script[src]').toArray().filter((script) => /site-refresh\.js|international\.js/.test(template(script).attr('src') || '')).map((script) => template.html(script));
  const properties = [];
  for (const property of data.properties) {
    const imageFile = path.join(process.cwd(), property.image.replace(/^\//, ''));
    if (!fs.existsSync(imageFile)) throw new Error(`${property.id}: falta imagen ${property.image}`);
    const { width, height } = await sharp(imageFile).metadata();
    properties.push({ ...property, meta: { width, height } });
  }
  const cards = data.properties.map((property, index) => card(property, lang, properties[index].meta)).join('');
  const body = `<main class="stay-page" id="main"><div class="stay-hero"><div><p class="stay-eyebrow">Dunas &amp; Olas · Cartagena</p><h1>${escape(locale.title)}</h1><p class="stay-intro">${escape(locale.intro)}</p><p class="stay-seasonal">${escape(locale.seasonal)}</p><a class="stay-catalog-link" href="https://wa.me/c/573163030589" target="_blank" rel="noopener noreferrer">${escape(locale.catalog)}</a></div><img src="${data.properties[0].image}" alt="${escape(data.properties[0].name[lang])}" width="${properties[0].meta.width}" height="${properties[0].meta.height}" loading="eager" fetchpriority="high" decoding="async"></div><section class="stay-grid" aria-label="${escape(locale.title)}">${cards}</section><section class="stay-contact"><h2>${escape(locale.why)}</h2><p>${escape(locale.note)}</p><p>${escape(locale.support)}</p><a class="stay-button" href="https://wa.me/573163030589?text=${encodeURIComponent(messageStart[lang] + ' ' + (lang === 'es' ? 'Fechas: __. Huéspedes: __.' : lang === 'en' ? 'Dates: __. Guests: __.' : lang === 'fr' ? 'Dates : __. Voyageurs : __.' : 'Daten: __. Gäste: __.'))}" target="_blank" rel="noopener noreferrer">${escape(words.ask)}</a></section></main>`;
  const nav = template('nav').first().clone();
  const footer = template('footer').first().clone();
  nav.find('[aria-current="page"]').removeAttr('aria-current').removeClass('is-active');
  template('body').empty().append(nav).append(body).append(footer);
  const description = locale.description;
  const imageUrl = base + data.properties[0].image;
  const title = locale.title + ' | Dunas & Olas';
  template('title').text(title);
  template('meta[name="description"]').attr('content', description);
  template('meta[name="keywords"]').attr('content', `${locale.title}, Cartagena, Dunas & Olas, accommodation, apartment, studio`);
  template('link[rel="canonical"]').attr('href', base + route);
  template('meta[property="og:url"]').attr('content', base + route);
  template('meta[property="og:title"]').attr('content', title);
  template('meta[property="og:description"]').attr('content', description);
  template('meta[property="og:image"]').attr('content', imageUrl);
  template('meta[property="twitter:title"]').attr('content', title);
  template('meta[property="twitter:description"]').attr('content', description);
  template('meta[property="twitter:image"]').attr('content', imageUrl);
  template('link[rel="alternate"]').remove();
  for (const [code, url] of Object.entries(data.routes)) template('head').append(`<link rel="alternate" hreflang="${code}" href="${base + url}">`);
  template('head').append(`<link rel="alternate" hreflang="x-default" href="${base + data.routes.es}">`);
  template('head').append('<link rel="stylesheet" href="/css/accommodations.css?v=20260924a">');
  template('script[type="application/ld+json"]').remove();
  const itemList = data.properties.map((property, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'Accommodation', name: property.name[lang], description: property.copy[lang], image: base + property.image } }));
  const schema = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: words.breadcrumb, item: base + (lang === 'es' ? '/' : `/${lang}/`) }, { '@type': 'ListItem', position: 2, name: locale.title, item: base + route }] },
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: locale.title, description, url: base + route, inLanguage: lang, mainEntity: { '@type': 'ItemList', itemListElement: itemList } }
  ];
  template('head').append(`<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`);
  template('body').append(runtimeScripts.join(''));
  fs.writeFileSync(routeFile(route), template.html() + '\n');
}

function injectNavigationAndLinks() {
  const routes = data.routes;
  function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      if (['node_modules', '.git', '.vercel', 'tmp'].includes(entry.name)) return [];
      const full = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(full) : entry.name.endsWith('.html') ? [full] : [];
    });
  }
  const linkNames = { es: 'Hospedajes', en: 'Stays', fr: 'Hébergements', de: 'Unterkünfte' };
  for (const file of walk('.')) {
    const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
    const lang = (($('html').attr('lang') || 'es').slice(0, 2));
    if (!routes[lang]) continue;
    const route = routes[lang];
    const name = linkNames[lang];
    $('.site-mobile-menu').each((index, menu) => {
      if (!$(menu).find('[data-lodging-link]').length) {
        const boats = $(menu).find('a[href*="private-boats"],a[href*="renta-de-botes"],a[href*="location-bateau"],a[href*="bootsmiete"]').last();
        const item = `<a class="site-mobile-link" data-lodging-link href="${route}">${name}</a>`;
        boats.length ? boats.after(item) : $(menu).append(item);
      }
    });
    $('.intl-menu-list').each((index, menu) => {
      if (!$(menu).find('[data-lodging-link]').length) $(menu).append(`<a data-lodging-link href="${route}">${name}</a>`);
    });
    $('.intl-links').each((index, nav) => {
      if (!$(nav).find('[data-lodging-link]').length) $(nav).append(`<a data-lodging-link href="${route}">${name}</a>`);
    });
    const footer = $('footer').first();
    if (footer.length && !footer.find('[data-lodging-link]').length) {
      const intlLinks = footer.find('.intl-footer-links').first();
      if (intlLinks.length) intlLinks.append(`<a data-lodging-link href="${route}">${name}</a>`);
      else {
        const explore = footer.find('h3,h4').filter((i, el) => /explorar|explore/i.test($(el).text())).first();
        const list = explore.next('ul');
        if (list.length) list.append(`<li><a data-lodging-link href="${route}">${name}</a></li>`);
        else footer.append(`<p><a data-lodging-link href="${route}">${name}</a></p>`);
      }
    }
    if ((file === 'index.html' || file === 'en/index.html' || file === 'fr/index.html' || file === 'de/index.html') && !$('#home-stays').length) {
      const locale = data.locale[lang];
      const label = { es: 'Alojamientos cerca del mar', en: 'Stays near the beach', fr: 'Hébergements près de la plage', de: 'Unterkünfte nahe am Strand' }[lang];
      const link = `<section id="home-stays" class="stay-home-teaser"><div><p class="stay-eyebrow">${lang === 'es' ? 'DESCANSA EN CARTAGENA' : lang === 'en' ? 'STAY IN CARTAGENA' : lang === 'fr' ? 'SÉJOUR À CARTHAGÈNE' : 'ÜBERNACHTEN IN CARTAGENA'}</p><h2>${label}</h2><p>${escape(locale.intro)}</p><a href="${route}">${escape(locale.all)} <span aria-hidden="true">→</span></a></div></section>`;
      const anchor = $('#home-private-boats').last();
      if (anchor.length) anchor.after(link);
      else $('main').first().append(link);
    }
    if (['experiences.html', 'en/experiences.html', 'fr/excursions.html', 'de/ausfluege.html'].includes(file) && !$('#experiences-stays').length) {
      const label = { es: 'También puedes quedarte cerca de la playa', en: 'You can also stay near the beach', fr: 'Vous pouvez aussi séjourner près de la plage', de: 'Übernachten Sie auch nahe am Strand' }[lang];
      const description = data.locale[lang].intro;
      const link = `<aside id="experiences-stays" class="stay-experiences-link"><div><strong>${label}</strong><p>${escape(description)}</p></div><a href="${route}">${escape(data.locale[lang].all)} <span aria-hidden="true">→</span></a></aside>`;
      const grid = $('#experiences-grid').first();
      if (grid.length) grid.before(link);
      else $('main').first().prepend(link);
    }
    if ((file === 'blog/donde-alojarse-en-cartagena/index.html' || file === 'en/blog/donde-alojarse-en-cartagena/index.html') && !$('[data-stays-article-link]').length) {
      const articleLink = `<aside class="stay-article-link" data-stays-article-link><h2>${escape(data.locale[lang].blog)}</h2><p>${escape(data.locale[lang].intro)}</p><a href="${route}">${escape(data.locale[lang].all)} →</a></aside>`;
      const main = $('main').first();
      const article = main.find('article').first();
      article.length ? article.append(articleLink) : main.append(articleLink);
    }
    fs.writeFileSync(file, $.html().replace(/[ \t]+$/gm, ''));
  }
}

async function main() {
  for (const property of data.properties) {
    const photo = path.join(process.cwd(), property.image.replace(/^\//, ''));
    if (!fs.existsSync(photo)) throw new Error(`Falta la fotografía real del catálogo: ${photo}`);
  }
  for (const lang of Object.keys(data.routes)) await writePage(lang);
  injectNavigationAndLinks();
  console.log(`Accommodation pages generated in ${Object.keys(data.routes).length} languages, ${data.properties.length} distinct catalog listings.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
