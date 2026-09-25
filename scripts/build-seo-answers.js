const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const root = path.resolve(__dirname, '..');
const catalog = require('../data/catalog.json');
const DATE = '2026-09-25';
const money = (n, locale = 'es-CO') => `$${Number(n).toLocaleString(locale)} COP`;
const esc = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const sources = {
  dimar: 'https://www.dimar.mil.co/',
  migracion: 'https://www.migracioncolombia.gov.co/',
  cartagena: 'https://www.cartagena.gov.co/',
  parques: 'https://www.parquesnacionales.gov.co/',
  ideam: 'https://www.ideam.gov.co/'
};

const es = [
  ['Elegir islas y pasadías', [
    ['¿Qué diferencia hay entre un tour, un pasadía, un beach club y un bote privado?', 'Un tour sigue un recorrido con varias visitas; un pasadía concentra el día en una playa, isla o club; un beach club ofrece instalaciones y servicios en un lugar; y un bote privado permite diseñar la ruta para un solo grupo. Revisa siempre paradas, tiempo en tierra, incluidos y gastos adicionales, porque el nombre comercial por sí solo no los garantiza.', '/blog/tour-o-pasadia/'],
    ['¿Cuánto cuesta ir a las Islas del Rosario desde Cartagena?', 'El total depende de la isla, el transporte y los cobros externos. Compara el precio publicado, tasa portuaria, seguro, entradas y consumos obligatorios. Nuestra página de experiencias muestra el precio vigente de cada plan y especifica los gastos conocidos antes de reservar.', '/islas-del-rosario'],
    ['¿Qué isla conviene para familias con niños?', 'Prioriza navegación moderada, sombra, baños, alimentación clara y zonas de baño controladas. Isla Lizamar y otros pasadías con infraestructura suelen ser más prácticos que recorridos con muchas paradas. Confirma edad, chaleco infantil, oleaje y tiempo total antes de pagar.', '/blog/islas-del-rosario-con-ninos/'],
    ['¿Qué opción conviene para pareja o descanso?', 'Busca un pasadía con menos paradas, cupo controlado y tiempo suficiente en playa. Los clubes de Tierra Bomba reducen la navegación; algunas opciones de Rosario, Barú, Múcura o Tintipán ofrecen un entorno más insular, pero implican trayectos más largos.', '/blog/mejores-islas-rosario/'],
    ['¿Barú por tierra o por lancha?', 'Por tierra evita la navegación larga y suele facilitar el regreso; por lancha ofrece paisaje marítimo y puede ahorrar tráfico, pero depende del estado del mar. Elige según tolerancia al oleaje, edad del grupo, horario y punto de salida.', '/blog/mejores-islas-rosario/'],
    ['¿Cómo llegar a Tierra Bomba?', 'La forma habitual es en lancha desde un muelle confirmado por el operador. El trayecto es corto frente a otros destinos insulares, pero el punto exacto, horario, equipaje permitido y regreso cambian según el beach club.', '/experiences'],
    ['¿Vale la pena Playa Blanca?', 'Playa Blanca tiene agua clara y una oferta amplia, pero puede ser concurrida. Funciona mejor cuando reservas transporte, zona de playa, alimentación y precio con anticipación. Si buscas más tranquilidad, compara clubes con cupo controlado o destinos con acceso limitado.', '/playa-blanca-baru'],
    ['¿Qué significa que una parada sea panorámica?', 'Significa que la embarcación pasa frente al lugar o hace una explicación sin desembarcar. Pide por escrito dónde bajarás, cuánto tiempo estarás en cada sitio y cuáles paradas son únicamente de observación.', '/islas-del-rosario'],
    ['¿El Oceanario está incluido?', 'Solo está incluido cuando la experiencia lo dice de forma expresa. En otros planes la entrada se compra aparte o el itinerario no permite visitarlo. Confirma entrada, transporte y tiempo disponible en la opción elegida.', '/islas-oceanario'],
    ['¿Qué debo llevar a un pasadía?', 'Lleva ropa de baño, toalla, protección solar, sombrero, agua, bolsa impermeable, una muda seca, medicamento personal y efectivo moderado. Guarda documentos y teléfono protegidos del agua y pregunta si el lugar entrega toallas.', '/blog/islas-del-rosario-con-ninos/']
  ]],
  ['Mar, clima y seguridad', [
    ['¿Se cancela un tour si llueve?', 'No necesariamente. Una lluvia breve puede coincidir con condiciones seguras, mientras que el viento o el oleaje pueden impedir la salida aun con cielo despejado. La decisión depende de la autoridad marítima y del operador responsable.', '/blog/temporada-lluvias-cartagena-tours/'],
    ['¿Qué pasa si DIMAR restringe la navegación?', 'Si la autoridad marítima restringe el zarpe, no se debe navegar. Contacta al operador para aplicar las condiciones informadas de reprogramación o devolución. No aceptes salidas improvisadas desde puntos no confirmados.', '/blog/zarpar-seguro-islas-cartagena/'],
    ['¿Cuándo está más movido el mar?', 'Los vientos suelen aumentar durante parte de la temporada seca, pero el estado del mar cambia por día y zona. Consulta el pronóstico meteomarino y la confirmación del operador, no solo una aplicación de lluvia.', '/blog/mareo-lancha-cartagena/'],
    ['¿Cómo evitar el mareo en una lancha?', 'Descansa, come ligero, evita alcohol, mira el horizonte y ubícate donde la tripulación indique que hay menos movimiento. Si usas medicamento para mareo, consulta antes a un profesional y sigue sus indicaciones.', '/blog/mareo-lancha-cartagena/'],
    ['¿Es seguro ir en lancha con niños?', 'Puede serlo en una embarcación autorizada, con chaleco adecuado para su talla y condiciones de mar favorables. Confirma edad mínima, duración, sombra y plan de emergencia. Nunca sustituyas un chaleco infantil por uno de adulto.', '/blog/islas-del-rosario-con-ninos/'],
    ['¿Pueden viajar mujeres embarazadas?', 'La navegación rápida y el impacto de las olas pueden no ser apropiados durante el embarazo. Consulta al profesional de salud y comunica la situación al operador antes de reservar; una salida corta por tierra o a Tierra Bomba puede ser más conveniente.', '/blog/islas-del-rosario-con-ninos/'],
    ['¿Cómo reconocer una lancha segura?', 'Comprueba operador identificable, muelle confirmado, capacidad autorizada, tripulación, chaleco para cada pasajero y explicación de seguridad. Desconfía de pagos sin comprobante, sobrecupo o promesas de navegar pese a una restricción.', '/blog/requisitos-lancha-segura-islas-cartagena/'],
    ['¿Dónde se consulta el estado oficial de navegación?', `La <a href="${sources.dimar}" rel="noopener">Dirección General Marítima (DIMAR)</a> y la Capitanía de Puerto publican avisos y restricciones. La confirmación final debe darla el operador para tu salida y muelle concretos.`, '/blog/temporada-lluvias-cartagena-tours/'],
    ['¿Hay sargazo en Cartagena?', 'La presencia de material vegetal puede variar por playa, corriente y día. No debe confundirse automáticamente con contaminación. Pregunta al operador por el estado reciente del destino y revisa reportes locales antes de salir.', '/blog/playas-cartagena/'],
    ['¿Qué hago si un vendedor cambia el precio?', 'No consumas ni aceptes un servicio sin preguntar antes el precio total. Conserva evidencias, evita confrontaciones y usa los canales oficiales de atención al turista o Policía si existe abuso. Una agencia formal debe explicar los cobros antes de reservar.', '/blog/derechos-turista-cobros-excesivos-cartagena/']
  ]],
  ['Botes privados', [
    ['¿Cuánto cuesta alquilar un bote privado en Cartagena?', 'El precio depende de capacidad, tipo de embarcación, fecha, duración y ruta. La cotización debe indicar si incluye capitán, marinero, combustible, hielo y tasas. Compara el total del grupo, no solo un precio inicial.', '/renta-de-botes'],
    ['¿El precio es por persona o por bote?', 'En alquiler privado suele cotizarse la embarcación para un máximo de pasajeros; en paseos compartidos se cobra por persona. La ficha y la cotización deben decirlo expresamente.', '/renta-de-botes'],
    ['¿Qué debe incluir una cotización de bote?', 'Debe identificar embarcación, capacidad, horas, ruta, tripulación, combustible, punto de salida, incluidos, extras, anticipo y política por clima. Pide todo por escrito antes de transferir dinero.', '/renta-de-botes'],
    ['¿Lancha, yate o catamarán?', 'Una lancha deportiva es rápida y práctica para recorrer islas; un yate ofrece más espacio y comodidad; un catamarán prioriza estabilidad y áreas sociales. La mejor opción depende de grupo, ruta, presupuesto y tolerancia al mar.', '/renta-de-botes'],
    ['¿Podemos elegir la ruta?', 'En un alquiler privado normalmente se puede proponer una ruta, pero el capitán la ajusta a horarios, combustible, permisos y condiciones marítimas. Confirma las paradas reales y el tiempo disponible.', '/renta-de-botes'],
    ['¿Se puede llevar comida y alcohol?', 'Depende de la embarcación y del operador. Confirma nevera, hielo, cristalería, restricciones y política de limpieza. El capitán puede limitar el consumo cuando comprometa la seguridad.', '/renta-de-botes'],
    ['¿Se puede alquilar al atardecer o de noche?', 'Sí existen paseos de bahía y opciones privadas en esas franjas. La navegación nocturna y la ruta dependen de la embarcación autorizada, el horario contratado y las condiciones de la bahía.', '/catamaran-atardecer'],
    ['¿Cómo reservar un bote sin caer en una oferta falsa?', 'Verifica sitio, teléfono, RNT de la agencia, datos del operador, comprobante y condiciones. Evita transferir a una cuenta inesperada o seguir enlaces que no provengan de los canales confirmados.', '/blog/como-verificar-agencia-rnt-cartagena/']
  ]],
  ['Planear el viaje', [
    ['¿Cartagena es segura para turistas?', 'Cartagena recibe turismo internacional todo el año, pero requiere precauciones urbanas normales: transporte formal, objetos discretos, precios acordados y atención especial en zonas concurridas o de noche. El riesgo cambia según sector, hora y conducta.', '/blog/seguridad-cartagena/'],
    ['¿Es seguro caminar de noche?', 'En zonas turísticas iluminadas hay movimiento, pero evita calles solas, exhibir el teléfono y caminar largas distancias si no conoces el sector. Regresa en transporte formal y comparte tu ubicación.', '/blog/seguridad-cartagena/'],
    ['¿Dónde alojarse por primera vez?', 'Centro Histórico y Getsemaní facilitan recorridos a pie; Bocagrande ofrece edificios, servicios y playa urbana; Manga es más residencial; La Boquilla acerca a playa y deportes de viento. Elige por plan diario, presupuesto y traslado al muelle.', '/blog/donde-alojarse-en-cartagena/'],
    ['¿Cuál es la mejor época para visitar Cartagena?', 'La temporada más seca suele concentrarse entre diciembre y abril; entre mayo y noviembre aumenta la frecuencia de lluvia. La mejor fecha depende de precios, eventos, viento y tolerancia al calor, no solo de la lluvia.', '/blog/mejor-epoca-para-visitar-cartagena/'],
    ['¿Cómo es Cartagena en noviembre?', 'Noviembre combina calor, posibles lluvias y las Fiestas de Independencia. Reserva con anticipación, deja margen para cierres y lleva protección impermeable sin asumir que lloverá todo el día.', '/blog/cartagena-noviembre-clima-que-llevar/'],
    ['¿Qué ropa llevar?', 'Usa ropa fresca, calzado cómodo, sombrero y una capa ligera para aire acondicionado o lluvia. Para islas añade traje de baño, muda seca y calzado que no resbale.', '/blog/cartagena-noviembre-clima-que-llevar/'],
    ['¿Cartagena es cara?', 'El presupuesto cambia mucho entre alojamiento, restaurantes, transporte y mar. Los mayores extras inesperados suelen ser tasas, entradas, consumos en playa y traslados; pide precios totales antes de aceptar.', '/blog/costo-viaje-cartagena/'],
    ['¿Qué moneda llevar?', 'La moneda de pago es el peso colombiano. Lleva una cantidad moderada de COP y una tarjeta de respaldo; evita cambiar grandes sumas en lugares informales y confirma la tasa antes de entregar dinero.', '/blog/cambio-de-moneda-cartagena/'],
    ['¿Aceptan dólares?', 'Algunos negocios turísticos los reciben, pero la tasa puede ser desfavorable. Para gastos cotidianos conviene pagar en pesos colombianos o con un medio cuya comisión conozcas.', '/blog/cambio-de-moneda-cartagena/'],
    ['¿Cómo ir del aeropuerto al hotel?', 'Usa el punto autorizado, confirma la tarifa por zona antes de subir y entrega la dirección completa. El tiempo cambia por tráfico y ubicación; Centro, Getsemaní, Bocagrande, Manga y La Boquilla tienen recorridos distintos.', '/blog/como-llegar-aeropuerto-cartagena/'],
    ['¿Funciona Uber en Cartagena?', 'Las aplicaciones pueden mostrar disponibilidad, pero las reglas y puntos de recogida cambian. Compara la opción visible con taxi autorizado o traslado reservado y nunca abordes un vehículo cuyos datos no coincidan.', '/blog/transporte-cartagena/'],
    ['¿Qué hacer en tres días?', 'Combina un día de Centro y Getsemaní, un día de mar bien elegido y un tercer día según tu perfil: cultura, gastronomía, deporte o descanso. No concentres una llegada de aeropuerto y una salida de lancha sin margen.', '/blog/itinerario-3-dias-cartagena/'],
    ['¿Qué hacer con niños?', 'Alterna actividades cortas, sombra, descansos e hidratación. Prioriza playas con infraestructura, confirma chalecos y edades, y evita itinerarios con demasiados traslados en un solo día.', '/blog/cartagena-con-ninos/'],
    ['¿Qué hacer si llego en crucero?', 'Elige una ruta compatible con la hora límite de regreso al barco. Para una escala corta, Centro Histórico, Getsemaní y Castillo son más controlables que un pasadía insular largo.', '/blog/cartagena-en-un-dia-crucero/'],
    ['¿Cartagena o Cancún?', 'Cartagena destaca por historia, cultura urbana y acceso a islas; Cancún concentra grandes resorts y playas hoteleras. Compara vuelos, alojamiento, mar, vida nocturna y el tipo de experiencia que buscas.', '/blog/cartagena-vs-cancun/']
  ]],
  ['Actividades', [
    ['¿Cuál es la temporada de kitesurf en Cartagena?', 'Los vientos más constantes suelen presentarse en la temporada seca. Las condiciones cambian por día y nivel; la escuela confirma viento, horario y equipo antes de cada clase.', '/kitesurf'],
    ['¿Kitesurf, kitefoil o wingfoil?', 'El kitesurf usa una cometa y tabla; el kitefoil añade un hidroala que eleva la tabla; el wingfoil usa un ala sostenida con las manos y tabla con foil. La curva de aprendizaje y las condiciones adecuadas son diferentes.', '/blog/wing-foil-vs-kitesurf-cartagena/'],
    ['¿Puedo aprender kitesurf sin experiencia?', 'Sí. Una clase inicial empieza con seguridad, viento y control de cometa antes de navegar. No debes alquilar equipo sin supervisión si aún no controlas las maniobras básicas.', '/kitesurf'],
    ['¿Qué pasa si no hay viento?', 'La escuela puede ajustar el horario o reprogramar la parte práctica. Confirma la política de la clase antes de pagar y no fuerces una sesión con condiciones inadecuadas.', '/kitesurf'],
    ['¿Puedo bucear sin certificación?', 'Un bautismo supervisado puede estar diseñado para principiantes, mientras que inmersiones avanzadas exigen certificación y experiencia. Informa condiciones médicas y confirma profundidad, instructor y equipo.', '/buceo-snorkel'],
    ['¿Buceo o snorkel?', 'El snorkel se realiza en superficie con máscara y tubo; el buceo usa equipo autónomo y requiere instrucción. Elige según edad, comodidad en el agua, salud y tipo de arrecife.', '/buceo-snorkel'],
    ['¿Cuándo se ve mejor el plancton bioluminescente?', 'La intensidad varía con oscuridad, luna, agua y actividad natural; no puede garantizarse como una iluminación constante. Confirma horario, traslado nocturno y expectativas reales antes de reservar.', '/family-eco-route'],
    ['¿Se puede fotografiar el plancton con celular?', 'Los teléfonos suelen captar menos brillo que el ojo humano y pueden necesitar modo nocturno, estabilidad y poca luz alrededor. No interpretes una foto promocional como garantía de lo que verá la cámara.', '/family-eco-route'],
    ['¿Qué restricciones tiene el paratrike?', 'El plan publicado admite hasta 100 kg por persona y depende del clima. Confirma edad, salud, duración real, video y transporte para tu fecha.', '/paratrike-cartagena'],
    ['¿Necesito experiencia para cuatrimoto o cabalgata?', 'Existen opciones para principiantes, pero debes seguir la inducción y cumplir edad, calzado y condiciones del operador. Confirma si el vehículo o caballo es individual, compartido o guiado.', '/cuatrimotos-atv']
  ]],
  ['Reservas con Dunas & Olas', [
    ['¿Cómo reservo?', 'Envía fecha, número de viajeros, edades de niños, alojamiento y experiencia. El equipo confirma cupo, precio final, incluidos, punto de encuentro y condiciones antes del pago.', '/faq'],
    ['¿Un mensaje de WhatsApp confirma el cupo?', 'No. La reserva queda confirmada cuando el equipo lo indica expresamente y se cumple el anticipo o proceso aplicable. Una consulta inicial no bloquea disponibilidad.', '/faq'],
    ['¿En qué idiomas atienden?', 'Dunas & Olas puede atender por escrito en español, inglés, francés y alemán. En actividades puede haber atención en francés e inglés; confirma el idioma operativo requerido para tu fecha.', '/faq'],
    ['¿Cómo verifico la agencia?', 'Comprueba el dominio, teléfono oficial y Registro Nacional de Turismo. No envíes dinero si el destinatario o las condiciones cambian sin explicación desde el canal confirmado.', '/blog/como-verificar-agencia-rnt-cartagena/'],
    ['¿Cómo funcionan cambios y cancelaciones?', 'Dependen del producto y del proveedor. Antes de pagar recibirás la condición aplicable; revisa plazos, no-show, clima, reprogramación y tiempos de devolución.', '/policies']
  ]]
];

