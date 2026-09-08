# DAB Tech Landing

Landing estática en Astro y React para `https://dabtech.me`. Conserva el diagnóstico efímero de tres pasos y la demo RFQ de siete pasos.

## Desarrollo y validación

Requiere Node.js 22.23.2 de la rama 22, npm y las dependencias del lockfile. `.nvmrc` fija la versión local y `engines` restringe la versión de despliegue.

```bash
npm ci
npm test
npm run check
npm run build
npm run preview
```

La prueba de copy siempre recompila para validar el código actual, aunque exista `dist`. El build produce `dist/`, incluidas `/`, `/privacidad/`, `404.html`, robots y sitemap.

## Release reproducible

```bash
node scripts/generate-evidence.js
```

El generador necesita Chrome headless, Python 3, zip, unzip, ffmpeg y npm. Aísla analítica y navegación externa en pruebas, captura páginas nuevas, mide los gates, empaqueta el source y lo reconstruye en un directorio temporal con `npm ci`. Solo después crea evidencia vinculada por SHA-256, archiva los ZIP anteriores y actualiza `LATEST_RELEASE.json`.

Produce únicamente `dab-landing-source-r7.2.zip` y `evidence-r7.2.zip` en la raíz. La evidencia incluye resultados reales, capturas, Lighthouse, manifiesto y reconstrucción limpia. No despliega.

Consulta `PRODUCTION_HANDOFF.md` para condiciones de activación, seguridad, límites de las pruebas y operación posterior en Vercel.

## Organización del repositorio

`src/` contiene la landing; `public/`, los recursos publicados; `tests/`, las pruebas; y `scripts/generate-evidence.js`, el generador de entregas. La configuración de despliegue está en `vercel.json`.

El material histórico y las evidencias locales se conservan en `_local/`, excluido de Git. Las dependencias, compilaciones, credenciales locales y entregas generadas tampoco se versionan. No se requiere ese material para instalar o compilar el proyecto.

El gate visual utiliza `scripts/frozen-baseline.json`, versionado con el ritmo R7.2 aprobado. Si falta la referencia, un hash o cambia un archivo protegido, aborta antes de generar evidencia. Normaliza únicamente saltos de línea LF/CRLF.

Se fija `@vitejs/plugin-react` 6.1.1 para Vite 8 mediante un override acotado a la integración Astro React. Esta landing no configura opciones Babel.
