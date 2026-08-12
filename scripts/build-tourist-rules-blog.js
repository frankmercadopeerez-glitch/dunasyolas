const fs = require("fs");
const path = require("path");
const { articleHtml, blogCard } = require("./build-current-blog");

const root = path.resolve(__dirname, "..");
const today = "2026-08-12";

const sources = {
  parkInsurance: "https://www.parquesnacionales.gov.co/sala-prensa/noticias/avanza-seguro-obligatorio-para-turistas-en-corales-del-rosario/",
  parkPage: "https://www.parquesnacionales.gov.co/nuestros-parques/pnn-corales-del-rosario-y-de-san-bernardo/",
  rnt: "https://www.mincit.gov.co/minturismo/analisis-sectorial-y-promocion/registro-nacional-de-turismo/que-es-el-registro-nacional-de-turismo",
  rntMain: "https://www.mincit.gov.co/minturismo/analisis-sectorial-y-promocion/registro-nacional-de-turismo",
  sicTourist: "https://sedeelectronica.sic.gov.co/temas/proteccion-al-consumidor/informativa/consumidor-turista",
  sicPrice: "https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/concepto/los-precios-de-servicios-turisticos-deben-ser-definitivos-y-completos-desde-el-primer-contacto-con-el",
  sicRights: "https://sedeelectronica.sic.gov.co/temas/proteccion-al-consumidor/consumo-seguro/campanas-de-seguridad/recomendaciones-advertencias/Turismo",
  titan: "https://www.cartagena.gov.co/noticias/alcaldia-cartagena-resuelve-caso-cobro-excesivo-turistas-garantiza-trato-justo",
  touristChannels: "https://www.cartagena.gov.co/noticias/cartagena-fortalece-sus-canales-atencion-para-reportar-situaciones-irregulares-el-sector-turistico",
  dimarSafety: "https://www.dimar.mil.co/capitania-de-puerto-de-cartagena-continua-campana-de-seguridad-integral-maritima",
  dimarMarinas: "https://www.dimar.mil.co/node/4729/printable/print",
  cartagenaSeason: "https://www.cartagena.gov.co/noticias/contratar-servicios-turisticos-autorizados-zarpar-desde-el-muelle-bodeguita-acudir-canales-atencion-denuncias-recomendaciones-distrito-temporada-turistica-mas-importante-ano",
};