const international = {
  en: {
    title: 'Cartagena travel questions: clear answers before you book',
    description: 'Practical answers about safety, island trips, prices, weather, transport, private boats and activities in Cartagena, Colombia.',
    home: 'Home', label: 'Travel answers', updated: 'Last locally reviewed', contact: 'Ask Dunas & Olas',
    categories: [
      ['Safety and planning', [
        ['Is Cartagena safe for tourists?', 'Cartagena welcomes international visitors year-round, but travelers should use formal transport, agree on prices, keep valuables discreet and avoid isolated streets at night. Risk changes by area, time and behavior.', '/en/blog/seguridad-cartagena/'],
        ['Where should I stay for a first visit?', 'The Walled City and Getsemaní are convenient for walking; Bocagrande has urban services and a city beach; Manga is more residential; La Boquilla is closer to beach and wind sports.', '/en/blog/donde-alojarse-en-cartagena/'],
        ['What is the best time to visit Cartagena?', 'December through April is generally drier, while rain is more frequent from May through November. Prices, events, wind and sea conditions also matter.', '/en/blog/mejor-epoca-para-visitar-cartagena/'],
        ['What currency should I bring?', 'Use Colombian pesos for local spending and keep a card as backup. Confirm the exchange rate and card fees before paying; accepting US dollars does not guarantee a favorable rate.', '/en/blog/cambio-de-moneda-cartagena/'],
        ['Is the airport taxi safe?', 'Use the authorized pickup point, confirm the zone fare before boarding and provide the complete hotel address. Reserved transfers are useful for groups or late arrivals.', '/en/blog/como-llegar-aeropuerto-cartagena/'],
        ['What should I pack?', 'Pack breathable clothes, sun protection, comfortable shoes, swimwear, a dry change and a waterproof pouch. Add any personal medication and avoid carrying original documents on beach days.', '/en/blog/cartagena-noviembre-clima-que-llevar/']
      ]],
      ['Islands and beaches', [
        ['How much is a Rosario Islands day trip?', 'The total varies by island and transport. Add the published price, pier tax, navigation insurance, admissions and any mandatory consumption. Compare the final total, not only the headline price.', '/en/islas-del-rosario'],
        ['What is the difference between a tour and a day trip?', 'A tour follows an itinerary; a day trip focuses on time at an island, beach or beach club. Ask where you actually disembark, how long each stop lasts and what is paid separately.', '/en/blog/tour-o-pasadia/'],
        ['Is a boat trip suitable for children?', 'It can be when the vessel is authorized, the child has a correctly sized life jacket and sea conditions are suitable. Confirm age rules, shade, duration and emergency arrangements.', '/en/blog/islas-del-rosario-con-ninos/'],
        ['What happens if it rains?', 'Rain alone does not always cancel a trip. Wind, waves, visibility and maritime authority restrictions determine whether navigation is safe.', '/en/blog/temporada-lluvias-cartagena-tours/'],
        ['How can I reduce seasickness?', 'Rest, eat lightly, avoid alcohol, look toward the horizon and follow the crew’s seating advice. Ask a health professional before using motion-sickness medicine.', '/en/blog/mareo-lancha-cartagena/'],
        ['Is Playa Blanca worth visiting?', 'It offers clear water and many services but can be busy. Reserve transport, beach area, meals and total price beforehand, or compare a controlled-capacity beach club for a calmer day.', '/en/playa-blanca-baru']
      ]],
      ['Private boats and activities', [
        ['How much is a private boat in Cartagena?', 'Price depends on vessel, capacity, date, duration and route. A complete quote should identify crew, fuel, hours, departure point, included services, extras and weather policy.', '/en/private-boats'],
        ['Boat, yacht or catamaran?', 'A speedboat is efficient for island hopping, a yacht prioritizes space and comfort, and a catamaran offers stability and social areas. Choose for your group and route.', '/en/private-boats'],
        ['When is kitesurf season?', 'The most consistent winds are usually associated with the dry season, but the school must confirm conditions for each lesson and rider level.', '/en/kitesurf'],
        ['Can beginners scuba dive?', 'A supervised discovery dive may be designed for beginners. Advanced dives require certification. Disclose medical conditions and confirm depth, instructor and equipment.', '/en/buceo-snorkel'],
        ['Can bioluminescent plankton be guaranteed?', 'No. Brightness varies with darkness, moonlight, water and natural activity. Confirm the evening return and treat photographs as references, not a guarantee.', '/en/family-eco-route'],
        ['How do I confirm a booking?', 'Send the date, group size, children’s ages, accommodation and chosen activity. A place is confirmed only after Dunas & Olas states it and the applicable deposit process is completed.', '/en/faq']
      ]]
    ]
  },
  fr: {
    title: 'Questions de voyage sur Carthagène : réponses avant de réserver',
    description: 'Sécurité, îles du Rosaire, prix, météo, bateaux privés et organisation d’un séjour à Carthagène.',
    home: 'Accueil', label: 'Conseils pratiques', updated: 'Vérifié localement le', contact: 'Écrire à Dunas & Olas',
    categories: [['Préparer le voyage', [
      ['Carthagène est-elle sûre pour les touristes ?', 'Utilisez des transports formels, convenez du prix avant un service, gardez vos objets de valeur discrets et évitez les rues isolées la nuit. Le niveau de risque varie selon le quartier et l’heure.', '/fr/blog/reserver-excursion-carthagene.html'],
      ['Quelle est la meilleure période ?', 'De décembre à avril le temps est généralement plus sec. De mai à novembre, les pluies sont plus fréquentes, mais la météo, le vent et la mer changent chaque jour.', '/fr/blog/carthagene-en-trois-jours.html'],
      ['Où dormir pour un premier séjour ?', 'Le Centre historique et Getsemaní facilitent les visites à pied; Bocagrande offre davantage de services; La Boquilla rapproche de la plage et des sports de vent.', '/fr/hebergements-carthagene'],
      ['Combien coûte une excursion aux îles du Rosaire ?', 'Additionnez le prix affiché, la taxe portuaire, l’assurance de navigation, les entrées et les consommations obligatoires. Comparez toujours le prix total.', '/fr/iles-du-rosaire'],
      ['Une sortie en bateau convient-elle aux enfants ?', 'Oui si le bateau est autorisé, si le gilet correspond à la taille de l’enfant et si la mer est adaptée. Confirmez l’âge, la durée, l’ombre et les conditions de retour.', '/fr/iles-du-rosaire'],
      ['Comment louer un bateau privé ?', 'Demandez un devis indiquant bateau, capacité, équipage, carburant, durée, itinéraire, extras, acompte et politique météo.', '/fr/location-bateau'],
      ['Peut-on être conseillé en français ?', 'Dunas & Olas répond par écrit en français. Une assistance en français peut être disponible pendant certaines activités; confirmez-la pour votre date.', '/fr/reserver']
    ]]]
  },
  de: {
    title: 'Cartagena Reisefragen: klare Antworten vor der Buchung',
    description: 'Sicherheit, Rosario-Inseln, Preise, Wetter, private Boote und Reiseplanung für Cartagena in Kolumbien.',
    home: 'Startseite', label: 'Reiseantworten', updated: 'Lokal geprüft am', contact: 'Dunas & Olas fragen',
    categories: [['Reise planen', [
      ['Ist Cartagena für Touristen sicher?', 'Nutzen Sie offizielle Transportmittel, vereinbaren Sie Preise vorher, tragen Sie Wertsachen unauffällig und meiden Sie nachts leere Straßen. Das Risiko hängt von Ort, Zeit und Verhalten ab.', '/de/blog/ausflug-cartagena-buchen.html'],
      ['Wann ist die beste Reisezeit?', 'Von Dezember bis April ist es meist trockener. Zwischen Mai und November regnet es häufiger; Wind und Seegang müssen trotzdem täglich geprüft werden.', '/de/blog/cartagena-in-drei-tagen.html'],
      ['Wo sollte man übernachten?', 'Altstadt und Getsemaní eignen sich für Wege zu Fuß, Bocagrande bietet viele Dienstleistungen und La Boquilla liegt näher an Strand und Windsport.', '/de/unterkuenfte-cartagena'],
      ['Was kostet ein Ausflug zu den Rosario-Inseln?', 'Addieren Sie veröffentlichten Preis, Hafengebühr, Navigationsversicherung, Eintritt und verpflichtenden Konsum. Vergleichen Sie den Gesamtpreis.', '/de/rosario-inseln'],
      ['Ist eine Bootsfahrt für Kinder geeignet?', 'Ja, wenn das Boot zugelassen ist, eine passende Kinderrettungsweste vorhanden ist und der Seegang passt. Alter, Dauer und Rückfahrt vorher bestätigen.', '/de/rosario-inseln'],
      ['Wie mietet man ein privates Boot?', 'Der Kostenvoranschlag sollte Boot, Kapazität, Crew, Treibstoff, Dauer, Route, Extras, Anzahlung und Wetterregel enthalten.', '/de/bootsmiete'],
      ['Welche Ausflüge passen für Kreuzfahrtgäste?', 'Wählen Sie einen Ausflug mit sicherem Zeitpuffer vor der Abfahrt des Schiffes. Altstadt und Getsemaní sind bei kurzen Aufenthalten einfacher als ein langer Inselausflug.', '/de/blog/cartagena-in-drei-tagen.html'],
      ['Gibt es Beratung auf Deutsch?', 'Dunas & Olas berät schriftlich auf Deutsch. Eine deutschsprachige Reiseleitung wird nicht zugesagt; bestätigen Sie die Sprache der Aktivität vor der Buchung.', '/de/anfrage']
    ]]]
  }
};

