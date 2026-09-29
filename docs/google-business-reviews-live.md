# Reseñas de Google Business Profile en vivo

El sitio consulta las reseñas desde `GET /api/google-reviews`. La función renueva el acceso OAuth en el servidor, recorre todas las páginas de la API oficial de Google de 50 reseñas y entrega una lista normalizada al carrusel.

## Variables de producción

- `GOOGLE_BUSINESS_CLIENT_ID`
- `GOOGLE_BUSINESS_CLIENT_SECRET`
- `GOOGLE_BUSINESS_REFRESH_TOKEN`
- `GOOGLE_BUSINESS_ACCOUNT_ID` (opcional; se descubre automáticamente)
- `GOOGLE_BUSINESS_LOCATION_ID` (opcional; se descubre automáticamente)
- `GOOGLE_BUSINESS_PROFILE_NAME` (opcional; por defecto `Dunas y Olas`)

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
5. La función consulta automáticamente los identificadores de cuenta y ubicación; pueden fijarse por variable si alguna vez hay varias fichas con nombres similares.
6. Guardar las tres credenciales OAuth en Vercel para producción y volver a desplegar.
7. Verificar que `/api/google-reviews` responda con `"live": true` y comparar el total con la ficha pública.

## Estado del alta de Google (29 de septiembre de 2026)

- Proyecto: `Dunas y Olas Reviews` (`dunas-y-olas-reviews`).
- OAuth: cliente web creado, dominio y política de privacidad vinculados, alcance `business.manage` autorizado y aplicación en producción.
- Vercel: las tres credenciales OAuth están guardadas como secretos de producción.
- API de administración de cuentas e información de ubicaciones: habilitadas.
- Solicitud de acceso a Business Profile API: caso `1-8800000042131`, pendiente de revisión de Google (plazo mostrado: 7 a 10 días hábiles).
- Cuota actual: cero mientras Google revisa el caso. Producción sirve `verified-backup` hasta que la cuota esté habilitada.
- La ficha Dunas & Olas todavía figura como pendiente de verificación en el administrador de Google. La sincronización en vivo también depende de completar esa verificación.
