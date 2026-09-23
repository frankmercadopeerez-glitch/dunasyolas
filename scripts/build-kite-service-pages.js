const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const root = path.resolve(__dirname, '..');
const catalog = require('../data/catalog.json');
const version = '20260923seo';
const sourceCatalog = cheerio.load(fs.readFileSync(path.join(root,'kitesurf.html'),'utf8'));

const services = [
  ['kitesurf_iniciacion','clase-iniciacion-kitesurf-cartagena','beginner-kitesurf-lesson-cartagena','Clase de iniciación de kitesurf en Cartagena','Beginner kitesurf lesson in Cartagena','2 horas','2 hours','Personas que empiezan desde cero.','First-time students.','Control de cometa en tierra|Seguridad y lectura del viento|Primeros ejercicios en el agua|Equipo e hidratación','Kite control on land|Wind reading and safety|First water exercises|Equipment and hydration'],
  ['kitesurf_refuerzo','clase-refuerzo-kitesurf-cartagena','kitesurf-refresher-lesson-cartagena','Clase de refuerzo de kitesurf en Cartagena','Kitesurf refresher lesson in Cartagena','1 hora','1 hour','Riders que ya tomaron una clase y quieren recuperar confianza.','Riders who have taken a lesson and want to regain confidence.','Práctica guiada|Corrección de técnica|Equipo e hidratación','Guided practice|Technique corrections|Equipment and hydration'],
  ['kitesurf_grupal','clase-grupal-kitesurf-cartagena','group-kitesurf-lesson-cartagena','Clase grupal de kitesurf en Cartagena','Group kitesurf lesson in Cartagena','1 hora','1 hour','Amigos, parejas o familias que quieren aprender juntos.','Friends, couples or families who want to learn together.','Clase para 2 a 4 personas|Instructor y equipo|Hidratación','Lesson for 2 to 4 people|Instructor and equipment|Hydration'],
  ['kitesurf_medio','curso-medio-kitesurf-cartagena','intermediate-kitesurf-course-cartagena','Curso medio de kitesurf en Cartagena','Intermediate kitesurf course in Cartagena','4 horas','4 hours','Alumnos que buscan consolidar el control de la cometa y la tabla.','Students building consistent kite and board control.','Entrenamiento progresivo|Equipo durante las clases|Hidratación','Progressive training|Equipment during lessons|Hydration'],
  ['kitesurf_rider','curso-rider-kitesurf-cartagena','rider-kitesurf-course-cartagena','Curso Rider de kitesurf en Cartagena','Rider kitesurf course in Cartagena','8 horas','8 hours','Principiantes que quieren completar una formación progresiva.','Beginners seeking a structured progression.','Ocho horas de formación|Equipo durante las clases|Hidratación','Eight hours of training|Equipment during lessons|Hydration'],
  ['kitesurf_avanzado','curso-avanzado-kitesurf-cartagena','advanced-kitesurf-course-cartagena','Curso avanzado de kitesurf en Cartagena','Advanced kitesurf course in Cartagena','10 horas','10 hours','Riders con experiencia que quieren mejorar maniobras y autonomía.','Experienced riders working on skills and independence.','Entrenamiento avanzado|Equipo durante las clases|Hidratación','Advanced coaching|Equipment during lessons|Hydration'],
  ['kitesurf_elite','experiencia-elite-vip-kitesurf','vip-kitesurf-experience-cartagena','Experiencia Elite VIP de kitesurf','VIP kitesurf experience in Cartagena','12 horas','12 hours','Viajeros que prefieren una experiencia completa y coordinada.','Travelers who want a fully coordinated experience.','Clases de kitesurf|Coordinación de transporte y logística|Equipo e hidratación','Kitesurf lessons|Transport and logistics coordination|Equipment and hydration'],
  ['kitesurf_foil','kitefoil-cartagena','kitefoil-cartagena','Sesión de kitefoil en Cartagena','Kitefoil session in Cartagena','1 sesión','1 session','Riders con nivel previo que quieren probar o mejorar en foil.','Experienced riders who want to try or improve foil riding.','Sesión guiada|Revisión de nivel antes de confirmar|Hidratación','Guided session|Skill check before confirmation|Hydration'],
  ['kitesurf_wingfoil','wingfoil-cartagena','wingfoil-cartagena','Clase de wingfoil en Cartagena','Wingfoil lesson in Cartagena','1 hora','1 hour','Personas que quieren iniciarse o progresar en wingfoil.','Students who want to start or progress in wingfoil.','Clase guiada|Equipo para la sesión|Hidratación','Guided lesson|Equipment for the session|Hydration'],
  ['kitesurf_sup','alquiler-sup-cartagena','sup-rental-cartagena','Alquiler de tabla SUP en Cartagena','SUP board rental in Cartagena','1 hora','1 hour','Viajeros que buscan una actividad tranquila sobre el agua.','Travelers looking for a relaxed activity on the water.','Tabla SUP|Orientación básica antes de salir|Horario sujeto a condiciones','SUP board|Basic briefing before departure|Schedule subject to conditions'],
  ['kitesurf_downwind','downwind-kitesurf-baru-rosario','kitesurf-downwind-baru-rosario','Expedición downwind Barú–Rosario','Barú–Rosario kitesurf downwind','Jornada coordinada','Coordinated day','Riders avanzados con nivel comprobable.','Advanced riders with verifiable skills.','Coordinación de la ruta|Logística y transporte del grupo|Confirmación de viento y seguridad','Route coordination|Group transport and logistics|Wind and safety confirmation'],
  ['kitesurf_fotos','sesion-fotos-kitesurf-cartagena','kitesurf-photo-session-cartagena','Sesión de fotos de kitesurf en Cartagena','Kitesurf photo session in Cartagena','1 sesión','1 session','Riders que quieren imágenes de su sesión en el agua.','Riders who want images of their session on the water.','Coordinación con fotógrafo|Sesión sujeta a luz y clima|Entrega a confirmar antes de reservar','Photographer coordination|Session subject to light and weather|Delivery confirmed before booking'],
  ['kitesurf_alquiler_supervisado','alquiler-kitesurf-con-supervision','supervised-kitesurf-equipment-rental','Alquiler de kitesurf con supervisión','Supervised kitesurf equipment rental','1 hora','1 hour','Riders autónomos que prefieren acompañamiento en playa.','Independent riders who prefer support from the beach.','Equipo completo|Supervisión durante la hora|Validación de nivel y condiciones','Complete equipment|Supervision during the hour|Skill and conditions check'],
  ['kitesurf_alquiler_equipo','alquiler-equipo-kitesurf-cartagena','kitesurf-equipment-rental-cartagena','Alquiler de equipo de kitesurf en Cartagena','Kitesurf equipment rental in Cartagena','1 hora','1 hour','Riders autónomos con experiencia comprobable.','Independent riders with verifiable experience.','Equipo completo|Revisión del equipo|Validación de nivel antes de la entrega','Complete equipment|Equipment check|Skill check before handover'],
  ['kitesurf_supervision','supervision-kitesurf-equipo-propio','kitesurf-supervision-own-equipment','Supervisión de kitesurf con equipo propio','Kitesurf supervision with your own equipment','1 hora','1 hour','Riders con equipo propio que quieren apoyo desde la playa.','Riders with their own equipment who want beach support.','Supervisión en playa|Orientación sobre el spot|Confirmación de condiciones','Beach supervision|Local spot briefing|Conditions confirmation']
];