function navbar(lang) {
  const map = {
    es: ['/','Inicio','/experiences','Experiencias','/renta-de-botes','Botes','/blog/','Blog','/faq','FAQ'],
    en: ['/en/','Home','/en/experiences','Experiences','/en/private-boats','Private boats','/en/blog/','Blog','/en/faq','FAQ'],
    fr: ['/fr/','Accueil','/fr/excursions','Excursions','/fr/location-bateau','Bateaux','/fr/blog/','Blog','/fr/reserver','Réserver'],
    de: ['/de/','Startseite','/de/ausfluege','Ausflüge','/de/bootsmiete','Boote','/de/blog/','Blog','/de/anfrage','Anfrage']
  }[lang];
  let links = '';
  for (let i = 0; i < map.length; i += 2) links += `<a href="${map[i]}">${map[i+1]}</a>`;
  return `<nav class="answer-nav"><a class="answer-brand" href="${map[0]}"><img src="/images/logo-master.webp" width="78" height="52" alt="Dunas &amp; Olas" loading="eager" decoding="async"><span>Dunas <b>&amp; Olas</b></span></a><div>${links}</div></nav>`;
}

function languageLinks() {
  return `<nav class="answer-languages" aria-label="Language"><a href="/preguntas-viaje-cartagena" hreflang="es">ES</a><a href="/en/cartagena-travel-questions" hreflang="en">EN</a><a href="/fr/questions-voyage-carthagene" hreflang="fr">FR</a><a href="/de/cartagena-reisefragen" hreflang="de">DE</a></nav>`;
}

