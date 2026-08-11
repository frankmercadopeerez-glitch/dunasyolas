# Publicar Dunas & Olas en Google

Esta lista deja el sitio preparado para que Google descubra e indexe sus páginas en el dominio canónico `https://dunasyolas.com`.

## 1. Corregir y redirigir el dominio `www`

1. Abre el proyecto de Dunas & Olas en Vercel.
2. Ve a **Settings > Domains**.
3. Agrega `www.dunasyolas.com`.
4. Configúralo para redirigir permanentemente a `dunasyolas.com`.
5. Espera a que Vercel muestre el dominio y su certificado como válidos.

El dominio principal debe seguir siendo `dunasyolas.com`. No cambies los canonical del sitio a `www`.

## 2. Crear la propiedad de dominio en Google Search Console

1. Entra a https://search.google.com/search-console con la cuenta de Google que administrará el sitio.
2. Pulsa **Añadir propiedad**.
3. Selecciona **Dominio**.
4. Escribe solamente `dunasyolas.com`, sin `https://` ni `www`.
5. Google mostrará un registro TXT de verificación. Cópialo completo.

## 3. Verificar el dominio desde Namecheap

1. En Namecheap abre **Domain List > Manage > Advanced DNS**.
2. Pulsa **Add New Record** y elige **TXT Record**.
3. En **Host** escribe `@`.
4. En **Value** pega exactamente el valor entregado por Google.
5. Usa **TTL Automatic** y guarda.
6. Regresa a Search Console y pulsa **Verificar**.

No borres ese TXT después de verificar. Si Google todavía no lo detecta, espera la propagación DNS y vuelve a intentarlo.

## 4. Enviar el sitemap

1. Dentro de la propiedad `dunasyolas.com`, abre **Sitemaps**.
2. En el campo de sitemap escribe `sitemap.xml`.
3. Pulsa **Enviar**.
4. Confirma que Google muestre `https://dunasyolas.com/sitemap.xml` como correcto.

El sitemap contiene únicamente URLs canónicas e indexables. No hace falta enviar un sitemap distinto para inglés.

## 5. Solicitar la primera indexación

Usa **Inspección de URLs**, luego **Probar URL publicada** y **Solicitar indexación** para estas páginas prioritarias:

1. `https://dunasyolas.com/`
2. `https://dunasyolas.com/experiences`
3. `https://dunasyolas.com/arma-tu-viaje`
4. `https://dunasyolas.com/pasadia-isla-palma`
5. `https://dunasyolas.com/pasadia-isla-lizamar`
6. `https://dunasyolas.com/pasadia-mucura-tintipan`
7. `https://dunasyolas.com/tour-5-islas-vip`
8. `https://dunasyolas.com/3-luxury-beach-clubs`
9. `https://dunasyolas.com/kitesurf`
10. `https://dunasyolas.com/blog/mejor-epoca-para-visitar-cartagena/`

No solicites manualmente las 127 URLs. El sitemap es el mecanismo correcto para el resto del sitio y repetir solicitudes no acelera el proceso.

## 6. Revisar la indexación

1. Espera unos días y abre **Indexación > Páginas**.
2. Comprueba cuántas URLs aparecen como indexadas.
3. Revisa especialmente los motivos **Rastreada: actualmente sin indexar**, **Descubierta: actualmente sin indexar**, duplicados y bloqueos.
4. Abre una URL afectada con **Inspección de URLs** antes de hacer cambios.

Google puede tardar varios días o semanas en indexar un dominio nuevo. Que el sitemap se procese no garantiza que todas las URLs se indexen de inmediato.

## 7. Medir visibilidad y mejorar el CTR

1. Revisa **Rendimiento > Resultados de búsqueda** cada semana.
2. Compara consultas, páginas, países, clics, impresiones, CTR y posición media.
3. Prioriza las páginas con impresiones y CTR bajo: mejora su título y descripción sin cambiar la URL.
4. Usa las consultas reales como ideas para ampliar preguntas frecuentes y contenido útil.

## 8. Completar el SEO local

1. Crea o reclama el Perfil de Empresa de Google de Dunas & Olas.
2. Usa el mismo nombre, teléfono, web y datos comerciales que aparecen en el sitio.
3. Elige una categoría principal precisa, por ejemplo **Agencia de viajes**.
4. Si no se atiende público en una oficina con señalización, configura el negocio como área de servicio y no muestres una dirección residencial.
5. Agrega fotos reales, horarios, servicios y descripción.
6. Solicita reseñas reales a clientes y respóndelas. No compres ni inventes reseñas.

## 9. Rutina mensual

- Publicar o mejorar contenido que responda dudas reales de viajeros.
- Mantener precios, horarios, inclusiones y datos de contacto actualizados.
- Añadir experiencias nuevas al sitemap y al enlazado interno.
- Ejecutar `npm test` antes de cada publicación.
- Revisar Search Console por problemas de indexación, experiencia de página o seguridad.

## Estado técnico comprobado

- `robots.txt` permite el rastreo y declara el sitemap canónico.
- El sitemap contiene 127 URLs indexables en `https://dunasyolas.com`.
- Las URLs publicadas del sitemap responden con estado HTTP 200.
- Las páginas indexables tienen title, description, H1 y canonical.
- Los datos estructurados JSON-LD son válidos sintácticamente.
- Las imágenes están por debajo de 200 KB.
- Las páginas 404 y de resultado de pago están excluidas correctamente.