const articles = [
  {
    slug: "cuanto-cuesta-tour-islas-del-rosario-2026",
    title: "¿Cuánto cuesta un tour a las Islas del Rosario en 2026? Precios desde Cartagena",
    shortTitle: "Precios de tours a Islas del Rosario 2026",
    description: "Precios de tours a las Islas del Rosario desde Cartagena en 2026: tarifas de referencia, qué incluyen, costos adicionales y cómo comparar un pasadía.",
    keywords: "cuanto cuesta tour islas del rosario 2026, precio tour islas del rosario cartagena, pasadia islas del rosario precio, tour 5 islas precio",
    category: "Precios 2026",
    categoryClass: "text-emerald-700",
    cardCategory: "normativa guia islas destacado",
    image: "images/backpackers/tour-5-islas-vip/01.webp",
    imageWidth: 1024,
    imageHeight: 767,
    alt: "Vista aérea del mar y los arrecifes de las Islas del Rosario cerca de Cartagena",
    reading: "10 min",
    intro: "Si buscas <strong>cuánto cuesta un tour a las Islas del Rosario desde Cartagena</strong>, la respuesta depende menos del nombre del plan y más de sus paradas, tipo de embarcación, alimentación y actividades. Aquí comparamos precios publicados en Dunas & Olas y te explicamos qué preguntar antes de pagar.",
    notice: "Los precios son referencias publicadas por Dunas & Olas al 12 de agosto de 2026 y pueden cambiar por fecha, cupo, condiciones marítimas o proveedor. Solicita siempre el total definitivo antes de reservar.",
    sections: [
      ["Respuesta rápida: precio de un tour a Islas del Rosario", `<div class="tip-box"><p><strong>Un tour compartido a las Islas del Rosario cuesta aproximadamente entre $250.000 y $385.000 COP por persona</strong> en las opciones comparadas para 2026. Los recorridos de cinco islas se encuentran desde $270.000 COP; los planes VIP, desde $320.000 COP. El valor final depende de lo incluido.</p></div>`],
      ["Tabla de precios de referencia 2026", `<table><thead><tr><th>Experiencia</th><th>Desde</th><th>Enfoque</th></tr></thead><tbody><tr><td>Buceo y snorkel</td><td><strong>$250.000 COP</strong></td><td>Actividad acuática y arrecife</td></tr><tr><td>Tour 5 Islas Standard</td><td><strong>$270.000 COP</strong></td><td>Recorrido compartido por varias paradas</td></tr><tr><td>Islas + Oceanario</td><td><strong>$280.000 COP</strong></td><td>Pasadía con visita al Oceanario</td></tr><tr><td>4 Islas + atardecer</td><td><strong>$300.000 COP</strong></td><td>Islas y cierre en la bahía</td></tr><tr><td>Tour 5 Islas VIP</td><td><strong>$320.000 COP</strong></td><td>Lancha deportiva y plan mejorado</td></tr><tr><td>Pasadía Isla Lizamar</td><td><strong>$385.000 COP</strong></td><td>Instalaciones, piscina y almuerzo buffet</td></tr></tbody></table><p>Compara las fichas actualizadas en nuestra <a href="../../experiences.html">página de experiencias en Cartagena</a>.</p>`],
      ["¿Qué suele incluir el precio?", `<p>Un pasadía puede incluir transporte marítimo, guía, almuerzo, una silla o zona de descanso y algunas actividades. Sin embargo, dos planes con nombres parecidos pueden tener servicios diferentes. Confirma por escrito:</p><ul><li>muelle y hora de salida;</li><li>número y duración aproximada de las paradas;</li><li>tipo de lancha y capacidad;</li><li>almuerzo, bebida y restricciones alimentarias;</li><li>snorkel, Oceanario, cama de playa u otras actividades;</li><li>recogida en hotel y condiciones de regreso.</li></ul>`],
      ["Costos que debes revisar antes de pagar", `<p>Pregunta si el precio ya contempla tasa o impuesto de muelle, entrada al área protegida, <a href="../seguro-obligatorio-islas-rosario-san-bernardo-2026/">seguro obligatorio de accidentes y asistencia</a>, alquiler de equipos, fotografías, actividades opcionales y consumos en playa. La SIC indica que el precio informado debe ser definitivo y completo desde el primer contacto, incluidos impuestos, tasas y cargos adicionales que resulten aplicables.</p>`],
      ["¿Por qué un tour barato puede terminar costando más?", `<p>Una tarifa inicial baja puede excluir el almuerzo, el seguro, la tasa portuaria o el ingreso a una actividad. También puede ofrecer menos tiempo de playa o una embarcación distinta. No elijas solo por el número grande del anuncio: compara el <strong>costo total por persona</strong> y el tiempo real de disfrute.</p>`],
      ["Cómo elegir según tu presupuesto", `<ul><li><strong>Hasta $280.000 COP:</strong> recorridos compartidos y actividades concretas.</li><li><strong>Entre $300.000 y $350.000 COP:</strong> circuitos de varias islas o modalidad VIP.</li><li><strong>Desde $385.000 COP:</strong> pasadías con instalaciones de hotel o beach club.</li></ul><p>Para una visión más amplia de ciudad, mar y actividades, consulta la <a href="../precios-tours-cartagena/">guía general de precios de tours en Cartagena</a>.</p>`],
      ["Reserva sin perder dinero", `<ol><li>Comprueba el <a href="../como-verificar-agencia-rnt-cartagena/">Registro Nacional de Turismo</a> del prestador.</li><li>Pide inclusiones, exclusiones, política de cambios y precio final.</li><li>Guarda comprobante de pago y conversación.</li><li>Confirma un día antes si existe restricción marítima.</li><li>No entregues dinero a intermediarios no identificados.</li></ol>`],
    ],
    faqs: [
      ["¿Cuánto vale un pasadía a las Islas del Rosario?", "En las opciones comparadas por Dunas & Olas al 12 de agosto de 2026, los planes compartidos van aproximadamente desde $250.000 hasta $385.000 COP por persona."],
      ["¿Cuánto cuesta el tour de 5 islas en Cartagena?", "El Tour 5 Islas Standard aparece desde $270.000 COP por persona y el Tour 5 Islas VIP desde $320.000 COP, sujetos a fecha y disponibilidad."],
      ["¿La tasa portuaria está incluida?", "No siempre. Solicita el precio definitivo por escrito y confirma si tasa de muelle, seguro, entrada al parque y actividades opcionales están incluidas."],
      ["¿Conviene reservar por internet o en la calle?", "Conviene reservar con un prestador identificable, con RNT verificable, inclusiones escritas, política de cambios y comprobante de pago."],
    ],
    sources: [["SIC: los precios turísticos deben ser definitivos y completos", sources.sicPrice], ["SIC: derechos y recomendaciones para el consumidor turista", sources.sicRights], ["Parques Nacionales: información del PNN Corales del Rosario y San Bernardo", sources.parkPage]],
    cardText: "Cuánto cuestan los pasadías, qué incluye cada rango y qué cargos debes confirmar antes de reservar.",
  },
  {
    slug: "seguro-obligatorio-islas-rosario-san-bernardo-2026",
    title: "Seguro obligatorio para Islas del Rosario y San Bernardo en 2026: lo que debe saber el turista",
    shortTitle: "Seguro obligatorio para Islas del Rosario",
    description: "Desde el 1 de marzo de 2026 el seguro de accidentes y asistencia es obligatorio para ingresar al PNN Corales del Rosario y San Bernardo. Guía práctica.",
    keywords: "seguro obligatorio islas del rosario 2026, seguro parque corales rosario san bernardo, requisitos islas del rosario, seguro turistas cartagena islas",
    category: "Normativa turística",
    categoryClass: "text-cyan-700",
    cardCategory: "normativa guia islas",
    image: "images/backpackers/tour-5-islas-standard/05.webp",
    imageWidth: 1024,
    imageHeight: 768,
    alt: "Pasajeros con chalecos salvavidas durante un tour marítimo cerca de Cartagena",
    reading: "8 min",
    intro: "Viajar a las Islas del Rosario o al archipiélago de San Bernardo en 2026 tiene un requisito que muchos anuncios todavía no explican con claridad: el <strong>seguro de accidentes y asistencia al visitante es obligatorio</strong> para acceder al Parque Nacional Natural Corales del Rosario y de San Bernardo.",
    notice: "Parques Nacionales informó que la obligación comenzó el 1 de marzo de 2026, en aplicación de la Resolución 273 de 2024. El seguro es independiente del derecho de ingreso al área protegida.",
    sections: [
      ["Respuesta rápida", `<div class="tip-box"><p><strong>Sí. Desde el 1 de marzo de 2026 debes contar con un seguro de accidentes y asistencia para ingresar al PNN Corales del Rosario y San Bernardo.</strong> Si no acreditas una póliza válida, no puedes acceder. Pregunta al operador si viene incluida o se paga por separado.</p></div>`],
      ["¿Qué cubre este seguro?", `<p>Parques Nacionales lo presenta como una medida de protección frente a accidentes y situaciones que puedan requerir asistencia durante la visita. La cobertura, vigencia, exclusiones y procedimiento de atención dependen de la póliza contratada. Antes de embarcar, pide el comprobante o certificado y revisa que coincida con la fecha del viaje.</p>`],
      ["Seguro y entrada al parque no son lo mismo", `<p>La autoridad aclara que el seguro obligatorio es <strong>independiente</strong> del valor de ingreso al área protegida. Por eso una reserva puede mostrar ambos conceptos por separado. También pueden existir tasa de muelle u otros cargos del servicio turístico. Solicita el desglose y el total final.</p>`],
      ["Qué preguntar al reservar", `<ul><li>¿El seguro ya está incluido en el precio publicado?</li><li>¿Cuál es la aseguradora y qué cobertura ofrece?</li><li>¿Debo presentar un documento o código antes de ingresar?</li><li>¿La entrada al parque y la tasa de muelle son pagos distintos?</li><li>¿Qué ocurre si la autoridad marítima cancela la salida?</li></ul>`],
      ["No confundir seguro con chaleco salvavidas", `<p>El seguro no sustituye las medidas de navegación. Debes usar chaleco salvavidas durante el trayecto y seguir las indicaciones de la tripulación. Revisa nuestra <a href="../requisitos-lancha-segura-islas-cartagena/">lista para reconocer una lancha segura</a>.</p>`],
      ["Qué llevar el día del viaje", `<ul><li>documento de identidad;</li><li>confirmación de reserva;</li><li>comprobante o certificado del seguro;</li><li>contacto del operador;</li><li>medicamentos personales y datos relevantes de salud;</li><li>protección solar y agua según las condiciones del plan.</li></ul>`],
      ["Si el anuncio dice que el seguro es opcional", `<p>Pide aclaración antes de pagar. Para el acceso al parque, la exigencia oficial está vigente desde marzo de 2026. Un servicio puede presentar coberturas adicionales como opcionales, pero no debe confundirlas con el seguro exigido por Parques Nacionales. Conserva la respuesta escrita.</p>`],
    ],
    faqs: [
      ["¿Es obligatorio comprar seguro para ir a Islas del Rosario?", "Sí. Parques Nacionales informó que el seguro de accidentes y asistencia es obligatorio desde el 1 de marzo de 2026 para acceder al PNN Corales del Rosario y San Bernardo."],
      ["¿El seguro está incluido en el tour?", "Depende del operador y del plan. Confírmalo por escrito y verifica si el precio también incluye ingreso al parque y tasa de muelle."],
      ["¿El seguro reemplaza la entrada al parque?", "No. Parques Nacionales indica que son conceptos independientes."],
      ["¿Qué pasa si no tengo seguro?", "La información oficial señala que sin acreditar un seguro válido no se puede acceder al área protegida."],
    ],
    sources: [["Parques Nacionales: avanza el seguro obligatorio para turistas", sources.parkInsurance], ["Parques Nacionales: PNN Corales del Rosario y San Bernardo", sources.parkPage], ["Alcaldía de Cartagena: recomendaciones para servicios turísticos autorizados", sources.cartagenaSeason]],
    cardText: "Desde marzo de 2026 es requisito de ingreso. Te explicamos qué comprobar y por qué no es lo mismo que la entrada al parque.",
  },
  {
    slug: "como-verificar-agencia-rnt-cartagena",
    title: "Cómo verificar el RNT de una agencia de turismo en Cartagena antes de reservar",
    shortTitle: "Cómo verificar una agencia y su RNT",
    description: "Aprende a consultar el Registro Nacional de Turismo de una agencia en Cartagena, comprobar que esté activo y reservar con mayor seguridad.",
    keywords: "verificar agencia turismo cartagena, consultar rnt agencia cartagena, registro nacional turismo colombia consulta, agencia tours cartagena segura",
    category: "Reserva segura",
    categoryClass: "text-violet-700",
    cardCategory: "normativa guia destacado",
    image: "images/nohemi-retrato.webp",
    imageWidth: 640,
    imageHeight: 640,
    alt: "Nohemi, anfitriona local de Dunas y Olas en Cartagena",
    reading: "8 min",
    intro: "Antes de pagar un tour en Cartagena, revisa algo más importante que los seguidores de Instagram: el <strong>Registro Nacional de Turismo (RNT)</strong>. Es el registro obligatorio para los prestadores turísticos en Colombia y te ayuda a comprobar quién está detrás de la oferta.",
    notice: "MinCIT señala que la inscripción es obligatoria antes de operar y que debe renovarse cada año entre el 1 de enero y el 31 de marzo. La consulta se realiza a través del RUES de Confecámaras.",
    sections: [
      ["Respuesta rápida", `<div class="tip-box"><p><strong>Pide el número de RNT, consúltalo en el Registro Único Empresarial y Social (RUES) y comprueba que el nombre, estado y actividad coincidan con quien te está cobrando.</strong> Dunas & Olas publica el RNT No. 292710 en su sitio.</p></div>`],
      ["Qué es el RNT", `<p>El Registro Nacional de Turismo identifica a los prestadores de servicios turísticos formales en Colombia. No es una calificación ni garantiza que cada experiencia sea perfecta, pero permite verificar que la actividad fue registrada y facilita identificar al responsable del servicio.</p>`],
      ["Paso a paso para verificarlo", `<ol><li>Solicita el número completo de RNT y el nombre comercial o razón social.</li><li>Entra desde la página de <a href="${sources.rntMain}" target="_blank" rel="noopener noreferrer">Registro Nacional de Turismo de MinCIT</a> y abre la consulta pública en RUES.</li><li>Busca por número o nombre.</li><li>Revisa que el estado esté activo o vigente.</li><li>Compara municipio, categoría y titular con la reserva que te ofrecen.</li></ol>`],
      ["Señales que requieren una segunda revisión", `<ul><li>el vendedor se niega a entregar el RNT;</li><li>el registro corresponde a otra empresa o actividad;</li><li>el pago se solicita a una persona sin relación explicada con el prestador;</li><li>no entregan condiciones, inclusiones ni política de cancelación;</li><li>presionan para pagar de inmediato sin comprobante.</li></ul>`],
      ["Qué más revisar además del RNT", `<p>Confirma precio total, nombre del operador marítimo, punto de salida, política por mal clima, horario, seguro y canales de atención. Para una salida insular, aplica también la <a href="../requisitos-lancha-segura-islas-cartagena/">lista de seguridad marítima</a>.</p>`],
      ["Por qué guardar evidencias", `<p>Conserva captura de la oferta, conversación, comprobante y datos del prestador. Si existe un incumplimiento, esa información facilita presentar una reclamación directa o acudir a las autoridades. Evita pagos sin concepto o sin identificación del receptor.</p>`],
      ["Dunas & Olas y la información visible", `<p>En Dunas & Olas encontrarás el RNT No. 292710, precios de referencia, inclusiones, exclusiones y contacto directo. Si algo cambia por disponibilidad o clima, la confirmación final debe quedar clara antes del pago.</p>`],
    ],
    faqs: [
      ["¿Dónde se consulta el RNT de una agencia?", "MinCIT dirige la consulta pública al Registro Único Empresarial y Social, RUES, de Confecámaras."],
      ["¿Una agencia de turismo debe tener RNT?", "Sí. MinCIT indica que la inscripción en el RNT es obligatoria para prestar servicios turísticos y debe renovarse cada año."],
      ["¿Tener RNT garantiza el tour?", "El RNT permite identificar y comprobar la formalidad del prestador, pero también debes revisar condiciones, precio final, seguro, operador y comprobante de pago."],
      ["¿Cuál es el RNT de Dunas & Olas?", "Dunas & Olas publica en su sitio el RNT No. 292710."],
    ],
    sources: [["MinCIT: qué es el Registro Nacional de Turismo", sources.rnt], ["MinCIT: Registro Nacional de Turismo y consulta", sources.rntMain], ["SIC: derechos y recomendaciones para el consumidor turista", sources.sicRights]],
    cardText: "Paso a paso para comprobar quién te vende el tour, si su registro está vigente y qué otras evidencias debes guardar.",
  },
  {
    slug: "derechos-turista-cobros-excesivos-cartagena",
    title: "Cobros excesivos en Cartagena: derechos del turista, precios y dónde denunciar",
    shortTitle: "Qué hacer ante cobros excesivos en Cartagena",
    description: "Derechos del turista ante cobros excesivos en Cartagena: cómo exigir precios claros, guardar pruebas, reclamar y usar los canales oficiales de atención.",
    keywords: "cobros excesivos cartagena turistas, donde denunciar precios cartagena, derechos turista cartagena, estafas playa blanca baru precios",
    category: "Derechos del turista",
    categoryClass: "text-rose-700",
    cardCategory: "normativa guia",
    image: "images/playa-blanca-baru.webp",
    imageWidth: 1200,
    imageHeight: 800,
    alt: "Playa Blanca en Barú, uno de los destinos turísticos de Cartagena",
    reading: "9 min",
    intro: "Un almuerzo, masaje, transporte o actividad no debería convertirse en una discusión al final. En Colombia, el turista tiene derecho a recibir <strong>información clara y un precio definitivo y completo</strong>. Esta guía explica cómo prevenir cobros excesivos en Cartagena y qué hacer si ya ocurrió.",
    notice: "La SIC exige que los precios de servicios turísticos se informen de forma clara, completa y definitiva, incluidos los cargos aplicables. En Cartagena existen canales distritales para reportar situaciones irregulares.",
    sections: [
      ["Respuesta rápida", `<div class="tip-box"><p><strong>Pregunta y acuerda el precio total antes de aceptar el servicio, guarda la conversación o fotografía de la tarifa y pide comprobante.</strong> Si hay un cobro irregular, no borres evidencias y contacta los canales oficiales. Titán Chat atiende por WhatsApp en el <strong>304 251 1127</strong>.</p></div>`],
      ["Qué significa precio definitivo", `<p>La SIC explica que el precio debe incluir impuestos, costos adicionales, tasas y recargos aplicables desde el primer contacto con el consumidor. Si una actividad tiene condiciones variables —por tiempo, distancia o número de personas— pide que el criterio quede escrito antes de comenzar.</p>`],
      ["Antes de consumir o contratar", `<ul><li>pregunta el valor total y la moneda;</li><li>confirma si es por persona, por grupo, por hora o por servicio;</li><li>revisa si propina, transporte, entrada o alquiler son adicionales;</li><li>fotografía la carta o lista de precios;</li><li>no aceptes una cuenta sin desglose;</li><li>evita intermediarios que no identifiquen al prestador.</li></ul>`],
      ["Si la cuenta no coincide", `<ol><li>Mantén la calma y solicita el desglose.</li><li>Muestra la tarifa o acuerdo guardado.</li><li>No firmes ni aceptes un valor distinto sin explicación.</li><li>Identifica establecimiento, persona, ubicación, fecha y hora.</li><li>Contacta a las autoridades si hay presión, amenaza o retención.</li></ol>`],
      ["Canales oficiales en Cartagena", `<p>La Alcaldía dispone de <strong>Titán Chat por WhatsApp en el 304 251 1127</strong> para reportes y orientación. También puedes acudir a los Centros de Atención al Turista, la Secretaría de Turismo de Cartagena y la Superintendencia de Industria y Comercio. Si existe una emergencia inmediata, busca apoyo de Policía o autoridad presente.</p>`],
      ["Qué pruebas guardar", `<ul><li>capturas de la oferta y conversación;</li><li>foto de la carta o aviso de precios;</li><li>factura, recibo o comprobante de transferencia;</li><li>nombre del establecimiento y ubicación;</li><li>fotografías del servicio recibido;</li><li>datos de testigos, si los hay.</li></ul>`],
      ["Cómo evitar problemas en islas y playas", `<p>Reserva con prestadores identificables, verifica su <a href="../como-verificar-agencia-rnt-cartagena/">Registro Nacional de Turismo</a> y pregunta antes por camas, carpas, comida, masajes, deportes acuáticos, transporte y regreso. Para tours, compara el <a href="../cuanto-cuesta-tour-islas-del-rosario-2026/">precio total de los planes a Islas del Rosario</a>.</p>`],
    ],
    faqs: [
      ["¿Dónde denunciar un cobro excesivo en Cartagena?", "La Alcaldía informa que Titán Chat recibe reportes por WhatsApp en el 304 251 1127. También están la Secretaría de Turismo, los Centros de Atención al Turista y la SIC."],
      ["¿El establecimiento debe mostrar el precio?", "La SIC exige información clara, completa y un precio definitivo que contemple los cargos aplicables."],
      ["¿Qué hago si me cobran algo que no autoricé?", "Solicita el desglose, muestra el precio acordado, guarda pruebas e identifica al prestador. Si hay presión o amenaza, busca apoyo de las autoridades."],
      ["¿Debo guardar la conversación de WhatsApp?", "Sí. Las capturas, comprobantes y fotografías de la tarifa ayudan a demostrar las condiciones ofrecidas."],
    ],
    sources: [["SIC: precios turísticos definitivos y completos", sources.sicPrice], ["SIC: información para el consumidor turista", sources.sicTourist], ["Alcaldía de Cartagena: caso de cobro excesivo y Titán Chat", sources.titan], ["Alcaldía de Cartagena: canales para reportar irregularidades", sources.touristChannels]],
    cardText: "Cómo acordar el precio, qué pruebas guardar y cuáles son los canales oficiales ante un cobro irregular.",
  },
  {
    slug: "requisitos-lancha-segura-islas-cartagena",
    title: "Cómo saber si una lancha es segura para ir a las islas de Cartagena: requisitos y lista de revisión",
    shortTitle: "Cómo reconocer una lancha segura en Cartagena",
    description: "Lista práctica para reconocer una lancha segura en Cartagena: chaleco, cupo, muelle autorizado, motores, identificación y restricciones marítimas.",
    keywords: "lancha segura islas cartagena, requisitos lancha islas del rosario, chaleco salvavidas tour cartagena, muelle autorizado cartagena islas",
    category: "Seguridad marítima",
    categoryClass: "text-blue-700",
    cardCategory: "normativa guia islas",
    image: "images/backpackers/tour-5-islas-standard/01.webp",
    imageWidth: 810,
    imageHeight: 1080,
    alt: "Turistas usando chalecos salvavidas en una embarcación frente a Cartagena",
    reading: "9 min",
    intro: "Una lancha bonita no necesariamente es una lancha segura. Antes de viajar a Islas del Rosario, Barú o Tierra Bomba, revisa el punto de salida, la identificación de la embarcación, el cupo y los elementos de seguridad. Esta lista traduce las recomendaciones de DIMAR a preguntas sencillas para el turista.",
    notice: "Las salidas dependen de inspección, clima y restricciones de la Capitanía de Puerto. La autoridad puede limitar o suspender la navegación aunque exista una reserva confirmada.",
    sections: [
      ["Respuesta rápida", `<div class="tip-box"><p><strong>Usa chaleco durante toda la navegación, no aceptes sobrecupo, identifica la lancha y sal desde un muelle autorizado.</strong> Para rutas hacia Islas del Rosario, DIMAR ha indicado embarcaciones con mínimo dos motores; los servicios privados pueden usar marinas habilitadas.</p></div>`],
      ["1. Chaleco salvavidas puesto, no debajo del asiento", `<p>DIMAR recuerda que el uso del chaleco es obligatorio. Debe corresponder a tu talla, cerrar correctamente y permanecer puesto durante el trayecto. Si llevas niños, pide un chaleco infantil adecuado antes de zarpar.</p>`],
      ["2. Respeta el cupo autorizado", `<p>No embarques si faltan asientos seguros o si la tripulación intenta superar la capacidad. El sobrecupo cambia el comportamiento de la lancha y dificulta una evacuación. Cuenta a los pasajeros y pregunta por la capacidad visible en la embarcación.</p>`],
      ["3. Confirma el punto de salida", `<p>Los servicios compartidos de pasajeros hacia la zona insular operan desde puntos autorizados como el Muelle La Bodeguita. Las embarcaciones privadas pueden salir desde marinas habilitadas. Desconfía de una salida improvisada o de un cambio de muelle sin explicación.</p>`],
      ["4. Identifica lancha, piloto y operador", `<p>Anota o fotografía el nombre y número de la embarcación. Confirma el nombre del operador y un contacto en tierra. La tripulación debe atender las indicaciones de la Capitanía de Puerto y presentar la documentación exigida durante las inspecciones.</p>`],
      ["5. Motores y equipos básicos", `<p>DIMAR ha señalado que las embarcaciones con destino a Islas del Rosario deben contar con mínimo dos motores, mientras que para Tierra Bomba se permite uno. También se inspeccionan elementos como comunicaciones, extintor, botiquín y dispositivos de salvamento. No manipules equipos ni bloquees las salidas.</p>`],
      ["6. El clima manda", `<p>Una cancelación por oleaje o viento no es un capricho del operador. Verifica la política de reprogramación o devolución antes de reservar y consulta el estado de la navegación. Lee también la guía para <a href="../zarpar-seguro-islas-cartagena/">zarpar seguro hacia las islas</a>.</p>`],
      ["Lista de 30 segundos antes de salir", `<ul><li>chaleco puesto y ajustado;</li><li>sin sobrecupo;</li><li>nombre de la lancha fotografiado;</li><li>operador y contacto guardados;</li><li>muelle autorizado;</li><li>equipaje asegurado y pasillo libre;</li><li>seguro del parque confirmado cuando aplique;</li><li>hora y punto de regreso por escrito.</li></ul>`],
    ],
    faqs: [
      ["¿Es obligatorio usar chaleco salvavidas en una lancha en Cartagena?", "Sí. DIMAR recuerda que el chaleco salvavidas es obligatorio durante la navegación."],
      ["¿Desde dónde salen las lanchas a Islas del Rosario?", "Los servicios compartidos de pasajeros operan desde puntos autorizados como el Muelle La Bodeguita; las embarcaciones privadas pueden usar marinas habilitadas."],
      ["¿Cuántos motores debe tener una lancha a Islas del Rosario?", "DIMAR ha indicado mínimo dos motores para embarcaciones con destino a Islas del Rosario; para Tierra Bomba puede permitirse uno."],
      ["¿Qué pasa si cierran la navegación?", "Debes respetar la restricción de la Capitanía de Puerto y aplicar la política de reprogramación o devolución acordada con el prestador."],
    ],
    sources: [["DIMAR: campaña de seguridad marítima en Cartagena", sources.dimarSafety], ["DIMAR: marinas habilitadas y requisitos de embarcaciones", sources.dimarMarinas], ["Alcaldía de Cartagena: contratar servicios autorizados y zarpar desde La Bodeguita", sources.cartagenaSeason], ["Parques Nacionales: seguro obligatorio para visitantes", sources.parkInsurance]],
    cardText: "Chaleco, cupo, muelle autorizado, motores e identificación: la lista que debes revisar antes de zarpar.",
  },
];

