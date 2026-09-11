# Revisión integral de Dunas & Olas — 11 de septiembre de 2026

## Correcciones realizadas

- Navegación de tablet: menú compacto entre 768 y 1100 px para evitar que los enlaces se superpongan al logotipo.
- Menú móvil: foco al abrir, retorno al cerrar, Escape, recorrido de teclado y desbloqueo al cambiar a escritorio.
- Selector de idioma: usa la traducción declarada en cada página; conserva la ficha o artículo cuando existe equivalente.
- Búsqueda: índice inglés independiente, mensajes en inglés y navegación de resultados con flechas y Escape.
- Uniformidad: acentos oceánicos/dorados, portada del itinerario, controles de catálogo/carrito y espaciado de la galería.
- Carrito: contador vacío oculto, controles de cantidad de 44 px, etiquetas accesibles, panel cerrado fuera de la navegación por teclado, Escape y contención de foco.
- Galería: diálogo accesible, foco en el botón de cierre y regreso a la fotografía. Corregida una transición que impedía enfocar el cierre inmediatamente.
- Aviso inferior: WhatsApp y la barra de reservas respetan la altura real del aviso de cookies. Cierre tolerante al bloqueo de almacenamiento del navegador.
- Animaciones: primera pantalla visible sin esperar efectos de aparición; entrada suave del menú y respeto a movimiento reducido.
- Carga: incorporada la fuente regular de Font Awesome que faltaba en artículos. Versionados los recursos compartidos para evitar que visitantes recurrentes reciban versiones antiguas.
- Itinerario: fechas calculadas en calendario local, evitando desplazamientos de un día en otras zonas horarias.
- Resultado del pago: ya no afirma que se recibió una confirmación basándose únicamente en un parámetro manipulable de URL.

## Evidencia y alcance

- Validador estático: 147 páginas HTML y 145 URLs indexables; metadatos, JSON-LD, enlaces/recursos locales e imágenes según las reglas del proyecto.
- Recorrido completo en Chrome a 390 px: 147 páginas, sin desbordamientos, errores de JavaScript ni respuestas fallidas de recursos locales después de corregir la fuente. Los elementos de imagen vacíos de diálogos cerrados se excluyen del recuento de imágenes cargadas.
- Capturas de nueve familias de páginas a 390, 768, 1366 y 1920 px: inicio, catálogo, galería, nosotros, itinerario, kitesurf, ficha de tour, blog y catálogo inglés. La inspección visual se realiza sobre esta muestra representativa, no sobre cada sección de las 147 páginas.
- Interacciones verificadas: abrir/cerrar menú y foco, redimensionar a escritorio, búsqueda sin resultados, limpiar búsqueda, añadir/cambiar/eliminar carrito, enlace de traducción, galería por teclado, búsqueda inglesa y movimiento reducido.
- Itinerario de tres días y persistencia al recargar: America/Bogota, America/Los_Angeles y Asia/Tokyo.
- Se ejecutaron directamente con Node los pasos de compilación y validación de package.json porque npm no estaba en PATH.
- No se realizaron cobros ni envíos de mensajes. No se atribuye una puntuación PageSpeed, una mejora de conversión ni indexación real a estas pruebas.

## Inventario priorizado pendiente

| Prioridad | Tema y evidencia | Trabajo propuesto | Información o decisión necesaria |
| --- | --- | --- | --- |
| Alta | Confirmación real de pagos. La página de retorno lee parámetros de URL; el endpoint crea preferencias, pero el repositorio no contiene una verificación de pago ni un receptor de webhook. | Verificar transacciones en servidor, almacenar estado de reserva, procesar notificaciones con idempotencia y probar aprobado/pendiente/rechazado en entorno de prueba. | Confirmar la operación comercial: cuándo se cobra, cómo se reserva cupo y cómo se gestiona una devolución. Configuración de la cuenta por su titular. |
| Alta | Tarifas y catálogo duplicados entre fichas, catálogo, js/cart.js y el objeto de actividades del itinerario. | Crear una fuente única de precios, unidades, inclusiones, extras y disponibilidad; generar las vistas desde ella. | Tabla vigente aprobada por la agencia y operadores; no se modificaron precios ni condiciones sin esa información. |
| Alta | Inglés incompleto. El índice de búsqueda tiene 97 páginas ES y 42 EN; galería e itinerario enlazan a páginas españolas desde la navegación inglesa. El carrito compartido conserva textos españoles. | Completar primero itinerario, galería, carrito/checkout y fichas de mayor venta; después ampliar artículos. | Priorizar experiencias y revisar terminología comercial en inglés. La diferencia de índices no equivale exactamente al número de traducciones faltantes. |
| Alta | Reserva y disponibilidad dependen del contacto con la agencia. | Definir estados claros: solicitud, disponibilidad confirmada, pago y reserva confirmada; unificar mensajes y políticas. | Capacidad real, plazos de respuesta, responsables y reglas de cada operador. |
| Media | El aviso de cookies menciona análisis y terceros; la revisión no acredita un sistema de medición de conversiones funcionando. | Inventariar las tecnologías que realmente se usan y alinear aviso/preferencias/política; después definir medición de búsquedas, clics a WhatsApp y solicitudes. | Elegir herramienta y finalidades; revisar textos de privacidad con quien corresponda. No se declara cumplimiento jurídico certificado. |
| Media | Rendimiento en usuarios reales y buscadores no medido por esta revisión. | Ejecutar Lighthouse/PageSpeed cuando esté disponible y contrastar con Search Console/Core Web Vitals; priorizar problemas observados. | Acceso a la propiedad de Search Console si se quiere comprobar cobertura e indexación. |
| Media | Contenido editorial fechado, precios orientativos, requisitos y condiciones de operadores. | Revisar fuentes y fechas de vigencia, asignar responsable editorial y calendario de actualización. | Validación comercial de precios y condiciones; revisión de fuentes oficiales para requisitos. No se verificó factualidad completa de cada artículo. |
| Media | Fotografías de distinta calidad y encuadre; la uniformidad de componentes no sustituye una selección editorial. | Seleccionar portada por experiencia y ordenar imágenes por valor informativo, con recortes específicos para móvil. | Elegir fotos oficiales preferidas y confirmar permisos de uso; no se inventaron testimonios ni material de operadores. |
| Media | CSS y HTML repetidos y generadores parciales. Hay estilos inline heredados y recursos compartidos extensos. | Migración gradual a plantillas de cabecera, pie, ficha y artículo con tokens de diseño; mantener URLs y SEO existentes. | Acordar si se quiere solo mantenimiento estático o un panel de edición para la agencia. |
| Baja | Compatibilidad fuera del navegador comprobado. | Pruebas en Safari/iPhone y Android real, lector de pantalla y conexiones lentas; revisar casos extremos del itinerario. | Dispositivos o sesiones disponibles. Chrome emulado no demuestra compatibilidad en todos los dispositivos. |

## Orden sugerido para la próxima etapa

1. Confirmar catálogo vigente y proceso de reserva/pago.
2. Centralizar los datos comerciales.
3. Completar el recorrido de compra en inglés.
4. Activar medición y revisar rendimiento real.
5. Consolidar plantillas y mantenimiento editorial.

La publicación y su commit se informan por separado después de comprobar el despliegue y el dominio público.