const money = n => '$' + Number(n).toLocaleString('es-CO') + ' COP';
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function render(lang, row) {
  const [id, esSlug, enSlug, esTitle, enTitle, esDuration, enDuration, esAudience, enAudience, esIncludes, enIncludes] = row;
  const en = lang === 'en';
  const product = catalog.products[id];
  if (!product) throw new Error('Missing product ' + id);
  const slug = en ? enSlug : esSlug;
  const title = en ? enTitle : esTitle;
  const duration = en ? enDuration : esDuration;
  const audience = en ? enAudience : esAudience;
  const includes = (en ? enIncludes : esIncludes).split('|');
  const canonical = `https://dunasyolas.com/${en ? 'en/kitesurf/' : 'kitesurf/'}${slug}`;
  const alternate = `https://dunasyolas.com/${en ? 'kitesurf/' + esSlug : 'en/kitesurf/' + enSlug}`;
  const cardImage = sourceCatalog(`[onclick*="addToCart('${id}'"]`).first().closest('[data-category]').find('img').first().attr('src');
  const imagePath = product.image || (cardImage ? '/' + cardImage.replace(/^\//,'') : '/images/kitesurf/jump.webp');
  const image = 'https://dunasyolas.com' + imagePath;
  const description = en
    ? `${title} in La Boquilla. ${duration}, ${money(product.price)} per person. Check wind, availability and your skill level before booking.`
    : `${title} en La Boquilla. ${duration}, ${money(product.price)} por persona. Confirma viento, disponibilidad y nivel antes de reservar.`;
  const schema = {
    '@context':'https://schema.org','@graph':[
      {'@type':'WebPage','@id':canonical+'#page',url:canonical,name:title,description,inLanguage:en?'en':'es-CO',primaryImageOfPage:{'@type':'ImageObject',url:image}},
      {'@type':'Service','@id':canonical+'#service',name:title,description,serviceType:en?'Kitesurf service':'Servicio de kitesurf',areaServed:{'@type':'Place',name:'La Boquilla, Cartagena de Indias'},provider:{'@id':'https://dunasyolas.com/#org'},offers:{'@type':'Offer',price:product.price,priceCurrency:'COP',url:canonical}},
      {'@type':'BreadcrumbList',itemListElement:[
        {'@type':'ListItem',position:1,name:en?'Home':'Inicio',item:`https://dunasyolas.com/${en?'en/':''}`},
        {'@type':'ListItem',position:2,name:'Kitesurf',item:`https://dunasyolas.com/${en?'en/':''}kitesurf`},
        {'@type':'ListItem',position:3,name:title,item:canonical}
      ]},
      {'@type':'FAQPage',mainEntity:[
        {'@type':'Question',name:en?'Where does the activity take place?':'¿Dónde se realiza la actividad?',acceptedAnswer:{'@type':'Answer',text:en?'The meeting point is in La Boquilla, Cartagena. The exact location is confirmed with your booking request.':'El punto de encuentro está en La Boquilla, Cartagena. La ubicación exacta se confirma con la solicitud de reserva.'}},
        {'@type':'Question',name:en?'Is the activity always available?':'¿La actividad está siempre disponible?',acceptedAnswer:{'@type':'Answer',text:en?'No. The schedule depends on wind, weather, instructor and equipment availability. The team confirms conditions before payment.':'No. El horario depende del viento, el clima y la disponibilidad de instructor y equipo. El equipo confirma las condiciones antes del pago.'}}
      ]}
    ]
  };
  const template = fs.readFileSync(path.join(root, en ? 'en/about.html' : 'about.html'),'utf8');
  const $ = cheerio.load(template);
  $('html').attr('lang',en?'en':'es-CO');
  $('title').text(`${title} | Dunas & Olas`);
  $('meta[name=description]').attr('content',description);
  $('meta[name=keywords]').remove();
  $('link[rel=canonical]').attr('href',canonical);
  $('link[rel=alternate]').remove();
  $('head').append(`<link rel="alternate" hreflang="es" href="https://dunasyolas.com/kitesurf/${esSlug}"><link rel="alternate" hreflang="en" href="https://dunasyolas.com/en/kitesurf/${enSlug}"><link rel="alternate" hreflang="x-default" href="https://dunasyolas.com/kitesurf/${esSlug}">`);
  $('meta[property="og:title"]').attr('content',title);
  $('meta[property="og:description"]').attr('content',description);
  $('meta[property="og:url"]').attr('content',canonical);
  $('meta[property="og:image"]').attr('content',image);
  $('meta[name="twitter:title"]').attr('content',title);
  $('meta[name="twitter:description"]').attr('content',description);
  $('script[type="application/ld+json"]').remove();
  $('head').append(`<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
  $('link[href*="kite-services.css"]').remove();
  $('head').append(`<link rel="stylesheet" href="/css/kite-services.css?v=${version}">`);
  const wa = encodeURIComponent(en ? `Hello, I would like to check availability for ${title}. Date: __. People: __.` : `Hola, quiero consultar disponibilidad para ${title}. Fecha: __. Personas: __.`);
  const related = services.filter(x=>x[0]!==id).slice(0,3).map(x=>`<a href="/${en?'en/':''}kitesurf/${en?x[2]:x[1]}">${esc(en?x[4]:x[3])}</a>`).join('');
  const main = `<main id="main-content" class="kite-service-page"><header class="kite-service-hero"><div><a class="kite-service-back" href="/${en?'en/':''}kitesurf">← ${en?'All kitesurf services':'Todos los servicios de kitesurf'}</a><p class="kite-service-kicker">La Boquilla · Cartagena</p><h1>${esc(title)}</h1><p>${esc(description)}</p><div class="kite-service-price"><span>${en?'Price per person':'Precio por persona'}</span><strong>${money(product.price)}</strong><small>${esc(duration)}</small></div><a class="kite-service-cta" href="https://wa.me/573163030589?text=${wa}">${en?'Check availability on WhatsApp':'Consultar disponibilidad por WhatsApp'}</a></div><img src="${image.replace('https://dunasyolas.com','')}" alt="${esc(title)}" width="1200" height="800" loading="eager" decoding="async"></header><section class="kite-service-details"><div><h2>${en?'What is included':'Qué incluye'}</h2><ul>${includes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h2>${en?'Who it is for':'Para quién es'}</h2><p>${esc(audience)}</p><p>${en?'We confirm the appropriate level, wind conditions and exact meeting time before you pay.':'Confirmamos el nivel adecuado, las condiciones de viento y la hora exacta de encuentro antes del pago.'}</p></div></section><section class="kite-service-trust"><h2>${en?'Before booking':'Antes de reservar'}</h2><p>${en?'Send your date, number of people, previous experience and hotel location. Kitesurf activities depend on wind and weather; if conditions are unsafe, the team will propose another time.':'Envía tu fecha, número de personas, experiencia previa y ubicación del hotel. Las actividades de kitesurf dependen del viento y el clima; si las condiciones no son seguras, el equipo propondrá otro horario.'}</p></section><section class="kite-service-related"><h2>${en?'Compare other options':'Compara otras opciones'}</h2><div>${related}</div></section></main>`;
  const nav = $('nav').first().toString();
  const footer = $('footer').first().toString();
  $('body').html(`${nav}${main}${footer}<script src="/js/site-refresh.js?v=${version}" defer></script>`);
  const templateBase = `https://dunasyolas.com/${en ? 'en/about' : 'about'}`;
  $('[href],[src],[srcset]').each((_, element) => {
    for (const attr of ['href','src','srcset']) {
      const value = $(element).attr(attr);
      if (!value || value.startsWith('/') || value.startsWith('#') || /^(?:https?:|mailto:|tel:|data:)/i.test(value)) continue;
      if (attr === 'srcset') {
        $(element).attr(attr,value.split(',').map(part=>{const bits=part.trim().split(/\s+/);const u=new URL(bits[0],templateBase);return u.pathname+u.search+(bits[1]?' '+bits[1]:'');}).join(', '));
      } else {
        const u = new URL(value,templateBase);
        $(element).attr(attr,u.pathname+u.search+u.hash);
      }
    }
  });
  return $.html()
    .replace(/href="(?:\.\.\/)?css\//g,'href="/css/')
    .replace(/[ \t]+$/gm,'');
}

for (const row of services) {
  for (const lang of ['es','en']) {
    const slug = lang === 'en' ? row[2] : row[1];
    const dir = path.join(root, lang === 'en' ? 'en/kitesurf' : 'kitesurf');
    fs.mkdirSync(dir,{recursive:true});
    fs.writeFileSync(path.join(dir,slug+'.html'),render(lang,row));
  }
}

for (const [lang,file] of [['es','kitesurf.html'],['en','en/kitesurf.html']]) {
  const $ = cheerio.load(fs.readFileSync(path.join(root,file),'utf8'));
  for (const row of services) {
    const id=row[0],slug=lang==='en'?row[2]:row[1];
    const card=$(`[onclick*="addToCart('${id}'"]`).first().closest('[data-category]');
    if(!card.length) continue;
    const href=`/${lang==='en'?'en/':''}kitesurf/${slug}`;
    const h3=card.find('h3').first();
    if(!h3.find('a').length) h3.wrapInner(`<a href="${href}" class="kite-card-title-link"></a>`);
    if(!card.find('.kite-details-link').length) card.find('[onclick*="addToCart"]').first().before(`<a class="kite-details-link" href="${href}">${lang==='en'?'View details':'Ver detalles'}</a>`);
  }
  fs.writeFileSync(path.join(root,file),$.html().replace(/[ \t]+$/gm,''));
}

console.log(`Generated ${services.length * 2} kitesurf service pages and linked the catalogs.`);