for (const article of articles) {
  const dir = path.join(root, "blog", article.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), articleHtml(article), "utf8");
}

function updateBlogIndex() {
  const file = path.join(root, "blog", "index.html");
  let html = fs.readFileSync(file, "utf8");
  const start = "<!-- TOURIST-RULES-2026:START -->";
  const end = "<!-- TOURIST-RULES-2026:END -->";
  html = html.replace(new RegExp(`${start}[\\s\\S]*?${end}\\s*`, "g"), "");
  const currentEnd = "<!-- CURRENT-2026-ARTICLES:END -->";
  html = html.replace(currentEnd, `${currentEnd}\n        ${start}\n        ${articles.map(blogCard).join("\n        ")}\n        ${end}`);
  if (!html.includes('data-filter="normativa"')) {
    const target = /(<button data-filter="actualidad"[^>]*>Actualidad 2026<\/button>)/;
    html = html.replace(target, `$1\n        <button data-filter="normativa" class="filter-btn px-5 py-2 rounded-full text-sm font-bold border-2 border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-700 hover:text-white hover:border-emerald-700 transition">Normas y precios</button>`);
  }
  fs.writeFileSync(file, html, "utf8");
}

function updateSitemap() {
  const file = path.join(root, "sitemap.xml");
  let xml = fs.readFileSync(file, "utf8");
  const start = "<!-- TOURIST-RULES-2026-BLOG:START -->";
  const end = "<!-- TOURIST-RULES-2026-BLOG:END -->";
  xml = xml.replace(new RegExp(`${start}[\\s\\S]*?${end}\\s*`, "g"), "");
  const entries = articles.map((article, index) => `  <url>\n    <loc>https://dunasyolas.com/blog/${article.slug}/</loc>\n    <xhtml:link rel="alternate" hreflang="es-CO" href="https://dunasyolas.com/blog/${article.slug}/"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="https://dunasyolas.com/blog/${article.slug}/"/>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${index < 2 ? "0.9" : "0.8"}</priority>\n  </url>`).join("\n");
  xml = xml.replace("</urlset>", `${start}\n${entries}\n${end}\n</urlset>`);
  fs.writeFileSync(file, xml, "utf8");
}

updateBlogIndex();
updateSitemap();

module.exports = { articles };
