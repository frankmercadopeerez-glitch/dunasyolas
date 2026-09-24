const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const today = "2026-08-12";
const officialAgenda = "https://www.cartagena.gov.co/noticias/cartagena-lanza-anato-su-agenda-fiestas-independencia-11-noviembre-fiesta-que-nos-une";
const culturalAgenda = "https://cartagena.gov.co/noticias/heroica-vivira-cultura-todo-el-ano-alcaldia-cartagena-presenta-agenda-cultural-2026";
const beachDecree = "https://seguimientopot.cartagena.gov.co/sites/default/files/documentos/normativa/2024-12/DECRETO%200885%20DE%202016.pdf";
const beachSafety = "https://www.cartagena.gov.co/noticias/guardavidas-entregan-recomendaciones-para-uso-seguro-playas-cartagena-2572";
const beachClosure = "https://www.cartagena.gov.co/noticias/alcaldia-cartagena-decreta-cierre-total-playas-condiciones-meteorologicas-adversas";
const picoPlaca = "https://www.cartagena.gov.co/noticias/conozca-el-nuevo-pico-placa-para-particulares-sus-rotaciones-durante-el-2026";
const ideamClimate = "https://www.ideam.gov.co/documents/21021/418894/Caracter%C3%ADsticas%2Bde%2BCiudades%2BPrincipales%2By%2BMunicipios%2BTur%C3%ADsticos.pdf";
const safeBoating = "https://www.cartagena.gov.co/noticias/contratar-servicios-turisticos-autorizados-zarpar-desde-el-muelle-bodeguita-acudir-canales-atencion-denuncias-recomendaciones-distrito-temporada-turistica-mas-importante-ano";
const safeDeparture = "https://www.cartagena.gov.co/noticias/zarpa-seguro-hacia-zona-insular-cartagena-desde-muelle-bodeguita";
const dimar = "https://www.dimar.mil.co/comunicado-de-prensa-301";