function renderGroups(groups) {
  return groups.map(([name, questions], categoryIndex) => `<section class="answer-category" id="tema-${categoryIndex + 1}"><h2>${name}</h2><div class="answer-list">${questions.map(([question, answer, href], index) => `<details${index === 0 ? ' open' : ''}><summary>${question}</summary><div><p>${answer}</p>${href ? `<a class="answer-more" href="${href}">Más información →</a>` : ''}</div></details>`).join('')}</div></section>`).join('');
}

function page({lang, slug, title, description, groups, labels}) {
  const url = `https://dunasyolas.com${lang === 'es' ? '' : `/${lang}`}/${slug}`;
  const schema = { '@context':'https://schema.org', '@type':'WebPage', name:title, description, url, inLanguage:lang === 'es' ? 'es-CO' : lang, dateModified:DATE, author:{'@type':'Person',name:'Nohemi'}, publisher:{'@type':'TravelAgency',name:'Dunas & Olas',url:'https://dunasyolas.com'} };
  return `<!DOCTYPE html><html lang="${lang}" class="brand-refresh-active"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Dunas &amp; Olas</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="es" href="https://dunasyolas.com/preguntas-viaje-cartagena"><link rel="alternate" hreflang="en" href="https://dunasyolas.com/en/cartagena-travel-questions"><link rel="alternate" hreflang="fr" href="https://dunasyolas.com/fr/questions-voyage-carthagene"><link rel="alternate" hreflang="de" href="https://dunasyolas.com/de/cartagena-reisefragen"><link rel="alternate" hreflang="x-default" href="https://dunasyolas.com/preguntas-viaje-cartagena"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:type" content="article"><meta property="og:image" content="https://dunasyolas.com/images/cartagena.webp"><link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="stylesheet" href="/css/brand-refresh.css?v=20260925a"><link rel="stylesheet" href="/css/answer-guide.css?v=20260925a"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head><body>${navbar(lang)}<main class="answer-main">${languageLinks()}<p class="answer-kicker">${labels.label}</p><h1>${title}</h1><p class="answer-intro">${description}</p><p class="answer-reviewed">${labels.updated}: ${DATE}. ${lang === 'es' ? 'Los precios y la disponibilidad se confirman para cada fecha.' : ''}</p><div class="answer-index">${groups.map(([name], i) => `<a href="#tema-${i+1}">${name}</a>`).join('')}</div>${renderGroups(groups)}<aside class="answer-cta"><h2>${labels.contact}</h2><p>${lang === 'es' ? 'Cuéntanos fecha, número de viajeros, edades de los niños y el tipo de plan que buscas. Confirmaremos precio final, incluidos y disponibilidad.' : description}</p><a href="https://wa.me/573163030589">WhatsApp</a></aside><section class="answer-sources"><h2>${lang === 'es' ? 'Fuentes oficiales para datos variables' : 'Official sources for changing information'}</h2><p><a href="${sources.dimar}">DIMAR</a> · <a href="${sources.migracion}">Migración Colombia</a> · <a href="${sources.cartagena}">Alcaldía de Cartagena</a> · <a href="${sources.parques}">Parques Nacionales</a> · <a href="${sources.ideam}">IDEAM</a></p></section></main><footer class="answer-footer">Dunas &amp; Olas · Getsemaní, Cartagena · RNT 292710 · <a href="tel:+573163030589">+57 316 303 0589</a></footer><script src="/js/site-refresh.js?v=20260915f" defer></script></body></html>`;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), {recursive:true});
  fs.writeFileSync(file, content);
}

