# Verificación de la preview

Revisión local: 24 de octubre de 2026. Navegador integrado de Codex, aplicación compilada servida mediante Vite Preview. Ninguna acción se realizó en formularios o sistemas de producción.

## Comprobaciones realizadas

- `npm run build`: TypeScript, bundle de Vite, HTML prerenderizado de 15 rutas, alias raíz y 404. La verificación de build comprueba un H1 por ruta, títulos y descripciones únicos, una directiva robots y destinos internos existentes.
- `npm test`: dos pruebas con múltiples casos de formato monetario y campos de las seis modalidades. Incluyen coma/punto decimal, vacío, cero, negativos, cantidades grandes, importes ambiguos, PEN/USD, composición arbitral, reconvención, servicios adicionales y etapas de devolución. No se probaron tramos tarifarios porque no hay motor ni reglas aprobadas.
- `npm run lint`: sin avisos ni errores en la versión entregada.
- **105 vistas**: las 15 rutas en 320, 375, 390, 430, 768, 1024 y 1440 px. Comprobación del ancho del documento contra el viewport, un H1 y ausencia de enlaces `href="#"` o vacíos. Resultado: sin incidencias en esas comprobaciones. Datos en `layout-checks.json`.
- **18 capturas**: inicio, Arbitraje, nómina de árbitros, biblioteca, certificaciones y calculadora a 390, 768 y 1440 px. Inspección visual adicional del escritorio y de la vista de 320 px.
- Biblioteca: búsqueda de “ética”, filtro JPRD, estado sin resultados y restablecimiento. Los filtros se representan en la URL; se comprobó además la apertura directa con query string sobre el HTML estático.
- Nómina: “andia” encuentra dos registros de Andía en grupos diferentes, sin exigir tilde ni mayúscula; el filtro de contratación pública lo reduce a un registro. Un solo botón por letra en el índice.
- Menú: abre en móvil, enfoca el primer enlace, cierra con Escape y devuelve foco al botón. La selección de destino cierra el menú. El desplegable de escritorio cierra con Escape y fuera del menú; se utiliza agrupación exclusiva nativa.
- FAQ: el acordeón de inicio del proceso muestra la respuesta original al activarse. Se usan `details/summary`, sin dependencias de hover.
- Calculadora: validación de entrada vacía, revisión de un importe con coma, campos de emergencia, cuantía indeterminada sin monto, servicios adicionales/copia certificada y junta con cuantía opcional. Se mantiene el estado explícito de cálculo no disponible. Los valores monetarios nunca se calculan ni se envían a un servidor.
- Archivos: **22 URLs de archivo distintas**, correspondientes a 27 referencias de página, respondieron HTTP 200 en la comprobación HEAD con redirecciones. `recursos-http.json` registra los resultados; esta respuesta no certifica el contenido o vigencia legal de los archivos.
- Contraste: pares principales medidos matemáticamente y registrados en `contraste.md`. El texto sobre la foto del hero utiliza una superficie oscura opaca. No se utilizó una puntuación Lighthouse ni se inventó una certificación AA global.
- Fuentes locales, imágenes optimizadas con variantes responsivas y dimensiones, lazy loading de imágenes secundarias, skip link, foco visible y estilos de `prefers-reduced-motion` incluidos. No hay analítica.

## Salida de compilación observada

Vite 8.3.5. Aproximadamente 512 kB de JavaScript total minificado en cuatro archivos compartidos (151 kB gzip); CSS 62 kB (13 kB gzip). Estas cifras son tamaños de bundle, no una medición de velocidad real ni Core Web Vitals. El HTML de cada ruta puede leerse sin ejecutar JavaScript.

## Límites de esta revisión

- Las verificaciones de layout detectan desbordamientos generales, no todos los posibles problemas visuales de cualquier dispositivo. Las capturas se revisaron en el navegador integrado, no en todos los navegadores comerciales.
- No se realizaron pruebas completas con lector de pantalla, auditoría automática de todas las combinaciones de contraste, Lighthouse, medición de producción ni simulación de preferencias del sistema. Se revisó la regla de movimiento reducido, sin cambiar configuraciones del equipo.
- La preview de Vite no sustituye la configuración del hosting final. Deben definirse resolución de rutas, códigos HTTP 404 y conservación de archivos antes de publicar.
- Permanecen las aprobaciones editoriales, jurídicas, de vigencia, licencias de imágenes y tarifas descritas en `docs/pendientes-cliente.md`.
- Mesa de Partes y Atenea fueron excluidos; no se visitaron, auditaron ni reconstruyeron. No se enviaron formularios del sitio original.
