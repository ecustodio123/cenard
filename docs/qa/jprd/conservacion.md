# JPRD: inventario de conservación y revisión

Revisión: 28/10/2026. Proyecto React / Vite / TypeScript / React Router. No se encontraron AGENTS.md aplicables en el repositorio ni sus ancestros. Se revisaron App, ServicePage, ArbitrationPage, estilos y catálogo documental antes de implementar.

## Fuentes y alcance

- Fuente institucional: https://cenardarbitraje.com/web/jprd/ (HTML público contrastado con el catálogo).
- Copia existente: `docs/source/jprd.json`.
- V2 y referencia visual alojadas: https://cenard.pages.dev/web/jprd/ y https://cenard.pages.dev/web/arbitraje/ no respondieron al lector web. La implementación local aprobada de Arbitraje se usa como referencia visual y se conservan sus estilos sin editarlos.
- Se conservan las referencias a Reglamento de la Ley 32069, alcance temporal para obras/suministro, prestaciones adicionales/excepciones, carácter obligatorio e inmediato de resoluciones y Directiva 4–2025–OECE–CD, numeral 8.2.7.2 / 2000 UIT. Se atribuyen a la fuente antigua y requieren validación jurídica institucional, sin afirmar vigencia.
- Tres funciones JPRD adaptadas editorialmente de la fuente; pendientes de aprobación. No son etapas del procedimiento ni prestaciones de Arbitraje.
- Se mantiene CTA/footer global. No FAQ de Arbitraje, históricos ni reglamento procesal de Arbitraje.

## Accesos literales

- Cálculo de tarifas: `/web/calculadora` (no tiene ruta visible: la calculadora sigue deshabilitada; no se crea alias ni se prueba su funcionamiento).
- Atalaya de Integridad: `/web/atalaya-de-integridad` (ruta existente).
- Nómina de adjudicadores: `/web/nomina-de-adjudicadores` (ruta existente).
- Portal Atenea: `https://sistema.cenardarbitraje.com/login` (nueva pestaña, noopener/noreferrer, indicación Sitio externo). No visitado.
- Repositorio: `/web/documentos/?servicio=JPRD`.
- Contacto: `/web/contacto/`.

## Fotografía provisional

- Archivo: `public/assets/jprd/construccion-provisional.webp`, 960 × 720, WebP optimizado. Única fotografía nueva.
- Autor: Bernd Dittrich (@hdbernd).
- Fuente: https://unsplash.com/photos/a-crane-is-standing-in-front-of-a-building-under-construction-_MdxCY0eFSs
- Recurso original del banco: https://images.unsplash.com/photo-1693974435376-4301ed942301 (descarga oficial sin marca de agua, optimizada a 960 px).
- Licencia: Unsplash License, https://unsplash.com/license (consultada el 28/10/2026). Permite descarga, modificación y uso comercial/no comercial; no permite revender imágenes sin modificación significativa ni crear un servicio competidor recopilándolas.
- Obra ilustrativa en Walldorf, Alemania, según el autor. No se atribuye a CENARD. La aclaración es visible en el pie de imagen. Configuración aislada y atributo data-provisional para reemplazo sin rehacer composición. No hotlinking.

## Documentos conservados

Se usan los siete registros existentes de JPRD, ordenados por su referencia de la fuente. Las siete URLs coinciden con el HTML original consultado. Un único grupo desde el 04/08/2025, abierto por defecto, sin inferir fechas individuales ni vigencia.

- **Código de ética 2025**: https://cenardarbitraje.com/web/wp-content/uploads/2025/11/CODIGO-DE-ETICA.pdf
- **Reglamento de JPRD 2025**: https://cenardarbitraje.com/web/wp-content/uploads/2025/11/REGLAMENTO-DE-JPRD.pdf
- **Reglamento interno 2025**: https://cenardarbitraje.com/web/wp-content/uploads/2026/07/REGLAMENTO-INTERNO-CENARD.pdf
- **Directiva 01 incorporación y renovación**: https://cenardarbitraje.com/web/wp-content/uploads/2025/08/Directiva-01-Incorporacion-y-Renovacion.pdf
- **Reglamento de costos 2025**: https://cenardarbitraje.com/web/wp-content/uploads/2026/05/REGLAMENTO-DE-COSTOS-2025-ACTUALIZADO.pdf
- **Fichas de renovación árbitro / adjudicador**: https://cenardarbitraje.com/web/wp-content/uploads/2025/11/Ficha-renovacion.pdf
- **Fichas de inscripción árbitro / adjudicador**: https://cenardarbitraje.com/web/wp-content/uploads/2025/11/FICHAS-1.pdf

## Implementación y comprobaciones

Archivos: `src/pages/Jprd.tsx`, `src/pages/jprd.css`, `src/App.tsx`, `scripts/verify-build.mjs`, imagen local y esta carpeta de QA. Se reutiliza `arbitration.css` sin modificarlo, con extensiones CSS limitadas a `.jprd-page`. No se cambian catálogos, textos oficiales de PDFs, header/footer ni otras páginas. App monta la cabecera propia solo en JPRD y conserva su ruta.

- `npm run build`: correcto. La primera ejecución detectó el enlace literal obligatorio `/web/calculadora`, actualmente sin página habilitada. Se añadió una excepción explícita y limitada a ese href de JPRD en el verificador, con aviso visible, sin habilitar calculadora ni crear rutas.
- `npm run lint` y `git diff --check`: correctos.
- Navegador local: 320, 390, 768, 1024 y 1440 px, sin overflow horizontal y con un H1. Nombre completo visible con saltos naturales. Panel de recursos en 1/2/4 columnas. Párrafos de funciones y acciones de recursos alineados en escritorio.
- Biblioteca: siete documentos en el orden de la fuente, un único grupo abierto inicialmente; no hay históricos ni reglamento procesal de Arbitraje. Todos los PDF identifican nueva pestaña y usan noopener/noreferrer. URLs verificadas contra el HTML original; no se auditaron los contenidos de los PDF.
- Controles documentales y normativos comprobados con Enter: apertura/cierre, texto de estado y estado nativo accesible. Foco visible de 3 px. Cuerpo normativo limitado a 76ch.
- Ancla Consultar normativa: encabezado a 138.6 px y header hasta 93 px en escritorio, sin ocultarlo.
- Hrefs de los cuatro recursos comprobados mediante DOM sin navegarlos. No se visitó Atenea ni se probó calculadora.
- Arbitraje renderizado y revisado a 1440 px sin regresión visual; sus archivos y estilos no se modificaron. Captura de comprobación incluida.
- CTA y footer permanecen en la composición global. Sin flechas, chevrones ni breadcrumbs añadidos.

## Limitaciones y pendientes

El destino `/web/calculadora` sigue deshabilitado. Textos editoriales, aplicabilidad/vigencia documental, agrupación temporal y afirmaciones jurídicas de la fuente requieren aprobación de CENARD. La foto tiene licencia Unsplash registrada, pero es provisional y no representa obras ni personal de CENARD. Revisión en un navegador local; no equivale a auditoría formal de accesibilidad o validez jurídica. Sin publicación ni push.