write(path.join(root, 'preguntas-viaje-cartagena.html'), page({lang:'es',slug:'preguntas-viaje-cartagena',title:'Preguntas frecuentes para viajar y reservar en Cartagena',description:'Respuestas claras sobre Islas del Rosario, pasadías, clima, seguridad, precios, transporte, botes privados, kitesurf y actividades en Cartagena.',groups:es,labels:{label:'Guía local de respuestas',updated:'Verificado localmente el',contact:'¿Quieres una recomendación para tu grupo?'}}));

for (const lang of ['en','fr','de']) {
  const item = international[lang];
  const slug = lang === 'en' ? 'cartagena-travel-questions' : lang === 'fr' ? 'questions-voyage-carthagene' : 'cartagena-reisefragen';
  write(path.join(root, lang, `${slug}.html`), page({lang,slug,title:item.title,description:item.description,groups:item.categories,labels:item}));
}

function articlePage(lang, slug, title, description, body, faqs) {
  const prefix = lang === 'en' ? '/en' : '';
  const url = `https://dunasyolas.com${prefix}/blog/${slug}/`;
  const related = lang === 'en' ? '/en/cartagena-travel-questions' : '/preguntas-viaje-cartagena';
  const hydratedBody = body.replace(/<img /g, '<img loading="eager" decoding="async" ');
  return `<!DOCTYPE html><html lang="${lang}" class="brand-refresh-active"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Dunas &amp; Olas</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="es" href="https://dunasyolas.com/blog/${slug}/"><link rel="alternate" hreflang="en" href="https://dunasyolas.com/en/blog/${slug}/"><meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="https://dunasyolas.com/images/isla-palma-4.webp"><link rel="stylesheet" href="/css/brand-refresh.css?v=20260925a"><link rel="stylesheet" href="/css/answer-guide.css?v=20260925a"><link rel="icon" href="/favicon.ico"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting',headline:title,description,datePublished:DATE,dateModified:DATE,inLanguage:lang,author:{'@type':'Person',name:'Nohemi'},publisher:{'@type':'TravelAgency',name:'Dunas & Olas'},mainEntityOfPage:url}).replace(/</g,'\\u003c')}</script></head><body>${navbar(lang)}<main class="answer-main article"><p class="answer-kicker">${lang === 'en' ? 'Local travel guide' : 'Guía local'}</p><h1>${title}</h1><p class="answer-intro">${description}</p><p class="answer-reviewed">${lang === 'en' ? 'Locally reviewed' : 'Verificado localmente'}: ${DATE}</p>${hydratedBody}<section class="answer-category"><h2>${lang === 'en' ? 'Quick answers' : 'Respuestas rápidas'}</h2><div class="answer-list">${faqs.map(([q,a])=>`<details><summary>${q}</summary><div><p>${a}</p></div></details>`).join('')}</div></section><p><a class="answer-more" href="${related}">${lang === 'en' ? 'See all Cartagena travel answers' : 'Ver todas las respuestas para viajar a Cartagena'} →</a></p></main><footer class="answer-footer">Dunas &amp; Olas · Getsemaní, Cartagena · RNT 292710</footer><script src="/js/site-refresh.js?v=20260915f" defer></script></body></html>`;
}

