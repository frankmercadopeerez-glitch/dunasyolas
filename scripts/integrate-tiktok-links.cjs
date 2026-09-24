const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');

const items = [
  {
    es: 'blog/requisitos-viajar-colombia-2026/index.html',
    en: 'en/blog/requisitos-viajar-colombia-2026/index.html',
    esHeading: 'Pasaporte: vigencia y requisitos', enHeading: 'Passport: validity and requirements',
    esText: '¿Viajas desde México? Nohemi explica en este video los requisitos para entrar a Colombia. Confirma siempre las condiciones vigentes para tu nacionalidad antes de volar.',
    enText: 'Traveling from Mexico? Nohemi explains Colombia’s entry requirements in this video. Always confirm the current rules for your nationality before flying.',
    url: 'https://www.tiktok.com/@mexicanaencartagena/video/7679655044018375937',
  },
  {
    es: 'blog/tour-o-pasadia/index.html', en: 'en/blog/tour-o-pasadia/index.html',
    esHeading: '¿Qué es un pasadía?', enHeading: 'What is a day trip?',
    esText: 'Nohemi también explica en TikTok la diferencia entre un tour y un pasadía, para elegir el plan que corresponde a lo que quieres vivir.',
    enText: 'Nohemi also explains the difference between a tour and a day trip in this TikTok video, helping you choose the right kind of experience.',
    url: 'https://www.tiktok.com/@mexicanaencartagena/video/7676913847856352529',
  },
  {
    es: 'blog/identificar-lancha-pirata/index.html', en: 'en/blog/identificar-lancha-pirata/index.html',
    esHeading: 'Los documentos que debe tener un operador legal', enHeading: 'The documents a legal operator must have',
    esText: 'Antes de abordar, revisa también este video de Nohemi con puntos de seguridad que conviene confirmar en una lancha hacia las islas.',
    enText: 'Before boarding, watch Nohemi’s video on safety details to check before taking a boat to the islands.',
    url: 'https://www.tiktok.com/@mexicanaencartagena/video/7680420510349495553',
  },
  {
    es: 'blog/temporada-lluvias-cartagena-tours/index.html', en: 'en/blog/temporada-lluvias-cartagena-tours/index.html',
    esHeading: 'Lluvia no es lo mismo que mala mar', enHeading: 'What to know',
    esText: 'Para entender cómo afecta la lluvia a tus planes, mira también la explicación breve de Nohemi en TikTok.',
    enText: 'For a quick explanation of how rain can affect your plans, see Nohemi’s TikTok video.',
    url: 'https://www.tiktok.com/@mexicanaencartagena/video/7678513488741928193',
  },
  {
    es: 'blog/donde-alojarse-en-cartagena/index.html', en: 'en/blog/donde-alojarse-en-cartagena/index.html',
    esHeading: 'Otras zonas a considerar: Manga, Castillogrande y La Boquilla', enHeading: 'Other areas worth considering: Manga, Castillogrande and La Boquilla',
    esText: '¿Estás entre Bocagrande y Getsemaní? Nohemi compara ambas zonas en este video antes de que elijas dónde alojarte.',
    enText: 'Choosing between Bocagrande and Getsemaní? Nohemi compares both areas in this video to help you decide where to stay.',
    url: 'https://www.tiktok.com/@mexicanaencartagena/video/7680071609884888321',
  },
  {
    es: 'blog/cambio-de-moneda-cartagena/index.html', en: 'en/blog/cambio-de-moneda-cartagena/index.html',
    esHeading: '¿Aceptan dólares o euros en Cartagena?', enHeading: 'Do they accept dollars or euros in Cartagena?',
    esText: 'Si viajas desde México, mira también el tip de Nohemi para calcular rápidamente la conversión entre pesos mexicanos y colombianos.',
    enText: 'If you are traveling from Mexico, see Nohemi’s tip for quickly estimating the exchange between Mexican and Colombian pesos.',
    url: 'https://www.tiktok.com/@mexicanaencartagena/video/7687797480439778561',
  },
  {
    es: 'blog/plan-finde-islas-rosario/index.html', en: 'en/blog/plan-finde-islas-rosario/index.html',
    esHeading: 'Presupuesto estimado: ¿cuánto cuesta el fin de semana?', enHeading: 'What to know',
    esText: 'Nohemi explica en este video qué es el impuesto de muelle, por qué se cobra y cuándo debes pagarlo.',
    enText: 'In this video, Nohemi explains the dock tax, why it is charged and when you may need to pay it.',
    url: 'https://www.tiktok.com/@mexicanaencartagena/video/7682584428664589585',
  },
  {
    es: 'blog/mejores-islas-rosario/index.html', en: 'en/blog/mejores-islas-rosario/index.html',
    esHeading: 'Playa Blanca (Barú): la más famosa de Colombia', enHeading: "Playa Blanca (Barú): Colombia's most famous beach",
    esText: '¿Dudas entre Barú y las Islas del Rosario? Nohemi explica en este video la diferencia entre ambos destinos antes de que elijas tu plan.',
    enText: 'Choosing between Barú and the Rosario Islands? Nohemi explains how these destinations differ in this video before you book.',
    url: 'https://www.tiktok.com/@mexicanaencartagena/video/7678900680773455121',
  },
  {
    es: 'blog/donde-alojarse-en-cartagena/index.html', en: 'en/blog/donde-alojarse-en-cartagena/index.html',
    esHeading: 'Nuestra recomendación según tu tipo de viaje', enHeading: 'Our recommendation based on your trip',
    esText: 'Antes de reservar hospedaje, comprueba que el alojamiento y su oferta sean auténticos. Nohemi comparte señales que conviene revisar en este video.',
    enText: 'Before booking accommodation, check that the property and listing are genuine. Nohemi shares what to look for in this video.',
    url: 'https://www.tiktok.com/@mexicanaencartagena/video/7684363649535806737',
  },
  {
    es: 'blog/donde-alojarse-en-cartagena/index.html', en: 'en/blog/donde-alojarse-en-cartagena/index.html',
    esHeading: 'Preguntas frecuentes', enHeading: 'Frequently asked questions',
    esText: 'Si ya encontraste alojamiento, ten presente que el precio puede cambiar: Nohemi explica por qué conviene confirmar y reservar la tarifa cotizada en este video.',
    enText: 'If you have found accommodation, remember that prices can change. Nohemi explains why you should confirm and book the quoted rate in this video.',
    url: 'https://www.tiktok.com/@mexicanaencartagena/video/7681050702054952209',
  },
  {
    es: 'blog/mejor-epoca-para-visitar-cartagena/index.html', en: 'en/blog/mejor-epoca-para-visitar-cartagena/index.html',
    esHeading: 'Temporada alta vs. temporada baja: precios y multitudes', enHeading: 'High season vs. low season: prices and crowds',
    esText: 'Cartagena se llena en vacaciones: mira este aviso de Nohemi y confirma disponibilidad con tiempo si ya tienes fechas.',
    enText: 'Cartagena gets busy during holiday periods. See Nohemi’s reminder and confirm availability early if you already have dates.',
    url: 'https://www.tiktok.com/@mexicanaencartagena/video/7678114373654646033',
  },
];

