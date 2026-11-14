# Informe: Seguridad en PWA

## Proyecto y objetivo

**Proyecto:** PWA Multiverso, explorador de personajes de Rick and Morty.

El objetivo es demostrar HTTPS, validación de formularios, saneamiento de entradas y políticas CSP en una PWA Angular.

## 1. Certificado digital y HTTPS

El despliegue recomendado para este taller es Netlify. La configuración está en [`netlify.toml`](netlify.toml) y Netlify proporciona certificado TLS automático y una URL pública HTTPS.

Como alternativa, el workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) permite publicar en GitHub Pages. GitHub Pages también proporciona certificado TLS, pero no permite configurar cabeceras HTTP personalizadas.

URL de GitHub Pages alternativa:

`https://la00429.github.io/PWAExplore/`

Después del primer despliegue, tomar una captura de:

1. La URL con `https://`.
2. El candado del navegador y el certificado.
3. La ejecución exitosa del workflow **Deploy PWA to GitHub Pages**.

## 2. Validación y saneamiento de formularios

El formulario del explorador aplica:

- Longitud máxima de 50 caracteres para nombre y 40 para especie.
- Validación por patrón: letras, números, espacios, punto, apóstrofe y guion.
- Eliminación de caracteres no permitidos.
- Normalización de espacios y eliminación de espacios al inicio y final.
- Mensaje visual cuando una entrada no cumple las reglas.
- Interpolación de Angular para evitar insertar texto de usuario como HTML.

Capturas recomendadas:

1. Introducir caracteres inválidos y mostrar el mensaje de validación.
2. Realizar una búsqueda válida y mostrar **Consulta validada y saneada**.
3. Abrir DevTools y mostrar que la entrada se transporta como parámetro de consulta, no como HTML ejecutable.

## 3. Content Security Policy (CSP)

La política está en `public/_headers` mediante la cabecera HTTP `Content-Security-Policy`. También existe una política equivalente en `src/index.html` como respaldo para entornos estáticos que no permiten cabeceras personalizadas:

| Requisito | Directiva implementada |
|---|---|
| Prevenir XSS y limitar orígenes | `default-src 'self'` y listas explícitas |
| JavaScript | `script-src` y `script-src-elem` |
| CSS, imágenes y fuentes | `style-src`, `img-src` y `font-src` |
| Bloquear objetos | `object-src 'none'` |
| Bloquear marcos | `frame-src 'none'` y `frame-ancestors 'none'` |
| Hash de script | fuente `sha256-...` documentada en `script-src-elem` |
| Políticas por ubicación/esquema | `'self'`, `https://cdn.jsdelivr.net` y `https://rickandmortyapi.com` |
| Control estricto | `base-uri 'self'`, `form-action 'self'`, `manifest-src 'self'` |
| Strict Dynamic | `'strict-dynamic'` en `script-src` |

La política también incluye `worker-src 'self'` para el Service Worker de la PWA.

Capturas recomendadas:

1. DevTools > Network > documento principal > Response Headers mostrando `content-security-policy`.
2. DevTools > Console sin errores de violación CSP durante el uso normal.
3. Intentar cargar un recurso no permitido y capturar el mensaje `Refused to load...` en Console.
4. DevTools > Application mostrando el Service Worker activo.

## 4. HTTPS obligatorio

Se usan dos controles:

- GitHub Pages entrega la aplicación mediante HTTPS.
- `upgrade-insecure-requests` convierte solicitudes HTTP de recursos en HTTPS.
- `block-all-mixed-content` bloquea contenido mixto inseguro.

La API consumida ya utiliza `https://rickandmortyapi.com`. Bootstrap, Bootstrap Icons y Animate.css se empaquetan localmente para evitar dependencias de almacenamiento de terceros y reducir avisos de privacidad del navegador.

## Conclusión

La aplicación combina TLS del hosting, validación y saneamiento en el cliente, restricciones de origen mediante CSP y políticas para evitar recursos inseguros. Las capturas deben mostrar tanto la configuración como el comportamiento observable en el navegador.