const childEs = `<img class="article-cover" src="/images/isla-palma-4.webp" alt="Pasadía familiar en una isla cerca de Cartagena" width="1200" height="800"><h2>La respuesta corta</h2><p>Un pasadía puede funcionar muy bien con niños si se elige por duración, oleaje e infraestructura. La edad por sí sola no basta: revisa chaleco de talla correcta, sombra, baño, alimentación, tiempo de navegación y capacidad del niño para una jornada larga.</p><h2>Qué plan conviene según la edad</h2><div class="answer-table"><table><thead><tr><th>Perfil</th><th>Prioridad</th><th>Evita</th></tr></thead><tbody><tr><td>Bebés y niños pequeños</td><td>Trayecto corto, sombra, baño y regreso flexible</td><td>Muchas paradas y mar fuerte</td></tr><tr><td>Niños escolares</td><td>Playa controlada, piscina o actividad breve</td><td>Jornadas sin descanso ni hidratación</td></tr><tr><td>Adolescentes</td><td>Snorkel o actividad acorde con experiencia</td><td>Equipo sin talla o supervisión</td></tr></tbody></table></div><h2>Antes de pagar</h2><ul><li>Confirma si el menor paga pasadía, tasa portuaria, seguro o entrada.</li><li>Pide chaleco infantil y no aceptes uno de adulto como sustituto.</li><li>Pregunta duración real de navegación y hora de regreso.</li><li>Informa alergias, movilidad, medicación y si el menor sabe nadar.</li><li>Lleva muda seca, sombrero, agua y protección solar.</li></ul><h2>Embarazo y condiciones médicas</h2><p>El impacto de una lancha rápida puede ser importante. La persona embarazada o con una condición médica debe consultar a su profesional de salud y avisar al operador. Dunas & Olas no sustituye esa evaluación.</p><h2>Qué destinos comparar</h2><p>Tierra Bomba reduce el tiempo de navegación. Barú por tierra evita el trayecto marítimo largo. Algunos pasadías de Rosario ofrecen piscinas e infraestructura. Compara las opciones vigentes en <a href="/islas-del-rosario">Islas del Rosario</a> y pide una recomendación según las edades.</p>`;
const childEn = `<img class="article-cover" src="/images/isla-palma-4.webp" alt="Family island day trip near Cartagena" width="1200" height="800"><h2>Short answer</h2><p>An island day trip can work well with children when you choose for navigation time, sea conditions and facilities. Check a correctly sized life jacket, shade, toilets, food, total duration and the child’s comfort with a long day.</p><h2>Choose by age and comfort</h2><p>For babies and young children, favor short navigation, shade and a flexible return. School-age children may enjoy a controlled beach or pool. Teenagers can add snorkeling when equipment and supervision match their ability.</p><h2>Before paying</h2><ul><li>Confirm child price, pier tax, insurance and admissions.</li><li>Request a child-size life jacket.</li><li>Ask for actual navigation and return times.</li><li>Disclose allergies, medication and swimming ability.</li><li>Bring water, sun protection and dry clothes.</li></ul><h2>Pregnancy and medical conditions</h2><p>Fast-boat impact can be significant. Ask a health professional and tell the operator before booking. A short crossing or land transfer may be more appropriate.</p>`;
const seaEs = `<img class="article-cover" src="/images/islastour (1).webp" alt="Lancha navegando desde Cartagena hacia las islas" width="1200" height="800"><h2>Cuándo se siente más el movimiento</h2><p>El oleaje depende de viento, dirección, hora, ruta y embarcación. Los meses secos pueden tener viento fuerte. Un cielo despejado no garantiza mar tranquilo, y la lluvia no significa automáticamente que la navegación sea insegura.</p><h2>Antes de salir</h2><ul><li>Duerme bien y come ligero.</li><li>Evita alcohol y comidas muy grasosas.</li><li>Pregunta a la tripulación dónde se siente menos movimiento.</li><li>Mira el horizonte y evita leer durante el trayecto.</li><li>Protege tus pertenencias y sigue las instrucciones del capitán.</li></ul><h2>Medicamentos</h2><p>Algunos medicamentos para mareo producen sueño o tienen contraindicaciones. Consulta a un profesional antes de usarlos, especialmente en niños, embarazo o si tomas otros medicamentos.</p><h2>Cuándo elegir otra opción</h2><p>Si una persona tiene alta sensibilidad, embarazo o una condición médica, compara Tierra Bomba, Barú por tierra o una experiencia urbana. Si DIMAR restringe el zarpe, no busques una salida informal.</p><h2>Fuente y confirmación</h2><p>Revisa avisos de <a href="${sources.dimar}">DIMAR</a> y pide la confirmación específica de tu operador. El pronóstico general del teléfono no reemplaza una decisión marítima.</p>`;
const seaEn = `<img class="article-cover" src="/images/islastour (1).webp" alt="Boat traveling from Cartagena toward the islands" width="1200" height="800"><h2>When movement is stronger</h2><p>Waves depend on wind, direction, time, route and vessel. Dry-season months can be windy. Clear skies do not guarantee calm water, and rain does not automatically make navigation unsafe.</p><h2>Before departure</h2><ul><li>Sleep well and eat lightly.</li><li>Avoid alcohol and very fatty meals.</li><li>Ask the crew where movement is lower.</li><li>Look at the horizon and avoid reading.</li><li>Follow the captain’s instructions.</li></ul><h2>Medication</h2><p>Motion-sickness medicine can cause drowsiness or interact with other conditions. Ask a health professional first, especially for children or pregnancy.</p><h2>Choose another option when needed</h2><p>Travelers with strong sensitivity can compare Tierra Bomba, a land transfer to Barú or an urban experience. Never seek an informal departure during a maritime restriction.</p>`;