function add(file, headingText, copy) {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) throw new Error(`Missing article: ${file}`);
  const $ = cheerio.load(fs.readFileSync(fullPath, 'utf8'));
  if ($(`.tiktok-guide-link a[href="${items.find(item => item.es === file || item.en === file).url}"]`).length) return;
  const heading = $('h2,h3').filter((_, element) => $(element).text().trim() === headingText).first();
  if (!heading.length) throw new Error(`Section heading not found in ${file}: ${headingText}`);
  const after = heading.nextUntil('h2,h3').filter('p').first();
  if (!after.length) throw new Error(`Paragraph not found below ${headingText} in ${file}`);
  const linkText = file.startsWith('en/') ? 'Watch Nohemi’s video on TikTok ↗' : 'Ver el video de Nohemi en TikTok ↗';
  after.after(`<p class="tiktok-guide-link">${copy} <a href="${items.find(item => item.es === file || item.en === file).url}" target="_blank" rel="noopener noreferrer">${linkText}</a></p>`);
  if (!$('style#tiktok-guide-link-style').length) $('head').append('<style id="tiktok-guide-link-style">.tiktok-guide-link{border-left:4px solid #0b7f87;background:#f1f5f4;padding:13px 16px;border-radius:3px;line-height:1.6;margin:18px 0;color:#183140}.tiktok-guide-link a{display:inline-block;color:#075f68;font-weight:700;text-decoration:underline;text-underline-offset:3px;margin-left:4px}.tiktok-guide-link a:focus-visible{outline:3px solid #e3ad20;outline-offset:3px}</style>');
  fs.writeFileSync(fullPath, $.html().replace(/[ \t]+$/gm, ''));
}

for (const item of items) {
  add(item.es, item.esHeading, item.esText);
  add(item.en, item.enHeading, item.enText);
}

function addQuickAnswerLink(file, question, url, sentence) {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) throw new Error(`Missing quick-answer page: ${file}`);
  const $ = cheerio.load(fs.readFileSync(fullPath, 'utf8'));
  const details = $('details').filter((_, element) => $(element).find('summary').text().trim() === question).first();
  if (!details.length) throw new Error(`Quick answer not found in ${file}: ${question}`);
  if (details.find(`a[href="${url}"]`).length) return;
  const answer = details.find('p').first();
  if (!answer.length) throw new Error(`Quick answer paragraph not found in ${file}: ${question}`);
  answer.append(` ${sentence} <a href="${url}" target="_blank" rel="noopener noreferrer">${file.startsWith('en/') ? 'Watch Nohemi’s TikTok video ↗' : 'Ver el video de Nohemi en TikTok ↗'}</a>`);
  const graph = $('script[type="application/ld+json"]').toArray();
  for (const script of graph) {
    let data;
    try { data = JSON.parse($(script).text()); } catch { continue; }
    const visit = node => {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) return node.forEach(visit);
      if (node['@type'] === 'Question' && node.name === question && node.acceptedAnswer?.text) {
        const schemaSentence = sentence.replace(/<[^>]+>/g, '').trim();
        if (!node.acceptedAnswer.text.includes(schemaSentence)) node.acceptedAnswer.text += ` ${schemaSentence}`;
      }
      Object.values(node).forEach(visit);
    };
    visit(data);
    $(script).text(JSON.stringify(data));
  }
  fs.writeFileSync(fullPath, $.html().replace(/[ \t]+$/gm, ''));
}

