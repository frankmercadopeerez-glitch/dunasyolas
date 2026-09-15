# Diseño y conversión — 14 de septiembre de 2026

Se adoptan superficies blancas, azul profundo #08283e, azul océano #006b83, amarillo #ffc52b y verde oscuro #086447 para WhatsApp. Botones con esquinas de 6 px y jerarquía visual consistente; los tres botones del catálogo comparten ancho y altura de 48 px.

## Fundamento
- [Baymard: Button Design](https://baymard.com/learn/button-design): distinguir acciones principales y secundarias y dar contraste al botón principal. La elección de amarillo sobre azul es una decisión para esta marca, no un resultado experimental que garantice ventas.
- [Nielsen Norman Group: Animation Duration](https://www.nngroup.com/articles/animation-duration/): las animaciones deben ser suficientemente rápidas para no retrasar al usuario.
- [Nielsen Norman Group: Animation Purpose](https://www.nngroup.com/articles/animation-purpose-ux/): usar movimiento para comunicar respuesta y cambios, evitando distracciones. Se usan transiciones de 160–220 ms y se respeta la preferencia de movimiento reducido.

## Cambios
- Inicio: propuesta, señales de confianza, experiencias con precios, presentación de Nohemi y sección de botes privados. Acceso directo al catálogo y al planificador.
- Navegación renderizada en HTML con CSS bloqueante para evitar mostrar el menú antiguo antes de ejecutar JavaScript.
- Botes privados en español, inglés, francés y alemán, con enlaces entre idiomas y sitemap actualizado. No se anuncian embarcaciones ni tarifas sin confirmar.
- Filtros y botones menos redondeados; WhatsApp oscuro, compacto y alineado con las otras acciones.

## Verificación
- 262 páginas HTML validadas y 260 rutas indexables comprobadas contra el servidor local; 18 recursos coinciden.
- 52 páginas internacionales existentes pasan la comprobación de contenido y enlaces recíprocos.
- Catálogo a 390 px: sin desbordamiento horizontal; tres botones de 99.16 × 48 px en la tarjeta Chiva. Inicio y botes franceses sin desbordamiento a 390 px.
- Menú antes y después de JavaScript: misma altura 72.89 px y fuente 12.48 px en la prueba de escritorio.
- Revisión visual de inicio y catálogo en navegador.

## Pendientes reales
- Recibir nombre, fotos autorizadas, capacidad, rutas, duración, precios, inclusiones y condiciones de cada bote.
- Medir clics y consultas/reservas para evaluar el efecto real del diseño; esta publicación no demuestra todavía una mejora de conversión.
- Se mantienen diferidos pagos y administración de precios/disponibilidad mediante base de datos.