const articles = [
  ['es','islas-del-rosario-con-ninos','Islas del Rosario con niños: seguridad, mar y qué pasadía elegir','Cómo elegir un pasadía familiar desde Cartagena: chalecos, edades, oleaje, duración, pagos de menores y opciones con menos navegación.',childEs,[['¿Los niños pagan?','Depende del producto y la edad. Confirma por separado pasadía, tasa, seguro y entrada.'],['¿Necesitan chaleco infantil?','Sí. Debe corresponder a su talla y usarse cuando lo indique la tripulación.'],['¿Cuál opción navega menos?','Tierra Bomba suele requerir un trayecto más corto; Barú por tierra evita una navegación larga.']]],
  ['en','islas-del-rosario-con-ninos','Rosario Islands with children: safety, sea conditions and choosing a day trip','How to choose a family island trip from Cartagena: life jackets, ages, waves, duration, child pricing and shorter navigation options.',childEn,[['Do children pay?','It depends on the product and age. Confirm the day trip, pier tax, insurance and admission separately.'],['Do they need child-size life jackets?','Yes. The jacket must fit the child and be worn when instructed by the crew.'],['Which option has less navigation?','Tierra Bomba generally has a shorter crossing; a land transfer to Barú avoids a long boat ride.']]],
  ['es','mareo-lancha-cartagena','Mareo en lancha en Cartagena: cómo prevenirlo y cuándo está más movido el mar','Consejos prácticos para reducir el mareo, entender el oleaje y elegir una salida a las islas adecuada para tu grupo.',seaEs,[['¿La lluvia causa el mareo?','No directamente. El movimiento depende más del oleaje, viento, ruta y embarcación.'],['¿Dónde se siente menos movimiento?','Cambia según la embarcación; pregunta a la tripulación antes de sentarte.'],['¿Puede garantizarse mar tranquilo?','No. El operador confirma condiciones y la autoridad puede restringir el zarpe.']]],
  ['en','mareo-lancha-cartagena','Seasickness on Cartagena boats: prevention and rough-sea timing','Practical guidance to reduce motion sickness, understand waves and choose a suitable island trip from Cartagena.',seaEn,[['Does rain cause seasickness?','Not directly. Movement depends more on waves, wind, route and vessel.'],['Where is movement lower?','It depends on the vessel; ask the crew before choosing a seat.'],['Can calm water be guaranteed?','No. The operator confirms conditions and the authority may restrict departures.']]]
];
for (const [lang,slug,title,desc,body,faqs] of articles) write(path.join(root,lang === 'en' ? 'en' : '', 'blog', slug, 'index.html'), articlePage(lang,slug,title,desc,body,faqs));

