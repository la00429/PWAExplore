# PWA Multiverso - Solución Completa del Taller Angular PWA

Proyecto actualizado a Angular 22 y TypeScript 6.

Esta es la solución del taller de **PWA con Angular** (UPTC - Electiva III), que incluye las **4 funcionalidades obligatorias**:

1. **Captura de Datos (Formulario de Búsqueda)**: Filtro dinámico por nombre, estado (Alive, Dead, Unknown) y especie consumiendo la API pública de Rick & Morty.
2. **Visualización en Tablas Interactivas**: Tabla responsiva estilizada con Bootstrap 5, paginación, cambio a modo cuadrícula y vistas de detalle.
3. **CRUD Local (Guardar, Modificar y Eliminar en Local)**: Persistencia local usando LocalStorage / IndexedDB mock para guardar notas personalizadas, editarlas y eliminarlas offline.
4. **Capacidades PWA & Service Worker**: Configuración completa de `@angular/pwa`, estrategia de caché para llamadas API en `ngsw-config.json`, archivo `manifest.webmanifest` e indicador dinámico de conexión Online/Offline.

---

## Instrucciones de Ejecución

1. **Descomprimir e Instalar**:
   ```bash
   cd PWAExplorador
   npm install
   ```

Se recomienda usar una versión LTS par de Node.js compatible con Angular 22 (por ejemplo, Node.js 24 LTS).

2. **Ejecutar servidor de desarrollo**:
   ```bash
   npm start
   ```
   Acceda a `http://localhost:4200/` en su navegador.

3. **Probar Service Worker y Modo Offline**:
   ```bash
   npm run build
   ```
   Sirva los archivos compilados en la carpeta `dist/pwa-explorador/browser` con Live Server o `npx serve dist/pwa-explorador/browser`.

4. **Instalar como PWA**:
   ```bash
   npx serve dist/pwa-explorador/browser
   ```
   Abra la dirección HTTPS o `http://localhost` que muestra el servidor. En Chrome o Edge aparecerá el botón **Instalar aplicación** cuando el navegador valide el manifest y el Service Worker. El servidor de desarrollo (`npm start`) sirve para desarrollar, pero la instalación PWA se debe comprobar con la compilación de producción.

## Componentes PWA y almacenamiento local

- `@angular/service-worker` registra el Service Worker en producción.
- `ngsw-config.json` define la caché de archivos, iconos y respuestas de la API.
- `public/manifest.webmanifest` define el nombre, iconos, colores y modo instalable.
- `LocalDatabaseService` usa IndexedDB para guardar favoritos de forma persistente y offline.
- Las operaciones de guardar, editar y eliminar retornan `Promise`, por lo que las pantallas usan `async/await`.
- Los favoritos creados por versiones anteriores en `localStorage` se migran automáticamente a IndexedDB.

## Taller de seguridad

La implementación del taller está documentada en [`INFORME_SEGURIDAD_PWA.md`](INFORME_SEGURIDAD_PWA.md) e incluye:

- Validación y saneamiento del formulario de búsqueda.
- Política CSP para scripts, estilos, imágenes, conexiones, objetos y Service Worker.
- Hash de script y `strict-dynamic`.
- Despliegue automatizado a GitHub Pages mediante HTTPS en [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).
- Despliegue alternativo en Netlify con cabeceras HTTP CSP en [`netlify.toml`](netlify.toml) y [`public/_headers`](public/_headers).
