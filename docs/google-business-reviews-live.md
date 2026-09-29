# Reseñas de Google Business Profile en vivo

El sitio consulta las reseñas desde `GET /api/google-reviews`. La función renueva el acceso OAuth en el servidor, recorre todas las páginas de la API oficial de Google de 50 reseñas y entrega una lista normalizada al carrusel.

## Variables de producción

- `GOOGLE_BUSINESS_CLIENT_ID`
- `GOOGLE_BUSINESS_CLIENT_SECRET`
- `GOOGLE_BUSINESS_REFRESH_TOKEN`
- `GOOGLE_BUSINESS_ACCOUNT_ID`
- `GOOGLE_BUSINESS_LOCATION_ID`

Las credenciales solo se guardan como variables cifradas de Vercel. Nunca deben escribirse en HTML, JavaScript público, el repositorio ni archivos de registro.

## Actualización y tolerancia a fallos

- El navegador comprueba cambios cada 60 segundos.
- Vercel conserva cada respuesta durante 60 segundos y permite servirla mientras revalida durante 5 minutos.
- La función recorre `nextPageToken` hasta obtener todas las reseñas; la prueba automatizada valida 200 reseñas en cuatro páginas.
- Si Google o la autorización fallan temporalmente, el endpoint devuelve `data/google-reviews.json`, la última copia pública verificada.

## Activación

1. Usar un proyecto exclusivo de Google Cloud para Dunas & Olas.
2. Solicitar y obtener acceso a Google Business Profile APIs.
3. Configurar la pantalla OAuth y un cliente web con el alcance `https://www.googleapis.com/auth/business.manage`.
4. Autorizar la cuenta administradora de la ficha y obtener un `refresh_token`.
5. Consultar los identificadores de cuenta y ubicación.
6. Guardar las cinco variables en Vercel para producción y volver a desplegar.
7. Verificar que `/api/google-reviews` responda con `"live": true` y comparar el total con la ficha pública.
