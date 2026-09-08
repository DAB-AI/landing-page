# DAB Tech R7.2 — preparación para Vercel

Estado objetivo: build de producción preparado; despliegue y DNS son operaciones posteriores. No hay backend, relay, webhook, base de datos ni formulario de datos personales.

## Datos y aprobación

`src/config/legal.ts` es la configuración central. El propietario confirmó el 2026-09-07 el nombre legal y titularidad del WhatsApp de Benito Antonio Martínez Ocasio, el domicilio Nacional 36, Metepec, Estado de México, y la atención ARCO inicial por Fabrizio Condes Ballesteros. ARCO: dabtech@gmail.com. WhatsApp: +52 722 357 9869. Datos proporcionados y confirmados para publicación por el propietario de DAB Tech. No se realizó verificación documental por terceros ni revisión jurídica profesional externa.

El aviso R7.2, fechado 2026-09-07, se publica en el build en `/privacidad/`. La aprobación derivada exige los cuatro campos completos y `ownerApproved: true`. El generador aborta antes del empaquetado si esta condición no se cumple.

## WhatsApp y frontera de datos

Las respuestas permanecen en el estado React; recargar las elimina. No se usan cookies, almacenamiento local o de sesión, IndexedDB, Cache Storage, URL ni history state para conservarlas. El resumen visible comparte mapeo con el mensaje. El enlace externo se construye solo al activar el CTA del resultado; se abre una pestaña nueva con `noopener noreferrer` y `Referrer-Policy: no-referrer`.

Abrir WhatsApp comunica el borrador al proveedor. El usuario lo revisa y edita allí antes de enviarlo. DAB recibe el mensaje solamente si el usuario lo envía; la web no muestra una confirmación falsa de envío. En las pruebas se ejecuta el handler real y se cancela la navegación externa para no enviar datos ni abrir conversaciones de prueba.

## Analítica exclusivamente en producción

La integración se incluye únicamente si `VERCEL_ENV=production`, `PUBLIC_SIMPLE_ANALYTICS_ENABLED` no es `false`, `DAB_EVIDENCE` no es `true` y `NODE_ENV` no es `test`. Vercel proporciona `VERCEL_ENV`; no fijarlo manualmente para previews.

Además, el cargador y el adaptador comprueban `location.origin === 'https://dabtech.me'`. Un build de producción abierto en localhost, preview de Vercel u otro dominio no carga la integración. La opción pública `PUBLIC_SIMPLE_ANALYTICS_ENABLED=false` es el interruptor de desactivación. `.env.example` documenta la variable sin secretos; por la exclusión estricta de `.env.*` solicitada no se incluye en el source ZIP, por lo que este documento también describe su contenido.

Se usa el script oficial `https://scripts.simpleanalyticscdn.com/latest.js` y `sa_event(nombre)` con un único argumento. No se carga el script de eventos automáticos ni se habilitan propiedades. Eventos autorizados: view_workflow_demo, start_workflow_demo, click_primary_cta, start_diagnostic, complete_diagnostic, click_whatsapp_handoff. No se envían respuestas, clasificación, proceso, teléfono ni texto personalizado.

La integración puede registrar datos técnicos de visitas y un identificador de carga efímero según el proveedor. El código de DAB no agrega cookies ni identificadores persistentes. Las evidencias comprueban el aislamiento sin cargar el script externo; no afirman medir tráfico real de una cuenta o un despliegue aún inexistentes. En la entrega posterior, el propietario debe comprobar la recepción en su cuenta Simple Analytics para dabtech.me.

## Configuración Vercel

Usar Node.js 22.23.2 de la rama 22, declarada en `.nvmrc` y `package.json`. Importar como proyecto Astro, instalar con `npm ci`, compilar con `npm run build`, servir `dist`. Dominio canónico: `https://dabtech.me`. No se ejecutó importación, despliegue, vinculación de cuenta ni cambio DNS.

`vercel.json` establece CSP, frame-ancestors none, object-src none, base-uri self, form-action self, HSTS, Referrer-Policy, X-Content-Type-Options, X-Frame-Options y Permissions-Policy. La CSP permite los orígenes oficiales de script y cola de Simple Analytics; no permite eval. Mantiene unsafe-inline para el bootstrap de Astro, JSON-LD y estilos existentes. El contenido del usuario se renderiza escapado por React y nunca se introduce en scripts o HTML sin escapar. WhatsApp es una navegación de nivel superior, no un origen de connect-src.

El preview de evidencia aplica exactamente los headers de `vercel.json`; verifica hidratación, navegación, video, fuentes, consola, recursos propios, rutas y 404. HTTPS y la aplicación final de los headers en el edge de Vercel quedan sujetos al despliegue posterior. No hay secretos de servidor necesarios; ningún archivo `.env` ni directorio de dependencias, historial Git o release anterior se incluye en el source.

## Autoridad de empaquetado

Solo `scripts/generate-evidence.js` crea y promueve la pareja canónica. El source usa archivos ordenados y fechas ZIP fijas. Excluye historial Git, node_modules, dist, .astro, evidence, _releases, scratch, archivos .env y .env.*, ZIP, logs, temporales y LATEST_RELEASE.json. Una reconstrucción extraída ejecuta npm ci, npm test, npm run check y npm run build; compara el build con el capturado. La comparación normaliza únicamente los atributos uid generados de astro-island; registra sus hashes originales y exige igualdad byte a byte en el resto del HTML y todos los assets. El manifiesto de evidencia referencia nombre, tamaño y SHA-256 del source real, evitando dependencias circulares. El hash del evidence queda en el puntero externo LATEST_RELEASE.json.

## Fuentes consultadas (2026-09-07)

- Ley vigente: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf (identidad, finalidades, derechos y comunicación de cambios; no se ofrecen plazos inventados).
- Integración oficial: https://docs.simpleanalytics.com/script y https://docs.simpleanalytics.com/events
- Datos técnicos y política del proveedor: https://docs.simpleanalytics.com/data-collection y https://www.simpleanalytics.com/privacy-policy
- CSP del proveedor: https://docs.simpleanalytics.com/csp
- Entornos y headers: https://vercel.com/docs/environment-variables/system-environment-variables y https://vercel.com/docs/project-configuration/vercel-json

## Corrección R7.2-B1

Astro 7.3.1 y @astrojs/react 6.0.5 reemplazan las versiones afectadas; el lockfile resuelve esbuild 0.28.2 y sharp 0.35.4. El generador exige cero vulnerabilidades en `npm audit --json`, incluyendo dependencias de desarrollo, tanto en el proyecto como después de extraer e instalar el source ZIP. Una auditoría fallida o indisponible impide la promoción. Los resultados y el hash del lockfile quedan en la evidencia.

El control de archivos protegidos usa `scripts/frozen-baseline.json`, versionado con el ritmo visual R7.2 aprobado. Rechaza referencias ausentes o diferencias, sin comparar archivos consigo mismos. Las pruebas de copy recompilan siempre. El override de @vitejs/plugin-react 6.1.1 adopta la transformación compatible con Vite 8 y elimina los avisos de opciones esbuild obsoletas.