const articles = [
  {
    slug: "festival-nautico-cartagena-2026",
    title: "Festival Náutico de Cartagena 2026: fechas y guía para disfrutarlo",
    shortTitle: "Festival Náutico de Cartagena 2026",
    description: "El Festival Náutico de Cartagena 2026 será el 13 y 14 de noviembre. Consulta fechas, zonas recomendadas, seguridad y cómo organizar tu viaje.",
    keywords: "festival nautico cartagena 2026, festival náutico cartagena noviembre, eventos cartagena noviembre 2026, fiestas independencia cartagena",
    category: "Actualidad 2026",
    categoryClass: "text-cyan-700",
    cardCategory: "actualidad destacado",
    image: "images/blog/festival-nautico-cartagena-2026.webp",
    cardImage: "images/blog/festival-nautico-cartagena-2026-card.webp",
    imageWidth: 1600,
    imageHeight: 900,
    alt: "Embarcaciones durante una celebración náutica en la bahía de Cartagena al atardecer",
    reading: "8 min",
    event: { name: "Festival Náutico de Cartagena 2026", startDate: "2026-11-13", endDate: "2026-11-14" },
    intro: "Cartagena confirmó el <strong>Festival Náutico 2026 para el viernes 13 y sábado 14 de noviembre</strong>, dentro de la agenda oficial de las Fiestas de Independencia. Es una de las celebraciones más fotogénicas del año: la bahía, las embarcaciones y el ambiente festivo se convierten en protagonistas. Esta guía reúne lo que ya está confirmado y separa con claridad lo que todavía debe anunciar la Alcaldía.",
    notice: "La fecha está confirmada por la Alcaldía. Recorrido, horarios exactos, aforos y programación artística pueden cambiar; revisa el anuncio operativo unos días antes.",
    sections: [
      ["¿Cuándo es el Festival Náutico de Cartagena 2026?", `<p>La agenda oficial ubica el Festival Náutico los días <strong>13 y 14 de noviembre de 2026</strong>. Coincide con el tramo final de las Fiestas de Independencia: el Gran Desfile será el 12 de noviembre, el Cabildo de Getsemaní el 14 y la coronación el 15.</p><p>Si vienes expresamente para el festival, una estancia del 11 al 16 de noviembre permite combinar los principales actos sin tener que mover todo el itinerario por un solo evento.</p>`],
      ["Dónde verlo sin improvisar", `<p>La experiencia ocurre alrededor de la bahía, pero los puntos públicos habilitados y cualquier cierre vial o marítimo se anuncian cerca de la fecha. Evita asumir que cualquier muelle, espolón o embarcación tendrá acceso.</p><ul><li>Reserva alojamiento con acceso sencillo al Centro, Getsemaní o Bocagrande.</li><li>Llega temprano a la zona autorizada y evita bordes sin protección.</li><li>Si vas a navegar, contrata únicamente un operador habilitado y confirma por escrito punto de salida, hora de regreso, capacidad y chaleco.</li></ul>`],
      ["Festival Náutico desde tierra o desde una embarcación", `<p>Desde tierra tendrás una vista más estable, acceso más sencillo y menor exposición al oleaje. Desde una embarcación, la perspectiva puede ser espectacular, pero requiere mayor planificación y el recorrido siempre queda sujeto a las instrucciones de la Capitanía de Puerto.</p><div class="tip-box"><p><strong>Consejo de Nohemi:</strong> no compres un cupo que solo diga “festival incluido”. Pide nombre de la embarcación, muelle autorizado, cantidad de pasajeros, cobertura del seguro y política si la autoridad marítima restringe la navegación.</p></div>`],
      ["Qué llevar", `<ul><li>Ropa fresca y calzado que no resbale.</li><li>Protector solar, gorra y agua.</li><li>Protección impermeable para el teléfono.</li><li>Identificación y comprobante de reserva descargado.</li><li>Una batería externa: durante eventos masivos la señal puede congestionarse.</li></ul>`],
      ["Cómo completar tu viaje de noviembre", `<p>Consulta el <a href="../fiestas-independencia-cartagena-2026/">calendario de las Fiestas de Independencia 2026</a> y nuestra guía de <a href="../cartagena-noviembre-clima-que-llevar/">clima de Cartagena en noviembre</a>. Para un día de islas, revisa antes las recomendaciones para <a href="../zarpar-seguro-islas-cartagena/">zarpar de forma segura</a> y compara las <a href="../../experiences.html">experiencias disponibles</a>.</p>`],
    ],
    faqs: [
      ["¿Cuándo será el Festival Náutico de Cartagena 2026?", "La Alcaldía de Cartagena lo programó para el 13 y 14 de noviembre de 2026, dentro de las Fiestas de Independencia."],
      ["¿Ya se conoce el recorrido oficial?", "La agenda general confirma las fechas, pero el recorrido, los horarios operativos y los puntos habilitados deben verificarse en los comunicados cercanos al evento."],
      ["¿Es obligatorio verlo desde una embarcación?", "No. Puede disfrutarse desde zonas públicas habilitadas en tierra. Navegar requiere operador autorizado y cumplimiento de las instrucciones marítimas."],
    ],
    sources: [["Alcaldía de Cartagena: agenda oficial de las Fiestas de Independencia 2026", officialAgenda], ["Alcaldía de Cartagena: recomendaciones para zarpar de forma segura", safeDeparture]],
    cardText: "Fechas confirmadas, recomendaciones, seguridad y cómo organizar el viaje para uno de los eventos más esperados de noviembre.",
  },
  {
    slug: "fiestas-independencia-cartagena-2026",
    title: "Fiestas de Independencia de Cartagena 2026: calendario completo",
    shortTitle: "Fiestas de Independencia 2026",
    description: "Calendario oficial de las Fiestas de Independencia de Cartagena 2026: preludios, Gran Desfile, Festival Náutico, Getsemaní y coronación.",
    keywords: "fiestas independencia cartagena 2026, fiestas noviembre cartagena, gran desfile cartagena 2026, cabildo getsemani 2026",
    category: "Eventos de Cartagena",
    categoryClass: "text-fuchsia-700",
    cardCategory: "actualidad destacado",
    image: "images/blog/fiestas-independencia-cartagena-2026.webp",
    cardImage: "images/blog/fiestas-independencia-cartagena-2026-card.webp",
    imageWidth: 1600,
    imageHeight: 900,
    alt: "Comparsa de bailarines y músicos celebrando las Fiestas de Independencia en el Centro Histórico de Cartagena",
    imageStyle: "height:clamp(260px,35vw,460px);object-position:center 46%",
    coverStyle: "max-width:1180px;overflow:hidden;border-radius:24px 24px 0 0",
    reading: "10 min",
    event: { name: "Fiestas de Independencia de Cartagena 2026", startDate: "2026-11-01", endDate: "2026-11-15" },
    intro: "Las Fiestas de Independencia del 11 de Noviembre son una celebración cultural de ciudad, no solo una noche de fiesta. En 2026, la programación oficial se extiende durante la primera mitad de noviembre con cabildos, desfiles, música, Festival Náutico y coronación. Aquí tienes un calendario práctico para elegir fechas y reservar con criterio.",
    notice: "La Alcaldía confirmó las fechas principales. Horas, recorridos, cierres y condiciones de acceso deben revisarse nuevamente antes de asistir.",
    sections: [
      ["Fechas clave de noviembre de 2026", `<div class="schedule-grid"><p><strong>1 de noviembre:</strong> Ángeles Somos.</p><p><strong>1 al 4:</strong> Festival Regional de Gaitas.</p><p><strong>6:</strong> cabildos de la Escuela Normal e Itmina Fanti en Bocachica.</p><p><strong>7:</strong> desfile en traje de baño y Festival Jorge García Usta.</p><p><strong>11:</strong> actos solemnes, ofrenda floral y serenata.</p><p><strong>12:</strong> Gran Desfile de Independencia.</p><p><strong>13 y 14:</strong> Festival Náutico y Bololó del Arsenal.</p><p><strong>14:</strong> Cabildo de Getsemaní.</p><p><strong>15:</strong> elección y coronación.</p></div>`],
      ["Qué días conviene viajar", `<p>Para vivir el núcleo principal, llega el 10 de noviembre y regresa después del 15. Si prefieres menos multitudes, combina los primeros eventos culturales con un día de islas y evita concentrar todos los planes en torno al desfile.</p><p>Reserva alojamiento con cancelación flexible: los cierres viales y la demanda de transporte pueden modificar los tiempos de llegada.</p>`],
      ["Cómo moverse durante las fiestas", `<p>No dependas de un vehículo particular para llegar al Centro Histórico. Consulta el <a href="../pico-y-placa-cartagena-2026/">pico y placa vigente</a>, pregunta por cierres temporales y deja margen para caminar. En eventos masivos establece un punto de encuentro con tu grupo y guarda la dirección del alojamiento.</p>`],
      ["Seguridad y compras responsables", `<ul><li>Pregunta el precio antes de aceptar productos o servicios.</li><li>Evita portar documentos originales y grandes cantidades de efectivo.</li><li>Usa transporte formal y comparte tu ubicación.</li><li>No compres excursiones marítimas a vendedores sin identificación.</li><li>Hidrátate y protege tu teléfono durante desfiles.</li></ul>`],
      ["Qué reservar además de las fiestas", `<p>Deja al menos una mañana tranquila después de los eventos nocturnos. Puedes elegir una experiencia de playa o cultura en nuestro catálogo de <a href="../../experiences.html">tours en Cartagena</a>. Si planeas el Festival Náutico, revisa la <a href="../festival-nautico-cartagena-2026/">guía específica del evento</a>.</p>`],
    ],
    faqs: [
      ["¿Cuándo es el Gran Desfile de Independencia 2026?", "La agenda oficial lo programa para el jueves 12 de noviembre de 2026."],
      ["¿Cuándo es el Cabildo de Getsemaní?", "Está programado para el 14 de noviembre de 2026."],
      ["¿Las Fiestas de Independencia son gratuitas?", "Muchos actos se desarrollan en el espacio público, pero algunos eventos pueden manejar aforo, boletería o accesos especiales. Hay que verificar cada actividad."],
    ],
    sources: [["Alcaldía de Cartagena: agenda de noviembre de 2026", officialAgenda], ["Alcaldía de Cartagena: agenda cultural 2026", culturalAgenda]],
    cardText: "Preludios, Gran Desfile, Festival Náutico, Cabildo de Getsemaní y coronación: organiza tus fechas con el calendario oficial.",
  },
  {
    slug: "horarios-playas-cartagena-2026",
    title: "Horario de ingreso a las playas de Cartagena en 2026",
    shortTitle: "Horarios de playas en Cartagena",
    description: "Conoce el horario general de las playas de Cartagena, cuándo hay guardavidas, por qué pueden cerrar y qué revisar antes de ir a Barú o zona insular.",
    keywords: "horario playas cartagena 2026, a que hora cierran playas cartagena, horario playa blanca baru, playas cartagena abiertas",
    category: "Información útil",
    categoryClass: "text-blue-700",
    cardCategory: "actualidad guia islas",
    image: "images/playa-blanca-baru.webp",
    imageWidth: 1200,
    imageHeight: 800,
    alt: "Playa Blanca en Barú con mar azul y arena clara",
    reading: "7 min",
    intro: "La respuesta corta es que Cartagena maneja un marco general de uso turístico de playas entre las <strong>6:00 a. m. y las 6:00 p. m.</strong>, mientras el Cuerpo de Salvavidas recomienda disfrutar las playas habilitadas entre <strong>8:00 a. m. y 6:00 p. m.</strong>, cuando existe una operación de seguridad más clara. Pero hay cierres temporales por clima, mantenimiento o decisiones de la autoridad.",
    notice: "No confundas horario general con garantía de apertura. Oleaje, fuertes vientos, contaminación o una orden marítima pueden cerrar una playa el mismo día.",
    sections: [
      ["El horario general y la franja más segura", `<p>El Decreto 0885 de 2016 estableció, como marco general, el uso turístico de las playas continentales e insulares de 6:00 a. m. a 6:00 p. m. Por su parte, el Cuerpo de Salvavidas ha recomendado el uso de las playas habilitadas entre 8:00 a. m. y 6:00 p. m.</p><p>Para un visitante, la regla práctica es sencilla: <strong>programa el baño dentro de la franja de 8:00 a. m. a 6:00 p. m.</strong>, confirma señalización y atiende a salvavidas. Llegar antes no significa que todos los servicios o dispositivos de seguridad estén operando.</p>`],
      ["¿Pueden cerrar las playas sin previo aviso?", `<p>Sí. En febrero de 2026 la Alcaldía decretó un cierre total temporal debido a condiciones meteorológicas adversas. Este tipo de medida protege a bañistas, embarcaciones y trabajadores de playa.</p><p>Antes de desplazarte, revisa los canales de la Alcaldía, DIMAR y la Capitanía de Puerto. Si ya contrataste un tour, pide al operador una confirmación el mismo día.</p>`],
      ["Playas continentales y zona insular", `<p>Las playas urbanas y las islas no siempre funcionan bajo la misma logística. En Barú, Islas del Rosario o San Bernardo debes sumar los horarios de navegación, el muelle y el regreso autorizado. No planifiques una salida insular solo con base en “la playa cierra a las seis”.</p>`],
      ["Qué hacer si encuentras bandera roja", `<ul><li>No ingreses al agua aunque otras personas lo hagan.</li><li>Pregunta al salvavidas por la zona habilitada.</li><li>No uses inflables con viento fuerte.</li><li>Mantén a niños al alcance de la mano.</li><li>Si hay cierre, cambia el plan por una actividad cultural o gastronómica.</li></ul>`],
      ["Planifica una playa sin sorpresas", `<p>Consulta nuestra guía para <a href="../zarpar-seguro-islas-cartagena/">salir de forma segura hacia las islas</a> y compara <a href="../../experiences.html">pasadías con información clara</a>. Confirma siempre qué incluye la tarifa, especialmente transporte, tasa portuaria, seguro, cama de playa y alimentación.</p>`],
    ],
    faqs: [
      ["¿A qué hora cierran las playas de Cartagena?", "El marco general de uso turístico llega hasta las 6:00 p. m. La Alcaldía y los salvavidas pueden modificar o restringir el acceso por seguridad."],
      ["¿A qué hora es más seguro ir a la playa?", "El Cuerpo de Salvavidas recomienda utilizar las playas habilitadas entre 8:00 a. m. y 6:00 p. m., atendiendo siempre la señalización local."],
      ["¿Cómo sé si una playa está cerrada?", "Revisa avisos de la Alcaldía de Cartagena, DIMAR, Capitanía de Puerto y las banderas o instrucciones de los salvavidas en el sitio."],
    ],
    sources: [["Decreto 0885 de 2016: uso turístico de playas", beachDecree], ["Alcaldía de Cartagena: recomendaciones del Cuerpo de Salvavidas", beachSafety], ["Ejemplo oficial de cierre temporal por condiciones meteorológicas", beachClosure]],
    cardText: "Horario general, franja recomendada por salvavidas y cierres temporales: lo que debes confirmar antes de ir al mar.",
  },
  {
    slug: "pico-y-placa-cartagena-2026",
    title: "Pico y placa en Cartagena 2026: horarios, placas y fechas",
    shortTitle: "Pico y placa Cartagena 2026",
    description: "Consulta el pico y placa de Cartagena 2026: horarios para particulares, rotaciones de placas, temporadas de restricción especial y consejos para turistas.",
    keywords: "pico y placa cartagena 2026, pico placa cartagena hoy, restriccion carros cartagena, movilidad cartagena turistas",
    category: "Movilidad 2026",
    categoryClass: "text-slate-700",
    cardCategory: "actualidad guia",
    image: "images/cartagenacentro.webp",
    imageWidth: 1232,
    imageHeight: 999,
    alt: "Calle del Centro Histórico de Cartagena con vehículos y peatones",
    reading: "8 min",
    intro: "Si vas a alquilar carro o llegar a Cartagena por carretera, necesitas revisar el último dígito de la placa. La medida vigente para vehículos particulares cubre del 16 de enero de 2026 al 22 de enero de 2027, de lunes a viernes no festivos, y combina horarios ordinarios con temporadas especiales de restricción durante todo el día.",
    notice: "Esta guía resume el decreto divulgado por la Alcaldía. Antes de conducir, revisa la señalización y cualquier modificación publicada por el DATT.",
    sections: [
      ["Horario ordinario para carros particulares", `<p>Fuera de los periodos especiales, el pico y placa para particulares opera de <strong>7:00 a 9:00 a. m.</strong> y de <strong>6:00 a 8:00 p. m.</strong>, de lunes a viernes no festivos.</p>`],
      ["Rotación vigente hasta el 2 de octubre de 2026", `<ul><li><strong>Lunes:</strong> placas terminadas en 9 y 0.</li><li><strong>Martes:</strong> 1 y 2.</li><li><strong>Miércoles:</strong> 3 y 4.</li><li><strong>Jueves:</strong> 5 y 6.</li><li><strong>Viernes:</strong> 7 y 8.</li></ul>`],
      ["Rotación del 5 de octubre de 2026 al 22 de enero de 2027", `<ul><li><strong>Lunes:</strong> 1 y 2.</li><li><strong>Martes:</strong> 3 y 4.</li><li><strong>Miércoles:</strong> 5 y 6.</li><li><strong>Jueves:</strong> 7 y 8.</li><li><strong>Viernes:</strong> 9 y 0.</li></ul>`],
      ["Temporadas con restricción especial", `<p>Durante los periodos señalados por la Alcaldía —incluidos Semana Santa, del 12 de junio al 7 de agosto y del 11 de diciembre al 22 de enero de 2027— la restricción para particulares se aplica durante 24 horas, desde las 6:00 a. m. hasta las 6:00 a. m. del día siguiente, en días hábiles no festivos.</p>`],
      ["Qué significa para un turista", `<p>Antes de reservar un vehículo, pide la placa y cruza el último dígito con tus fechas. Si coincide, considera taxi formal, aplicación autorizada, transporte del hotel o un tour con recogida. En el Centro Histórico caminar suele ser más práctico que buscar estacionamiento.</p><p>También existen restricciones específicas para motocicletas y algunas zonas; si alquilas una, consulta el decreto completo.</p>`],
    ],
    faqs: [
      ["¿Cuál es el horario normal del pico y placa en Cartagena?", "Para vehículos particulares, el horario ordinario es de 7:00 a 9:00 a. m. y de 6:00 a 8:00 p. m., de lunes a viernes no festivos."],
      ["¿Hay pico y placa todo el día en temporada turística?", "Sí, el decreto contempla periodos especiales con restricción de 24 horas en días hábiles no festivos, por ejemplo del 12 de junio al 7 de agosto y del 11 de diciembre al 22 de enero de 2027."],
      ["¿El pico y placa aplica a carros alquilados?", "La medida se define por el vehículo y su placa. Antes de alquilar, consulta la placa y confirma con la empresa si existe una excepción aplicable."],
    ],
    sources: [["Alcaldía de Cartagena: pico y placa para particulares en 2026", picoPlaca]],
    cardText: "Rotaciones, horarios normales y temporadas de restricción especial para que tu carro alquilado no arruine el itinerario.",
  },
  {
    slug: "cartagena-noviembre-clima-que-llevar",
    title: "Cartagena en noviembre: clima, eventos y qué llevar en 2026",
    shortTitle: "Cartagena en noviembre de 2026",
    description: "Cómo es el clima de Cartagena en noviembre, qué ropa llevar, qué eventos hay en 2026 y cómo organizar tours de playa durante la temporada de lluvias.",
    keywords: "cartagena en noviembre clima, que llevar a cartagena noviembre, noviembre cartagena 2026, llueve en cartagena noviembre",
    category: "Planificación",
    categoryClass: "text-amber-700",
    cardCategory: "actualidad guia",
    image: "images/cartagenasunset.webp",
    imageWidth: 1400,
    imageHeight: 933,
    alt: "Atardecer cálido sobre la bahía de Cartagena",
    reading: "8 min",
    intro: "Noviembre es uno de los meses con mayor identidad cultural de Cartagena: coincide con las Fiestas de Independencia y el Festival Náutico. También pertenece al periodo lluvioso del Caribe colombiano. Eso no significa lluvia continua, pero sí exige un itinerario flexible y protección contra aguaceros breves e intensos.",
    notice: "El clima no se decide por promedios. Para navegación y playa, revisa el pronóstico y las instrucciones de DIMAR y Capitanía de Puerto el mismo día.",
    sections: [
      ["¿Llueve mucho en Cartagena en noviembre?", `<p>IDEAM describe para Cartagena una temporada más seca entre diciembre y abril y un periodo de lluvias más frecuentes entre mayo y noviembre, con aproximadamente 10 a 15 días de lluvia por mes; octubre suele ser el más lluvioso. Noviembre sigue siendo húmedo, pero puede alternar mañanas soleadas, aguaceros y tardes despejadas.</p>`],
      ["Qué ropa y accesorios llevar", `<ul><li>Prendas frescas de secado rápido.</li><li>Una capa impermeable liviana, no un abrigo pesado.</li><li>Calzado cómodo con buen agarre y sandalias.</li><li>Protector solar y gorra: las nubes no eliminan la radiación.</li><li>Bolsa impermeable para documentos y teléfono.</li><li>Repelente para las tardes.</li></ul>`],
      ["Cómo ordenar el itinerario", `<p>Ubica la navegación temprano y conserva una actividad cubierta como plan alternativo. Museos, gastronomía, cafés y recorridos por espacios interiores pueden salvar una tarde de lluvia. No pongas el vuelo de regreso pocas horas después de un tour marítimo.</p>`],
      ["Eventos confirmados en noviembre de 2026", `<p>El 12 de noviembre será el Gran Desfile; el 13 y 14, el Festival Náutico; el 14, el Cabildo de Getsemaní; y el 15, la coronación. Consulta el <a href="../fiestas-independencia-cartagena-2026/">calendario completo de las Fiestas</a> antes de reservar hotel y transporte.</p>`],
      ["¿Vale la pena viajar en noviembre?", `<p>Sí, especialmente si priorizas cultura y ambiente local sobre días de playa perfectamente predecibles. La clave es asumir que el itinerario puede cambiar y contratar experiencias con condiciones transparentes ante restricciones climáticas.</p>`],
    ],
    faqs: [
      ["¿Noviembre es temporada de lluvias en Cartagena?", "Sí. IDEAM ubica mayo a noviembre como el periodo de lluvias más frecuentes, aunque no significa que llueva durante todo el día."],
      ["¿Se cancelan los tours por lluvia?", "Una lluvia leve no siempre cancela la navegación. La decisión depende de oleaje, viento y órdenes de la autoridad marítima, no solo de que esté lloviendo."],
      ["¿Qué evento importante hay en noviembre de 2026?", "Las Fiestas de Independencia concentran el Gran Desfile, Festival Náutico, Cabildo de Getsemaní y coronación entre el 12 y el 15 de noviembre."],
    ],
    sources: [["IDEAM: características climáticas de Cartagena", ideamClimate], ["Alcaldía de Cartagena: agenda oficial de noviembre 2026", officialAgenda], ["DIMAR: consulta de condiciones meteomarinas", dimar]],
    cardText: "Lluvia, equipaje, eventos y planes alternativos: una guía honesta para aprovechar noviembre sin depender de un pronóstico perfecto.",
  },
  {
    slug: "zarpar-seguro-islas-cartagena",
    title: "Cómo zarpar seguro hacia las islas de Cartagena en 2026",
    shortTitle: "Cómo zarpar seguro hacia las islas",
    description: "Guía para elegir operador, muelle y lancha segura en Cartagena: chalecos, capacidad, clima, regreso y señales de alerta antes de ir a las islas.",
    keywords: "lancha segura cartagena, muelle bodeguita islas rosario, tours autorizados cartagena, seguridad islas cartagena",
    category: "Seguridad marítima",
    categoryClass: "text-teal-700",
    cardCategory: "actualidad guia islas",
    image: "images/islastour (1).webp",
    imageWidth: 786,
    imageHeight: 524,
    alt: "Lancha turística navegando hacia las islas de Cartagena",
    reading: "9 min",
    intro: "Un pasadía bien elegido empieza antes de subir a la lancha. En temporada turística, la Alcaldía recomienda contratar servicios autorizados, salir desde muelles habilitados como La Bodeguita, usar chaleco y respetar la capacidad de la embarcación. Esta lista te ayuda a evaluar una reserva sin conocimientos náuticos.",
    notice: "El operador debe respetar las instrucciones de la Capitanía de Puerto. Si una restricción impide navegar, la seguridad está por encima del itinerario o del pago ya realizado.",
    sections: [
      ["1. Identifica al operador y el punto de salida", `<p>Pide razón social o nombre comercial, teléfono verificable y comprobante. Confirma por escrito el muelle y la puerta. La Alcaldía ha recomendado La Bodeguita como punto formal para muchas salidas a la zona insular, aunque existen otros muelles autorizados para operaciones específicas.</p>`],
      ["2. Revisa la embarcación antes de salir", `<ul><li>Chaleco salvavidas disponible y en buen estado para cada pasajero.</li><li>Capacidad visible y número de personas coherente.</li><li>Tripulación identificada.</li><li>Equipaje asegurado y pasillos libres.</li><li>Instrucciones de seguridad antes de zarpar.</li></ul>`],
      ["3. Confirma regreso y condiciones", `<p>Pregunta la hora prevista de retorno, el lugar exacto y qué sucede si cambian las condiciones del mar. En avisos oficiales de temporada aparecen ventanas de salida y regreso que pueden variar. No tomes una hora comercial como autorización marítima inamovible.</p>`],
      ["4. Evita estas señales de alerta", `<ul><li>Pago sin recibo o precio que cambia al llegar.</li><li>Punto de embarque improvisado.</li><li>Más pasajeros que chalecos.</li><li>Promesa de navegar pese a una restricción oficial.</li><li>Consumo excesivo de alcohol durante el trayecto.</li><li>Falta de explicación sobre tasa portuaria, seguro o extras.</li></ul>`],
      ["5. Canales de emergencia", `<p>La línea de Guardacostas es la <strong>146</strong>. Sigue las indicaciones de la tripulación y no te lances al agua alrededor de embarcaciones en movimiento. Consulta también los <a href="../horarios-playas-cartagena-2026/">horarios y cierres de playas</a>.</p>`],
    ],
    faqs: [
      ["¿Desde qué muelle salen los tours a las Islas del Rosario?", "Muchas excursiones autorizadas salen del Muelle de La Bodeguita. Confirma con el operador la puerta, hora y muelle exactos porque algunas operaciones usan otros puntos habilitados."],
      ["¿El chaleco salvavidas es obligatorio?", "Sí. Debe usarse durante la navegación y existir uno adecuado para cada pasajero."],
      ["¿Cuál es la línea de Guardacostas en Colombia?", "La línea de emergencia de Guardacostas es la 146."],
    ],
    sources: [["Alcaldía de Cartagena: servicios turísticos autorizados y Muelle de La Bodeguita", safeBoating], ["Alcaldía de Cartagena: Zarpa Seguro", safeDeparture], ["DIMAR: recomendaciones y condiciones meteomarinas", dimar]],
    cardText: "Operador, muelle, chaleco, capacidad, clima y regreso: revisa estas señales antes de subir a una lancha en Cartagena.",
  },
  {
    slug: "navidad-cartagena-2026",
    title: "Navidad en Cartagena 2026: agenda y planes para diciembre",
    shortTitle: "Navidad en Cartagena 2026",
    description: "Guía de Navidad en Cartagena 2026: agenda cultural anunciada, mercadito, novenas, Festival del Pastel, clima y planes para familias o parejas.",
    keywords: "navidad cartagena 2026, diciembre cartagena eventos, que hacer cartagena navidad, mercadito navideño cartagena",
    category: "Diciembre 2026",
    categoryClass: "text-emerald-700",
    cardCategory: "actualidad destacado",
    image: "images/blog/navidad-cartagena-2026.webp",
    cardImage: "images/blog/navidad-cartagena-2026-card.webp",
    imageWidth: 1600,
    imageHeight: 900,
    alt: "Centro Histórico de Cartagena iluminado durante una noche de Navidad",
    reading: "8 min",
    intro: "Cartagena vive diciembre sin abrigos ni nieve: plazas coloniales, brisa del Caribe, gastronomía y actividades familiares. La agenda cultural 2026 anunciada por la Alcaldía incluye Super Navidad, Mercadito Navideño, Vive tu Plaza, novenas y el Festival del Pastel Cartagenero del 17 al 26 de diciembre.",
    notice: "La agenda marco está anunciada, pero lugares, horas y programación detallada pueden publicarse más cerca de diciembre. Confirma antes de desplazarte.",
    sections: [
      ["Qué eventos están anunciados para diciembre", `<p>La agenda cultural distrital contempla actividades de <strong>Super Navidad</strong>, <strong>Mercadito Navideño</strong>, <strong>Vive tu Plaza</strong>, novenas y el <strong>Festival del Pastel Cartagenero</strong> entre el 17 y el 26 de diciembre.</p><p>Cuando se publiquen los detalles, revisa si hay inscripción, aforo o cambios por clima.</p>`],
      ["Un itinerario de tres días", `<h3>Día 1: Centro y luces</h3><p>Recorre el Centro Histórico a última hora de la tarde, cena temprano y visita las plazas que tengan programación oficial.</p><h3>Día 2: mar con margen</h3><p>Elige un pasadía autorizado y confirma estado del mar. Diciembre inicia el periodo más seco, pero las condiciones marítimas pueden cambiar.</p><h3>Día 3: sabores cartageneros</h3><p>Reserva tiempo para cocina local y, si coincide con tus fechas, visita el Festival del Pastel.</p>`],
      ["Navidad con niños", `<p>Prioriza actividades tempranas, lleva hidratación y define un punto de encuentro. Combina una plaza o novena con una mañana de playa; evita jornadas demasiado largas bajo el sol.</p>`],
      ["Precios y reservas", `<p>Diciembre es temporada de alta demanda. Pide precio final, impuestos, tasas y política de cancelación. Si vas a la zona insular, revisa nuestra guía para <a href="../zarpar-seguro-islas-cartagena/">zarpar seguro</a> y compara las <a href="../../experiences.html">experiencias disponibles</a>.</p>`],
      ["Clima y equipaje", `<p>IDEAM ubica diciembre al inicio de la temporada más seca. Lleva ropa fresca, protección solar, calzado cómodo y una prenda liviana para aire acondicionado o brisa nocturna. No olvides una bolsa impermeable para los paseos marítimos.</p>`],
    ],
    faqs: [
      ["¿Qué eventos habrá en Navidad en Cartagena 2026?", "La agenda cultural anunciada incluye Super Navidad, Mercadito Navideño, Vive tu Plaza, novenas y Festival del Pastel Cartagenero."],
      ["¿Cuándo será el Festival del Pastel Cartagenero 2026?", "La agenda distrital lo programa del 17 al 26 de diciembre de 2026."],
      ["¿Diciembre es buen mes para visitar Cartagena?", "Sí. Empieza el periodo más seco y hay ambiente navideño, pero también mayor demanda, por lo que conviene reservar alojamiento y tours con anticipación."],
    ],
    sources: [["Alcaldía de Cartagena: agenda cultural 2026", culturalAgenda], ["IDEAM: características climáticas de Cartagena", ideamClimate]],
    cardText: "Luces, mercadito, novenas, Festival del Pastel y mar Caribe: organiza diciembre con la agenda anunciada para 2026.",
  },
  {
    slug: "festival-pastel-cartagenero-2026",
    title: "Festival del Pastel Cartagenero 2026: fechas y guía gastronómica",
    shortTitle: "Festival del Pastel Cartagenero 2026",
    description: "El Festival del Pastel Cartagenero 2026 está programado del 17 al 26 de diciembre. Descubre qué probar, cómo comprar y cómo organizar la visita.",
    keywords: "festival pastel cartagenero 2026, festival del pastel cartagena, comida tipica cartagena diciembre, pastel cartagenero",
    category: "Gastronomía local",
    categoryClass: "text-orange-700",
    cardCategory: "actualidad gastronomia",
    image: "images/cocinacaribe.webp",
    imageWidth: 1024,
    imageHeight: 1024,
    alt: "Cocinera del Caribe preparando comida tradicional cartagenera",
    reading: "7 min",
    event: { name: "Festival del Pastel Cartagenero 2026", startDate: "2026-12-17", endDate: "2026-12-26" },
    intro: "La agenda cultural de Cartagena programó el <strong>Festival del Pastel Cartagenero 2026 del 17 al 26 de diciembre</strong>. Es una oportunidad para probar uno de los sabores más representativos de la Navidad local y apoyar a cocineras y cocineros tradicionales.",
    notice: "Las fechas están incluidas en la agenda cultural 2026. El lugar, horarios, participantes y precios deben confirmarse cuando la Alcaldía publique la programación detallada.",
    sections: [
      ["¿Qué es el pastel cartagenero?", `<p>Es una preparación envuelta en hoja, elaborada con arroz sazonado, carnes y otros ingredientes que varían según la receta familiar. Más que un plato aislado, forma parte de la memoria culinaria decembrina del Caribe colombiano.</p>`],
      ["Cómo disfrutar el festival", `<ul><li>Ve con tiempo para comparar preparaciones.</li><li>Pregunta ingredientes si tienes alergias.</li><li>Compra porciones pequeñas antes de elegir tu favorita.</li><li>Lleva un método de pago alternativo por si falla la señal.</li><li>Deposita residuos en los puntos habilitados.</li></ul>`],
      ["Qué debes preguntar antes de comprar", `<p>Consulta el tipo de proteína, si contiene cerdo, el nivel de picante y el tamaño de la porción. Si llevas el producto al alojamiento, pregunta cómo conservarlo y durante cuánto tiempo.</p>`],
      ["Combínalo con una ruta gastronómica", `<p>Prueba también pescado, arroz con coco, carimañolas, arepa de huevo y dulces tradicionales. Nuestra guía de <a href="../gastronomia-cartagena/">gastronomía de Cartagena</a> te ayuda a distinguir platos y contextos.</p>`],
      ["Plan para diciembre", `<p>Visita el festival después de una mañana tranquila, no inmediatamente después de un pasadía con almuerzo incluido. Revisa la guía de <a href="../navidad-cartagena-2026/">Navidad en Cartagena 2026</a> para combinarlo con plazas, luces y actividades familiares.</p>`],
    ],
    faqs: [
      ["¿Cuándo es el Festival del Pastel Cartagenero 2026?", "La agenda cultural de Cartagena lo programa del 17 al 26 de diciembre de 2026."],
      ["¿El pastel cartagenero es dulce?", "No necesariamente. Es una preparación salada envuelta en hoja, basada en arroz sazonado y carnes; las recetas varían entre cocineras y familias."],
      ["¿Ya se conoce el lugar del festival 2026?", "La agenda marco confirma las fechas, pero conviene esperar el anuncio detallado de la Alcaldía para lugar, horarios y participantes."],
    ],
    sources: [["Alcaldía de Cartagena: agenda cultural 2026", culturalAgenda]],
    cardText: "Del 17 al 26 de diciembre: conoce este símbolo de la cocina navideña cartagenera y cómo aprovechar la visita.",
  },
  {
    slug: "temporada-lluvias-cartagena-tours",
    title: "Temporada de lluvias en Cartagena: ¿se cancelan los tours?",
    shortTitle: "Temporada de lluvias y tours",
    description: "Conoce cuándo llueve más en Cartagena, qué condiciones sí cancelan un tour marítimo, cómo funcionan las restricciones y qué plan alternativo preparar.",
    keywords: "temporada lluvias cartagena, tours cartagena lluvia, cancelan tours islas rosario lluvia, clima cartagena viajes",
    category: "Clima y tours",
    categoryClass: "text-sky-700",
    cardCategory: "actualidad guia",
    image: "images/city-bahia.webp",
    imageWidth: 1200,
    imageHeight: 800,
    alt: "Bahía de Cartagena bajo un cielo variable del Caribe",
    reading: "8 min",
    intro: "Una nube oscura no significa automáticamente que se canceló tu pasadía. En Cartagena, las decisiones marítimas dependen de viento, oleaje, tormentas eléctricas, visibilidad y órdenes de la Capitanía de Puerto. La lluvia es solo una parte del panorama.",
    notice: "Solo la autoridad marítima y el operador responsable pueden confirmar una salida. No presiones a una tripulación para navegar cuando existe restricción.",
    sections: [
      ["Cuándo llueve más", `<p>IDEAM describe un periodo de lluvias más frecuentes entre mayo y noviembre. En esos meses puede haber de 10 a 15 días con lluvia, y octubre suele concentrar más episodios. Aun así, el patrón puede ser de aguaceros cortos seguidos por sol.</p>`],
      ["Lluvia no es lo mismo que mala mar", `<p>Un tour puede operar con lluvia ligera si las condiciones de navegación son seguras. También puede suspenderse con cielo despejado si hay oleaje o viento peligroso mar afuera. Por eso el estado del mar importa más que una aplicación genérica del clima.</p>`],
      ["Qué preguntar sobre cancelaciones", `<ul><li>¿Quién decide si no se puede zarpar?</li><li>¿Hay reprogramación o devolución?</li><li>¿Qué ocurre con tasa portuaria y transporte?</li><li>¿Cuándo se confirma la salida?</li><li>¿Existe alternativa terrestre o urbana?</li></ul>`],
      ["Plan B para un día de lluvia", `<p>Reserva una experiencia cultural, visita museos, prueba cocina local o recorre espacios cubiertos del Centro. Mantén una franja libre en el itinerario para mover la navegación al día siguiente.</p>`],
      ["Cómo empacar", `<p>Usa bolsa impermeable, ropa de secado rápido y calzado con agarre. Protege medicinas y documentos. Consulta el <a href="../horarios-playas-cartagena-2026/">estado y horario de las playas</a> y las pautas para <a href="../zarpar-seguro-islas-cartagena/">zarpar seguro</a>.</p>`],
    ],
    faqs: [
      ["¿Un tour a las islas se cancela si llueve?", "No necesariamente. La salida depende de las condiciones meteomarinas y de las instrucciones de la autoridad marítima, no solo de la lluvia."],
      ["¿Cuál es el mes más lluvioso en Cartagena?", "IDEAM señala octubre como el mes con mayor frecuencia de lluvia dentro del patrón climático general de Cartagena."],
      ["¿Qué hago si cierran las playas?", "Respeta el cierre, contacta a tu operador para reprogramar y cambia a una actividad cultural, gastronómica o urbana."],
    ],
    sources: [["IDEAM: características climáticas de Cartagena", ideamClimate], ["DIMAR: condiciones meteomarinas y recomendaciones", dimar], ["Alcaldía de Cartagena: ejemplo de cierre preventivo de playas", beachClosure]],
    cardText: "Lluvia, oleaje y restricciones no son lo mismo. Aprende cuándo puede salir una lancha y qué preguntar antes de pagar.",
  },
  {
    slug: "calendario-eventos-cartagena-2026",
    title: "Calendario de eventos en Cartagena 2026: octubre a diciembre",
    shortTitle: "Eventos en Cartagena 2026",
    description: "Calendario actualizado de eventos de Cartagena entre octubre y diciembre de 2026: preludios, Independencia, Festival Náutico, Navidad y Festival del Pastel.",
    keywords: "eventos cartagena 2026, calendario cartagena octubre noviembre diciembre, festivales cartagena 2026, que hacer cartagena fin de año",
    category: "Agenda local",
    categoryClass: "text-violet-700",
    cardCategory: "actualidad destacado",
    image: "images/cartagena.webp",
    imageWidth: 1400,
    imageHeight: 787,
    alt: "Vista panorámica de Cartagena de Indias para agenda de eventos 2026",
    reading: "9 min",
    intro: "La recta final de 2026 reúne algunos de los mejores motivos para viajar a Cartagena: preludios en octubre, las Fiestas de Independencia en noviembre y una agenda navideña que termina con el Festival del Pastel. Este calendario resume lo ya anunciado y te ayuda a elegir semana según el tipo de viaje.",
    notice: "Usa esta guía como calendario de planificación. Confirma horarios, lugares, aforos y cierres en los canales oficiales antes de asistir.",
    sections: [
      ["Octubre: preludios de Independencia", `<ul><li><strong>2 de octubre:</strong> Preludio Cultural Universitario.</li><li><strong>9 de octubre:</strong> Primer Preludio.</li><li><strong>16 de octubre:</strong> Segundo Preludio.</li><li><strong>23 de octubre:</strong> Tercer Preludio.</li><li><strong>30 de octubre:</strong> Noche de Candela.</li></ul><p>Octubre suele ser lluvioso, así que incluye alternativas cubiertas y traslados con margen.</p>`],
      ["Noviembre: el mes grande", `<p>El 1 comienza Ángeles Somos y del 1 al 4 se programa el Festival Regional de Gaitas. El 11 son los actos solemnes, el 12 el Gran Desfile, el 13 y 14 el Festival Náutico, el 14 el Cabildo de Getsemaní y el 15 la coronación.</p><p>Lee el <a href="../fiestas-independencia-cartagena-2026/">calendario detallado de las Fiestas de Independencia</a>.</p>`],
      ["Diciembre: Navidad y cocina tradicional", `<p>La agenda anunciada incluye Super Navidad, Mercadito Navideño, Vive tu Plaza, novenas y el Festival del Pastel Cartagenero del 17 al 26 de diciembre. Consulta nuestra <a href="../navidad-cartagena-2026/">guía de Navidad 2026</a>.</p>`],
      ["Qué mes elegir", `<ul><li><strong>Octubre:</strong> cultura barrial y preludios, con mayor probabilidad de lluvia.</li><li><strong>Noviembre:</strong> máximo ambiente festivo y eventos de identidad cartagenera.</li><li><strong>Diciembre:</strong> temporada más seca, Navidad y alta demanda turística.</li></ul>`],
      ["Cómo reservar alrededor de un evento", `<p>No programes todos los desplazamientos en horas de desfile. Revisa cierres viales y <a href="../pico-y-placa-cartagena-2026/">pico y placa</a>. Para mar, confirma condiciones y muelle. Escoge en <a href="../../experiences.html">Experiencias</a> un plan con información clara y soporte por WhatsApp.</p>`],
    ],
    faqs: [
      ["¿Qué eventos hay en Cartagena en noviembre de 2026?", "Las Fiestas de Independencia incluyen Gran Desfile el 12, Festival Náutico el 13 y 14, Cabildo de Getsemaní el 14 y coronación el 15."],
      ["¿Qué hay en Cartagena en diciembre de 2026?", "La agenda cultural contempla Super Navidad, Mercadito Navideño, Vive tu Plaza, novenas y Festival del Pastel del 17 al 26."],
      ["¿Cuándo empiezan los preludios de las Fiestas de Independencia?", "La agenda 2026 anuncia el Preludio Cultural Universitario para el 2 de octubre y preludios posteriores los días 9, 16 y 23."],
    ],
    sources: [["Alcaldía de Cartagena: agenda cultural 2026", culturalAgenda], ["Alcaldía de Cartagena: programación de las Fiestas de Independencia", officialAgenda]],
    cardText: "Preludios, Fiestas de Independencia, Festival Náutico, Navidad y gastronomía: el calendario para elegir tu mejor semana.",
  },
];

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function schema(article) {
  const url = `https://dunasyolas.com/blog/${article.slug}/`;
  const graph = [
    {
      "@type": "BlogPosting",
      headline: article.title,
      description: article.description,
      datePublished: today,
      dateModified: today,
      inLanguage: "es-CO",
      url,
      mainEntityOfPage: url,
      image: `https://dunasyolas.com/${article.image}`,
      author: { "@type": "Person", name: "Nohemi", url: "https://dunasyolas.com/about" },
      publisher: { "@type": "Organization", name: "Dunas & Olas", logo: { "@type": "ImageObject", url: "https://dunasyolas.com/images/logo-badge.png" } },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://dunasyolas.com/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://dunasyolas.com/blog/" },
        { "@type": "ListItem", position: 3, name: article.shortTitle, item: url },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: article.faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })),
    },
  ];
  if (article.event) {
    graph.push({
      "@type": "Event",
      name: article.event.name,
      startDate: article.event.startDate,
      endDate: article.event.endDate,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Place", name: "Cartagena de Indias", address: { "@type": "PostalAddress", addressLocality: "Cartagena", addressRegion: "Bolívar", addressCountry: "CO" } },
      image: `https://dunasyolas.com/${article.image}`,
      description: article.description,
      organizer: { "@type": "Organization", name: "Alcaldía Mayor de Cartagena de Indias", url: "https://www.cartagena.gov.co/" },
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2).replace(/</g, "\\u003c");
}

function articleHtml(article) {
  const sourceItems = article.sources.map(([label, href]) => `<li><a href="${href}" target="_blank" rel="noopener noreferrer">${esc(label)}</a></li>`).join("");
  const sections = article.sections.map(([heading, html]) => `<section><h2>${heading}</h2>${html}</section>`).join("\n");
  const faqs = article.faqs.map(([q, a]) => `<div class="faq-item"><h3>${esc(q)}</h3><p>${esc(a)}</p></div>`).join("");
  const eventImageNote = article.image.includes("images/blog/") ? `<figcaption>Imagen editorial ilustrativa creada para esta guía de Dunas & Olas.</figcaption>` : "";
  return `<!doctype html>
<html lang="es-CO">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${esc(article.title)} | Dunas & Olas</title>
  <meta name="description" content="${esc(article.description)}"/>
  <meta name="keywords" content="${esc(article.keywords)}"/>
  <meta name="author" content="Nohemi, Dunas & Olas"/>
  <meta name="robots" content="index,follow,max-image-preview:large"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="${esc(article.title)}"/>
  <meta property="og:description" content="${esc(article.description)}"/>
  <meta property="og:url" content="https://dunasyolas.com/blog/${article.slug}/"/>
  <meta property="og:image" content="https://dunasyolas.com/${article.image}"/>
  <meta property="og:image:width" content="${article.imageWidth}"/>
  <meta property="og:image:height" content="${article.imageHeight}"/>
  <meta property="og:site_name" content="Dunas & Olas"/>
  <meta property="article:published_time" content="${today}T08:00:00-05:00"/>
  <meta property="article:modified_time" content="${today}T08:00:00-05:00"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${esc(article.title)}"/>
  <meta name="twitter:description" content="${esc(article.description)}"/>
  <meta name="twitter:image" content="https://dunasyolas.com/${article.image}"/>
  <link rel="canonical" href="https://dunasyolas.com/blog/${article.slug}/"/>
  <link rel="alternate" hreflang="es-CO" href="https://dunasyolas.com/blog/${article.slug}/"/>
  <link rel="alternate" hreflang="x-default" href="https://dunasyolas.com/blog/${article.slug}/"/>
  <link rel="icon" href="../../images/favicon-circle.png" type="image/png"/>
  <link rel="apple-touch-icon" href="../../images/favicon-circle.png"/>
  <meta name="theme-color" content="#102535"/>
  <link href="../../css/tailwind.css" rel="stylesheet"/>
  <link rel="preload" href="../../css/fontawesome-local.min.css?v=20260911a" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
  <noscript><link rel="stylesheet" href="../../css/fontawesome-local.min.css?v=20260911a"/></noscript>
  <link rel="stylesheet" href="../../css/brand-refresh.css?v=20260911a"/>
  <script type="application/ld+json">${schema(article)}</script>
  <style>
    :root{--ink:#102535;--gold:#d5aa22;--teal:#0f8f9d;--paper:#f7f3ed}
    body{font-family:"Montserrat",sans-serif;background:var(--paper);color:var(--ink)}
    .article-hero{padding-top:7rem;background:#102535;color:#fff}
    .article-hero img{width:100%;height:clamp(280px,48vw,610px);object-fit:cover}
    .article-shell{max-width:1180px;margin:0 auto;padding:3.5rem 1.5rem;display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:2.5rem}
    .article-content{background:#fff;border-radius:24px;padding:clamp(1.4rem,4vw,3.4rem);box-shadow:0 20px 55px rgba(16,37,53,.08)}
    .article-content p,.article-content li{font-size:1.05rem;line-height:1.85;color:#405466}
    .article-content p{margin:0 0 1.35rem}.article-content ul,.article-content ol{padding-left:1.4rem;margin:0 0 1.5rem}
    .article-content li{margin:.45rem 0}.article-content h2{font-family:Georgia,serif;font-size:clamp(1.65rem,3vw,2.25rem);line-height:1.2;margin:2.6rem 0 1rem;color:#102535}
    .article-content h3{font-size:1.15rem;font-weight:800;margin:1.5rem 0 .55rem;color:#19364a}
    .article-content a{color:#087f8c;text-decoration:underline;text-underline-offset:3px;font-weight:650}
    .article-content table{width:100%;border-collapse:collapse;margin:1.2rem 0 1.8rem;font-size:.98rem}.article-content th,.article-content td{padding:.85rem .75rem;border-bottom:1px solid #dbe4e8;text-align:left;vertical-align:top}.article-content th{background:#edf7f6;color:#102535;font-weight:800}.article-content tr:last-child td{border-bottom:0}
    .notice,.tip-box{border-radius:16px;padding:1.1rem 1.25rem;margin:1.5rem 0}.notice{background:#fff4cf;border:1px solid #e7c655;color:#5b4810}.tip-box{background:#eaf8f7;border-left:5px solid #0f8f9d}
    .notice p,.tip-box p{margin:0;color:inherit}.schedule-grid{display:grid;gap:.55rem}.schedule-grid p{margin:0;padding:.7rem 1rem;background:#f7f3ed;border-radius:10px}
    .article-cover{margin:1.75rem 0 0}.article-cover figcaption{font-size:.75rem;color:#718096;margin-top:.45rem;text-align:center}
    .faq-item{border-bottom:1px solid #dbe4e8;padding:0 0 1rem;margin-bottom:1.1rem}.faq-item:last-child{border-bottom:0}
    .source-list{word-break:break-word}.source-list li{margin:.7rem 0}.source-list a{font-weight:600}
    .side-card{position:sticky;top:7.5rem;background:#102535;color:#fff;padding:1.7rem;border-radius:22px;box-shadow:0 18px 42px rgba(16,37,53,.18)}
    .side-card p{color:#d7e0e6;line-height:1.65}.side-card a{display:flex;justify-content:center;align-items:center;text-align:center;padding:.9rem 1rem;border-radius:999px;font-weight:800;margin-top:.8rem}
    .side-card .primary{background:#d5aa22;color:#102535}.side-card .whatsapp{background:#21c968;color:#fff}
    .meta-row{display:flex;flex-wrap:wrap;justify-content:center;gap:.8rem;color:#d9e4ea;font-size:.9rem;margin-top:1rem}
    .breadcrumb{max-width:1180px;margin:0 auto;padding:1rem 1.5rem;font-size:.82rem;color:#617584}.breadcrumb a{color:#087f8c}
    @media(max-width:900px){.article-shell{grid-template-columns:1fr}.side-card{position:static}.article-hero{padding-top:5.8rem}.article-content{border-radius:18px}.article-hero h1{font-size:2.3rem}}
    @media(max-width:520px){.article-shell{padding:2rem .85rem}.article-hero h1{font-size:1.95rem}.article-content p,.article-content li{font-size:1rem}.article-content{padding:1.25rem}.article-hero img{height:250px}.article-content table{font-size:.88rem}.article-content th,.article-content td{padding:.65rem .45rem}}
  </style>
</head>
<body>
  <nav class="fixed w-full z-50 bg-gray-900 text-white shadow-lg py-[2.5px]">
    <div class="container mx-auto px-6 flex justify-between items-center">
      <a href="../../index.html" class="flex items-center gap-2 z-50"><img src="../../images/logo-icon-nav-small.webp" alt="Dunas & Olas, agencia de tours en Cartagena" width="184" height="83" class="h-11 w-auto object-contain" loading="eager" decoding="async"/><span class="leading-none"><span class="block font-extrabold tracking-tight text-2xl text-white">Dunas <span class="text-yellow-500">&amp; Olas</span></span><span class="block text-[9px] uppercase tracking-[.28em] text-yellow-300 font-semibold mt-1">Mexicana en Cartagena</span></span></a>
      <div class="hidden md:flex gap-7 text-sm font-semibold uppercase items-center"><a href="../../index.html">Inicio</a><a href="../../experiences.html">Experiencias</a><a href="../../galeria.html">Galería</a><a href="../../about.html">Nosotros</a><a href="../index.html" class="text-yellow-300">Blog</a><a href="../../arma-tu-viaje.html" class="btn-primary px-5 py-3">Arma tu viaje</a></div>
      <button aria-label="Abrir menú" id="mobile-menu-btn" class="md:hidden text-white"><i class="fas fa-bars text-2xl"></i></button>
    </div>
  </nav>
  <div id="mobile-menu" class="fixed inset-0 bg-gray-900/95 z-[10000] hidden flex flex-col justify-center items-center gap-8 opacity-0 transition-opacity"><a href="../../index.html" class="text-2xl font-bold text-white">Inicio</a><a href="../../experiences.html" class="text-2xl font-bold text-white">Experiencias</a><a href="../../galeria.html" class="text-2xl font-bold text-white">Galería</a><a href="../../about.html" class="text-2xl font-bold text-white">Nosotros</a><a href="../index.html" class="text-2xl font-bold text-white">Blog</a><button aria-label="Cerrar menú" id="close-menu-btn" class="absolute top-6 right-6 text-white text-3xl"><i class="fas fa-times"></i></button></div>
  <header class="article-hero">
    <div class="max-w-5xl mx-auto text-center px-6 pb-9"><span class="text-yellow-300 font-bold uppercase tracking-[.16em] text-xs">${esc(article.category)}</span><h1 class="font-serif text-4xl md:text-6xl font-bold leading-tight mt-4">${esc(article.title)}</h1><div class="meta-row"><span>Por Nohemi</span><span>Actualizado: 12 de agosto de 2026</span><span>${article.reading} de lectura</span></div></div>
    <figure class="article-cover max-w-[1600px] mx-auto"${article.coverStyle ? ` style="${article.coverStyle}"` : ""}><img src="../../${article.image}" alt="${esc(article.alt)}" width="${article.imageWidth}" height="${article.imageHeight}" loading="eager" decoding="async" fetchpriority="high"${article.imageStyle ? ` style="${article.imageStyle}"` : ""}/>${eventImageNote}</figure>
  </header>
  <nav class="breadcrumb" aria-label="Migas de pan"><a href="../../index.html">Inicio</a> / <a href="../index.html">Blog</a> / <span>${esc(article.shortTitle)}</span></nav>
  <main class="article-shell">
    <article class="article-content">
      <p class="text-xl leading-relaxed text-slate-700">${article.intro}</p>
      <div class="notice"><p><strong>Información vigente al 12 de agosto de 2026:</strong> ${article.notice}</p></div>
      ${sections}
      <section><h2>Preguntas frecuentes</h2>${faqs}</section>
      <section><h2>Fuentes oficiales consultadas</h2><p>Actualizamos esta guía con información institucional. Abre las fuentes para comprobar cualquier cambio posterior a la fecha de actualización.</p><ul class="source-list">${sourceItems}</ul></section>
      <p class="mt-10 pt-6 border-t border-gray-200 text-sm"><em>Guía preparada por Nohemi y el equipo de Dunas & Olas, con experiencia local en Cartagena de Indias.</em></p>
    </article>
    <aside><div class="side-card"><p class="text-yellow-300 font-bold uppercase tracking-wider text-xs">Tu viaje, bien pensado</p><h2 class="text-2xl font-bold mt-2">¿Quieres organizar Cartagena sin adivinar?</h2><p class="mt-3">Cuéntanos tus fechas y te orientamos sobre tours, tiempos, costos y condiciones reales.</p><a class="primary" href="../../experiences.html">Ver experiencias</a><a class="whatsapp" href="https://wa.me/573163030589?text=${encodeURIComponent(`Hola, vengo desde la web de Dunas y Olas y quiero más información sobre ${article.shortTitle}.`)}" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp mr-2"></i>Hablar con Nohemi</a></div></aside>
  </main>
  <footer class="bg-gray-900 text-white py-12"><div class="container mx-auto px-6 text-center"><img src="../../images/logo-icon-nav-small.webp" alt="Dunas & Olas" width="184" height="83" class="h-14 w-auto mx-auto mb-3" loading="lazy" decoding="async"/><p>Mexicana en Cartagena · RNT No. 292710</p><p class="text-gray-400 text-sm mt-3"><a href="../../policies.html">Términos</a> · <a href="../../privacy.html">Privacidad</a> · <a href="../../faq.html">Preguntas frecuentes</a></p></div></footer>
  <div class="whatsapp-container"><button id="wa-main-btn" onclick="openWhatsApp('Hola, vengo desde la web de Dunas y Olas y quiero más información sobre ${esc(article.shortTitle)}.')" class="whatsapp-float" aria-label="Contactar a Dunas y Olas por WhatsApp"><img src="../../images/WhatsApp-96.webp" alt="WhatsApp" class="whatsapp-icon" width="96" height="96" loading="lazy" decoding="async"/><span class="whatsapp-text">Contactar / Contact</span></button></div>
  <script>const WHATSAPP_NUMBER="573163030589";function openWhatsApp(msg){window.open("https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(msg),"_blank","noopener")};document.getElementById("mobile-menu-btn")?.addEventListener("click",()=>{const m=document.getElementById("mobile-menu");m.classList.remove("hidden");setTimeout(()=>m.classList.remove("opacity-0"),10)});document.getElementById("close-menu-btn")?.addEventListener("click",()=>{const m=document.getElementById("mobile-menu");m.classList.add("opacity-0");setTimeout(()=>m.classList.add("hidden"),250)});</script>
  <script src="../../js/currency.js"></script><script src="../../js/site-refresh.js?v=20260911a" defer></script>
</body>
</html>`;
}

function blogCard(article) {
  const image = article.cardImage || article.image;
  const width = article.cardImage ? 720 : article.imageWidth;
  const height = article.cardImage ? 405 : article.imageHeight;
  return `<article data-category="${article.cardCategory}" class="group bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col h-full relative">
          <a href="/blog/${article.slug}/" class="absolute inset-0 z-10" aria-label="Leer ${esc(article.shortTitle)}"></a>
          <div class="h-56 overflow-hidden card-image-container relative"><img src="../${image}" alt="${esc(article.alt)}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" width="${width}" height="${height}" loading="lazy" decoding="async"/><span class="absolute left-4 top-4 rounded-full bg-slate-900/85 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Nuevo · 2026</span></div>
          <div class="p-6 flex flex-col flex-grow"><span class="text-xs font-bold uppercase tracking-wide ${article.categoryClass}">${esc(article.category)}</span><h2 class="font-serif font-bold text-2xl text-slate-900 mt-2 mb-3 leading-tight">${esc(article.shortTitle)}</h2><p class="text-slate-600 text-sm leading-relaxed flex-grow">${esc(article.cardText)}</p><span class="mt-5 font-bold text-teal-700">Leer guía <i class="fas fa-arrow-right ml-2"></i></span></div>
        </article>`;
}

function updateBlogIndex() {
  const file = path.join(root, "blog", "index.html");
  let html = fs.readFileSync(file, "utf8");
  const start = "<!-- CURRENT-2026-ARTICLES:START -->";
  const end = "<!-- CURRENT-2026-ARTICLES:END -->";
  html = html.replace(new RegExp(`${start}[\\s\\S]*?${end}\\s*`, "g"), "");
  const gridTag = '<div id="articles-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">';
  html = html.replace(gridTag, `${gridTag}\n        ${start}\n        ${articles.map(blogCard).join("\n        ")}\n        ${end}`);
  if (!html.includes('data-filter="actualidad"')) {
    html = html.replace(/(<button data-filter="todos"[^>]*>Todos<\/button>)/, `$1\n        <button data-filter="actualidad" class="filter-btn px-5 py-2 rounded-full text-sm font-bold border-2 border-teal-300 text-teal-800 bg-teal-50 hover:bg-teal-700 hover:text-white hover:border-teal-700 transition">Actualidad 2026</button>`);
  }
  fs.writeFileSync(file, html, "utf8");
}

function homeCard(article) {
  const image = article.cardImage || article.image;
  const width = article.cardImage ? 720 : article.imageWidth;
  const height = article.cardImage ? 405 : article.imageHeight;
  return `<article class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-100">
            <a href="blog/${article.slug}/" class="block h-full">
              <div class="overflow-hidden h-52 relative"><img src="${image}" alt="${esc(article.alt)}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" width="${width}" height="${height}" decoding="async" loading="lazy"/><span class="absolute left-4 top-4 rounded-full bg-slate-900/85 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Actualizado 2026</span></div>
              <div class="p-5"><span class="text-xs font-bold uppercase tracking-wide ${article.categoryClass}">${esc(article.category)}</span><h3 class="font-serif font-bold text-xl text-gray-900 mt-1 mb-2 leading-snug group-hover:text-teal-700 transition-colors">${esc(article.shortTitle)}</h3><p class="text-gray-500 text-sm leading-relaxed">${esc(article.cardText)}</p></div>
            </a>
          </article>`;
}

function updateHomepage() {
  const file = path.join(root, "index.html");
  let html = fs.readFileSync(file, "utf8");
  const section = `<!-- Blog Preview -->
    <section class="py-20 bg-white" aria-labelledby="actualidad-cartagena-title">
      <div class="container mx-auto px-6">
        <div class="text-center mb-12"><span class="text-teal-700 font-bold text-sm uppercase tracking-wide mb-2 block">Cartagena al día</span><h2 id="actualidad-cartagena-title" class="font-serif text-3xl md:text-4xl font-bold text-gray-900">Agenda y datos útiles para viajar en 2026</h2><p class="text-gray-500 mt-3 max-w-2xl mx-auto">Fechas confirmadas, normas locales y recomendaciones verificadas para organizar tu viaje con información reciente.</p></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">${articles.slice(0, 7).filter((_, index) => index !== 5).map(homeCard).join("\n")}</div>
        <div class="text-center"><a href="blog/index.html" class="btn-outline px-8">Ver todas las guías de Cartagena</a></div>
      </div>
    </section>

    `;
  html = html.replace(/<!-- Blog Preview -->[\s\S]*?(?=<!-- FAQ SEO -->)/, section);
  fs.writeFileSync(file, html, "utf8");
}

function updateSitemap() {
  const file = path.join(root, "sitemap.xml");
  let xml = fs.readFileSync(file, "utf8");
  const start = "<!-- CURRENT-2026-BLOG:START -->";
  const end = "<!-- CURRENT-2026-BLOG:END -->";
  xml = xml.replace(new RegExp(`${start}[\\s\\S]*?${end}\\s*`, "g"), "");
  const entries = articles.map((article, index) => `  <url>
    <loc>https://dunasyolas.com/blog/${article.slug}/</loc>
    <xhtml:link rel="alternate" hreflang="es-CO" href="https://dunasyolas.com/blog/${article.slug}/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://dunasyolas.com/blog/${article.slug}/"/>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${index < 3 ? "0.9" : "0.8"}</priority>
  </url>`).join("\n");
  xml = xml.replace("</urlset>", `${start}\n${entries}\n${end}\n</urlset>`);
  fs.writeFileSync(file, xml, "utf8");
}

function buildCurrentBlog() {
  for (const article of articles) {
    const dir = path.join(root, "blog", article.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), articleHtml(article), "utf8");
  }
  updateBlogIndex();
  updateHomepage();
  updateSitemap();
}

if (require.main === module) buildCurrentBlog();

module.exports = { articles, articleHtml, blogCard, buildCurrentBlog };