const quickAnswers = [
  ['index.html', '¿Qué documentos necesito para viajar a Colombia en 2026?', 'https://www.tiktok.com/@mexicanaencartagena/video/7679655044018375937', 'Nohemi explica los requisitos para viajeros mexicanos en este video; confirma siempre las reglas oficiales para tu nacionalidad.'],
  ['index.html', '¿Cómo identifico una lancha pirata antes de subir?', 'https://www.tiktok.com/@mexicanaencartagena/video/7680420510349495553', 'Nohemi explica qué revisar antes de contratar una embarcación en este video.'],
  ['index.html', '¿Dónde cambiar dólares o pesos mexicanos en Cartagena?', 'https://www.tiktok.com/@mexicanaencartagena/video/7687797480439778561', 'Nohemi compara qué moneda conviene llevar y qué tener en cuenta al cambiarla en este video.'],
  ['index.html', '¿Dónde alojarse: Bocagrande, Centro o Getsemaní?', 'https://www.tiktok.com/@mexicanaencartagena/video/7680071609884888321', 'Mira también la comparación de Nohemi entre Bocagrande y Getsemaní para elegir según el tipo de viaje.'],
  ['faq.html', '¿Qué debo llevar?', 'https://www.tiktok.com/@mexicanaencartagena/video/7679655044018375937', 'Si viajas desde México, revisa también el video de Nohemi sobre documentos de entrada y verifica los requisitos vigentes para tu nacionalidad.'],
  ['faq.html', '¿Qué pasa si el clima no acompaña el día del tour?', 'https://www.tiktok.com/@mexicanaencartagena/video/7678513488741928193', 'Nohemi explica en este video por qué lluvia y condiciones inseguras del mar no son lo mismo.'],
  ['faq.html', '¿Las embarcaciones cuentan con permisos oficiales?', 'https://www.tiktok.com/@mexicanaencartagena/video/7680420510349495553', 'Antes de abordar, mira también la lista de seguridad que Nohemi explica en este video.'],
  ['faq.html', '¿Los precios están en pesos colombianos o dólares?', 'https://www.tiktok.com/@mexicanaencartagena/video/7677430011502152961', 'Si vienes desde México, Nohemi comparte una regla sencilla para estimar el cambio de pesos en este video.'],
];
for (const [file, question, url, sentence] of quickAnswers) addQuickAnswerLink(file, question, url, sentence);

for (const [file, question, url, sentence] of [
  ['en/index.html', 'What documents do I need to travel to Colombia in 2026?', 'https://www.tiktok.com/@mexicanaencartagena/video/7679655044018375937', 'Nohemi explains entry requirements for Mexican travelers in this video; always confirm official rules for your nationality.'],
  ['en/index.html', 'How do I spot a pirate boat before getting on board?', 'https://www.tiktok.com/@mexicanaencartagena/video/7680420510349495553', 'Nohemi explains what to check before booking a boat in this video.'],
  ['en/index.html', 'Where can I exchange dollars or Mexican pesos in Cartagena?', 'https://www.tiktok.com/@mexicanaencartagena/video/7687797480439778561', 'Nohemi compares which currency to bring and what to consider when exchanging it in this video.'],
  ['en/index.html', 'Where should I stay: Bocagrande, the Old City or Getsemaní?', 'https://www.tiktok.com/@mexicanaencartagena/video/7680071609884888321', 'Also watch Nohemi compare Bocagrande and Getsemaní to help choose the best fit for your trip.'],
  ['en/faq.html', 'What should I bring?', 'https://www.tiktok.com/@mexicanaencartagena/video/7679655044018375937', 'If you are traveling from Mexico, also see Nohemi’s video about entry documents and verify current requirements for your nationality.'],
  ['en/faq.html', "What happens if the weather doesn't cooperate on the day of the tour?", 'https://www.tiktok.com/@mexicanaencartagena/video/7678513488741928193', 'Nohemi explains in this video why rain and unsafe sea conditions are not the same thing.'],
  ['en/faq.html', 'Do the boats have official permits?', 'https://www.tiktok.com/@mexicanaencartagena/video/7680420510349495553', 'Before boarding, also review the safety checks Nohemi explains in this video.'],
  ['en/faq.html', 'Are prices in Colombian pesos or US dollars?', 'https://www.tiktok.com/@mexicanaencartagena/video/7677430011502152961', 'If you are visiting from Mexico, Nohemi shares a simple rule for estimating the exchange in this video.'],
]) addQuickAnswerLink(file, question, url, sentence);

console.log(`Integrated ${items.length} article links and ${quickAnswers.length * 2} quick-answer TikTok links across Spanish and English.`);
