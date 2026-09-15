# Revisión de Google y fotografía — 14 de septiembre de 2026

## Google: acciones verificadas

- Sitemap actualizado con 256 URLs y 875 enlaces de alternativas de idioma. Incluye las 52 páginas nuevas FR/DE. Copia pública idéntica al archivo local.
- Search Console confirmó «Se ha enviado el sitemap correctamente». Fecha de envío: 14 sept 2026. La última lectura mostrada seguía siendo 5 sept 2026 y 145 páginas descubiertas: ese dato todavía no representa el sitemap nuevo.
- Solicitudes individuales aceptadas para `https://dunasyolas.com/fr/` y `https://dunasyolas.com/de/`: ambas mostraron «Se ha solicitado la indexación» y entrada en cola prioritaria. Las otras 50 páginas nuevas se entregaron mediante sitemap, no mediante solicitudes individuales.
- El informe mostraba 158 páginas indexadas y 74 excluidas: 45 alternativas con canonical, 25 redirecciones y cuatro descubiertas sin indexar. No hay que interpretar todas las exclusiones como errores. Ejemplos del primer grupo eran versiones sin barra final de artículos cuya canonical lleva barra.
- Se detectó que `trailingSlash:false` redirigía las canonical con barra final a su variante sin barra. Se retiró esa imposición; la verificación de release ahora exige HTTP 200 directo y no sigue redirecciones silenciosamente.

No se afirma que Google ya haya indexado las páginas nuevas. La recepción del sitemap y la solicitud de rastreo son pasos distintos de la indexación.

## Cuatro páginas descubiertas todavía sin rastrear en el informe

- https://dunasyolas.com/blog/identificar-lancha-pirata/
- https://dunasyolas.com/blog/kitesurf-cartagena/
- https://dunasyolas.com/buceo-snorkel
- https://dunasyolas.com/en/blog/cartagena-con-ninos/

Todas están incluidas en el sitemap. Revisar su evolución tras el nuevo rastreo; el estado por sí solo no demuestra un error del contenido.

## Foto de plancton

No se sustituyó la imagen porque no se encontró una fotografía nocturna de la Laguna Encantada de Isla Grande con procedencia y permiso de reutilización verificables. El usuario confirmó que no tiene autorización de un operador ni una galería autorizada.

Fuentes evaluadas:

- [CAUT: Laguna Encantada de Isla Grande](https://www.flickr.com/photos/caut/51920021910): imagen diurna aérea, lugar identificado; todos los derechos reservados.
- [Elizabeth Valenzuela: Laguna Encantada, Islas del Rosario](https://www.flickr.com/photos/elivalenzuela/3673706650/): lugar identificado; todos los derechos reservados.
- [El Universal: plancton en Barú](https://www.eluniversal.com.co/cartagena/2019/05/03/plancton-luminoso-la-maravilla-natural-escondida-en-baru/): fotografías nocturnas de Germán Steffens / Afronáutica, incluida una versión de 1200 píxeles. El reportaje sitúa la actividad en la ciénaga de Portonaito, también llamada Laguna Encantada, en Barú. No verifica que sea la laguna de Isla Grande solicitada y no concede licencia de reutilización.

La referencia actual de Puerto Rico sigue identificada como referencia. La información de Family Eco-Route sigue describiendo Barú: conviene que el proveedor confirme si esa ficha corresponde al lugar señalado por el usuario antes de cambiar el recorrido.

## Otros pendientes

Pagos y panel móvil/base de datos continúan aplazados por decisión del usuario. Falta ampliar las traducciones de las demás experiencias y de los documentos legales completos; obtener material fotográfico autorizado, reseñas reales y detalles operativos por producto. Inventario y estrategia: `seo-internacional-2026-09-14.md`.