function productFaq(products, lang, standalone = false) {
  const product = products[0];
  const en = lang === 'en';
  const locale = en ? 'en-US' : 'es-CO';
  const name = en && product.nameEn ? product.nameEn : product.name;
  const description = en && product.descriptionEn ? product.descriptionEn : product.description;
  const isWater = /(isla|playa|mambo|barú|baru|bahía|bahia|yate|catamar|buceo|snorkel|múcura|tintipán|tritonia|namaste|tamarindo|oceanario|eco-route)/i.test(name);
  const priceAnswer = products.length > 1
    ? `<ul>${products.map(item => `<li><strong>${esc(en && item.nameEn ? item.nameEn : item.name)}:</strong> ${money(item.price, locale)}</li>`).join('')}</ul><p>${en ? 'Availability and the final total are confirmed for your date.' : 'La disponibilidad y el total final se confirman para la fecha elegida.'}</p>`
    : en
      ? `The current starting price is <strong>${money(product.price, locale)}</strong> per ${product.unit === 'grupo' ? 'group' : 'person or published unit'}. Availability and the final total are confirmed for your date.`
      : `El precio vigente parte de <strong>${money(product.price, locale)}</strong> por ${product.unit || 'persona'}. La disponibilidad y el total final se confirman para la fecha elegida.`;
  const qas = en ? [
    [`What is the published price for ${name}?`, priceAnswer],
    ['What is included?', description ? `${esc(description)} We will confirm the exact inclusions in writing before payment.` : 'Inclusions vary by selected option. We will confirm transport, food, activities and equipment in writing before payment.'],
    ['Are there additional charges?', 'Ask us to confirm pier fees, insurance, admissions, optional activities and any mandatory consumption for this option. Charges that apply will be stated before booking.'],
    ['Where and when does it start?', 'The meeting point, reporting time, departure and expected return are confirmed for the selected date and option. Arrive with the requested time margin.'],
    [isWater ? 'What happens if sea or weather conditions are unsuitable?' : 'What happens if weather affects the activity?', isWater ? 'The route may be adjusted, rescheduled or canceled when the operator or maritime authority determines that conditions are unsafe. The applicable policy is confirmed before payment.' : 'The operator may adjust or reschedule the activity when conditions make it unsafe. The applicable policy is confirmed before payment.'],
    ['What should I send to check availability?', 'Send your date, number of travelers, children’s ages, accommodation, language and any medical, dietary or mobility requirement. A WhatsApp inquiry is not a confirmed booking.']
  ] : [
    [`¿Cuál es el precio publicado de ${name}?`, priceAnswer],
    ['¿Qué incluye?', description ? `${esc(description)} Antes de pagar confirmaremos por escrito los incluidos exactos.` : 'Los incluidos dependen de la opción. Antes de pagar confirmaremos transporte, alimentación, actividades y equipo.'],
    ['¿Hay cobros adicionales?', 'Pide confirmar tasa portuaria, seguro, entradas, actividades opcionales y consumos obligatorios. Los cargos aplicables se informan antes de reservar.'],
    ['¿Dónde y a qué hora comienza?', 'El punto de encuentro, hora de presentación, salida y regreso estimado se confirman para la fecha y opción elegidas. Llega con el margen solicitado.'],
    [isWater ? '¿Qué pasa si el mar o el clima no permiten salir?' : '¿Qué pasa si el clima afecta la actividad?', isWater ? 'La ruta puede ajustarse, reprogramarse o cancelarse cuando el operador o la autoridad marítima determinan que no es seguro. La política aplicable se confirma antes del pago.' : 'El operador puede ajustar o reprogramar cuando las condiciones no sean seguras. La política aplicable se confirma antes del pago.'],
    ['¿Qué datos envío para consultar disponibilidad?', 'Envía fecha, cantidad de viajeros, edades de los niños, alojamiento, idioma y cualquier necesidad médica, alimentaria o de movilidad. Consultar por WhatsApp no confirma todavía el cupo.']
  ];
  return `<section class="seo-product-faq${standalone ? ' seo-product-faq-standalone' : ''}" data-seo-product-faq>${standalone ? '<div class="seo-product-faq-inner">' : ''}<h2>${en ? 'Before you book' : 'Antes de reservar'}</h2>${qas.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}<p class="seo-product-more"><a href="${en ? '/en/cartagena-travel-questions' : '/preguntas-viaje-cartagena'}">${en ? 'Read all Cartagena travel answers' : 'Ver todas las respuestas para viajar a Cartagena'} →</a></p>${standalone ? '</div>' : ''}</section>`;
}

const productsByRoute = new Map();
for (const product of Object.values(catalog.products)) {
  if (!product.route) continue;
  if (!productsByRoute.has(product.route)) productsByRoute.set(product.route, []);
  productsByRoute.get(product.route).push(product);
}
for (const [route, products] of productsByRoute) {
  for (const lang of ['es','en']) {
    const rel = `${lang === 'en' ? 'en/' : ''}${route.replace(/^\//,'')}.html`;
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) continue;
    const $ = cheerio.load(fs.readFileSync(file,'utf8'), {decodeEntities:false});
    $('[data-seo-product-faq]').remove();
    $('link[data-product-faq-styles]').remove();
    $('head').append('<link rel="stylesheet" href="/css/product-faq.css?v=20260925a" data-product-faq-styles>');
    const main = $('main').first();
    if (main.length) main.append(productFaq(products, lang));
    else {
      const footer = $('footer').first();
      if (footer.length) footer.before(productFaq(products, lang, true));
      else $('body').append(productFaq(products, lang, true));
    }
    fs.writeFileSync(file, $.html());
  }
}

function insertGuideLink(file, href, title, text) {
  if (!fs.existsSync(file)) return;
  const $ = cheerio.load(fs.readFileSync(file,'utf8'), {decodeEntities:false});
  $('[data-answer-guide-link]').remove();
  const target = $('#articles-grid').first();
  const card = `<article data-answer-guide-link data-category="guia destacado" class="group bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col h-full relative"><a href="${href}" class="block"><img src="/images/cartagena.webp" alt="${esc(title)}" width="1400" height="787" loading="lazy" decoding="async" style="width:100%;aspect-ratio:16/9;object-fit:cover"></a><div style="padding:1.5rem"><p style="color:#076474;font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:.75rem">Guía de respuestas</p><h2 style="font-size:1.4rem;margin:.5rem 0"><a href="${href}">${esc(title)}</a></h2><p>${esc(text)}</p><a href="${href}" style="font-weight:800;color:#076474">Leer guía →</a></div></article>`;
  if (target.length) target.prepend(card);
  fs.writeFileSync(file,$.html());
}
insertGuideLink(path.join(root,'blog','index.html'),'/preguntas-viaje-cartagena','Preguntas para viajar y reservar en Cartagena','Islas, clima, precios, seguridad, transporte, botes y actividades explicados con respuestas directas.');
insertGuideLink(path.join(root,'en','blog','index.html'),'/en/cartagena-travel-questions','Cartagena travel questions','Clear answers about islands, safety, prices, weather, transport, boats and activities.');

for (const [file, href, title] of [
  [path.join(root,'faq.html'),'/preguntas-viaje-cartagena','Ver la guía completa de preguntas para viajar a Cartagena'],
  [path.join(root,'en','faq.html'),'/en/cartagena-travel-questions','Read the complete Cartagena travel questions guide']
]) {
  if (!fs.existsSync(file)) continue;
  const $=cheerio.load(fs.readFileSync(file,'utf8'),{decodeEntities:false});
  $('[data-answer-guide-link]').remove();
  const guideLink = `<p data-answer-guide-link style="max-width:1100px;margin:110px auto 0;padding:16px 24px;background:#e7f5f5;border-left:4px solid #076474"><a href="${href}" style="font-weight:800;color:#064e5a">${title} →</a></p>`;
  const main = $('main').first();
  if (main.length) main.prepend(guideLink);
  else {
    const hero = $('section').first();
    if (hero.length) hero.before(guideLink);
    else $('body').prepend(guideLink);
  }
  fs.writeFileSync(file,$.html());
}

console.log(`Answer guide: ${es.reduce((n,[,qs])=>n+qs.length,0)} Spanish answers, ${Object.values(international).reduce((n,x)=>n+x.categories.reduce((m,[,qs])=>m+qs.length,0),0)} international answers, product FAQs updated.`);
