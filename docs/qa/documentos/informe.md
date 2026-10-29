# Biblioteca documental: entrega y verificación

28/10/2026. React/Vite/TypeScript. Se revisaron la lógica existente, los consumidores de componentes UI, los estilos aprobados de Arbitraje y el catálogo antes de implementar. No se encontraron AGENTS.md aplicables en la revisión del repositorio y sus ancestros realizada durante esta sesión. Las URLs alojadas de referencia no respondieron al lector web; se utilizaron las páginas aprobadas disponibles en el proyecto local.

## Cambios

Cabecera editorial compacta sin fotografía; panel integrado de búsqueda y filtros; botones de selección única para servicio con aria-pressed y subrayado; selectores nativos; criterios activos eliminables; dos grupos abiertos con conteos dinámicos; filas de 100 px en escritorio y altura natural en móvil; nota institucional al final; accesos separados a certificaciones y DOCX de reclamaciones.

La búsqueda ahora incluye título, tipo y servicios, normaliza acentos/mayúsculas y se combina por intersección con filtros. Sigue sin consultar el contenido de los PDF. La URL es la fuente de estado; cambios discretos de filtro crean entradas navegables y la escritura reemplaza la entrada actual para no crear historial por cada carácter. Se conservan parámetros ajenos a los cuatro filtros al restablecer.

## Archivos de esta entrega

- `src/pages/Documents.tsx`: página específica y controles.
- `src/pages/documents.css`: estilos aislados mediante prefijo doclib.
- `src/lib/document-search.ts`: búsqueda localizada por metadatos.
- `src/pages/Resources.tsx`: se extrae únicamente DocumentsPage y se limpian sus importaciones; se preservan los cambios previos del usuario en otras secciones.
- `src/App.tsx`: monta DocumentsPage con cabecera propia, sin cambiar ruta ni metadatos.
- `src/pages/Institution.tsx`: se elimina únicamente una importación de InfoNote ya sin uso por cambios previos, que bloqueaba TypeScript; no se cambia su contenido visual.
- `scripts/document-search.test.ts`: siete pruebas de aceptación del catálogo.
- Esta carpeta: inventarios antes/después y capturas.

No se modifican los componentes compartidos DocumentRow, EmptyState, PageIntro ni estilos globales; Arbitraje y JPRD conservan sus archivos y diseño. No se modifican datos ni PDFs, rutas, SEO, header/footer/CTA, dependencias, backend o sistemas externos. Sin publicación ni push.

## Inventario antes y después

16 registros en ambos inventarios, 21 referencias por servicio, cinco archivos compartidos, nueve registros en la agrupación desde el 04/08/2025 y siete históricos. Igualdad completa comprobada mediante SHA-256 del catálogo y comparación de id, título, URL, servicios, tipo, agrupación y validación. `inventario-antes.json` e `inventario-despues.json` son idénticos. Las dos Directivas 01 permanecen separadas.

SHA-256 del catálogo: `edf06f15a991dbd26cf81cc2beef500063886a4dfc5185b5f0d98e8548bc3955`.

| Documento | Servicio | Tipo | Agrupación | URL original |
|---|---|---|---|---|
| Código de ética 2025 | Arbitraje, JPRD | Código de ética | desde el 04/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2025/11/CODIGO-DE-ETICA.pdf) |
| Reglamento procesal y apéndices 2025 | Arbitraje | Reglamento | desde el 04/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2026/05/Reglamento-Procesal-y-Apendices-2025-1.pdf) |
| Reglamento interno 2025 | Arbitraje, JPRD | Reglamento | desde el 04/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2026/07/REGLAMENTO-INTERNO-CENARD.pdf) |
| Directiva 01 incorporación y renovación | Arbitraje | Directiva | desde el 04/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2026/07/Directiva-01-Incorporacion-y-Renovacion.pdf) |
| Reglamento de costos 2025 | Arbitraje, JPRD | Reglamento | desde el 04/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2026/05/REGLAMENTO-DE-COSTOS-2025-ACTUALIZADO.pdf) |
| Fichas de renovación árbitro / adjudicador | Arbitraje, JPRD | Ficha | desde el 04/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2025/11/Ficha-renovacion.pdf) |
| Fichas de inscripción árbitro / adjudicador | Arbitraje, JPRD | Ficha | desde el 04/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2025/11/FICHAS-1.pdf) |
| Directiva sobre costos para medidas de emergencias – arbitro de emergencia | Arbitraje | Directiva | hasta el 03/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2025/05/CNR-Arbitraje-Sobre-los-costos-para-procedimientos-de-emergencia-.pdf) |
| Directiva de elección de árbitro y escrutinio 2024 | Arbitraje | Directiva | hasta el 03/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2025/05/Directiva-de-Eleccion-de-Arbitro-y-Escrutinio-2024.pdf) |
| Reglamento procesal de arbitraje 2023 | Arbitraje | Reglamento | hasta el 03/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2025/05/Reglamento-Procesal-de-Arbitraje.pdf) |
| Código de ética | Arbitraje | Código de ética | hasta el 03/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2025/05/CODIGO-DE-ETICA-CENARD-2023-2024-3.pdf) |
| Reglamento para arbitraje acelerado | Arbitraje | Reglamento | hasta el 03/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2025/05/Reglamento-Arbitraje-Acelerado-2023-1.pdf) |
| Reglamento de costo 2024 | Arbitraje | Reglamento | hasta el 03/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2025/05/Reglamento-de-Costos-2024-2.pdf) |
| Reglamento de costos para cuantías indeterminadas 2024 | Arbitraje | Reglamento | hasta el 03/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2025/05/Reglamento-de-Cuantias-Indeterminadas-2024.pdf) |
| Reglamento de JPRD 2025 | JPRD | Reglamento | desde el 04/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2025/11/REGLAMENTO-DE-JPRD.pdf) |
| Directiva 01 incorporación y renovación | JPRD | Directiva | desde el 04/08/2025 | [PDF](https://cenardarbitraje.com/web/wp-content/uploads/2025/08/Directiva-01-Incorporacion-y-Renovacion.pdf) |

## Pruebas y resultados

- `node --test scripts/document-search.test.ts`: 7/7 correctas. Integridad, asociaciones, intersección, búsqueda sin acentos/mayúsculas, vacío/restablecimiento y Directivas 01 diferenciadas.
- `npm run build`: correcto, incluyendo verificación existente. Persiste el aviso ya documentado de JPRD sobre su destino obligatorio de calculadora deshabilitado, ajeno a esta entrega.
- `npm run lint` y `git diff --check`: correctos.
- Navegador: 16 sin filtros, Arbitraje 14, JPRD 7, JPRD + Reglamento 3, búsqueda JPRD 7, CUANTIAS 1 con singular, búsqueda inexistente 0 y estado vacío. Restablecer devuelve 16.
- Borrar búsqueda conserva servicio; quitar agrupación conserva servicio; quitar servicio devuelve el catálogo sin restricciones. Criterios visibles en estado vacío.
- Apertura directa con `?servicio=Arbitraje&estado=historico`: 7 y solo encabezado histórico. Recarga conserva 7. Apertura con los cuatro parámetros `q=costos&servicio=JPRD&tipo=Reglamento&estado=reciente`: 1.
- Atrás y adelante: desde JPRD + Reglamento (3), atrás vuelve a JPRD (7), adelante recupera 3. Recarga conserva 3 sin sobrescribir parámetros.
- Enlaces reales Ver toda la normativa desde Arbitraje y JPRD navegan a los filtros correctos y muestran 14 y 7 respectivamente.
- Teclado: foco de 3 px comprobado en servicios y filas. La búsqueda mantiene el foco en el campo. Resultado con aria-live polite y aria-atomic; no se programa scroll al cambiar parámetros.
- Se revisaron 320, 390, 768, 1024 y 1440 px: un H1, 16 filas sin filtros y sin overflow horizontal en todos. Panel apilado en móvil, dos columnas en tablet y tres controles alineados en escritorio. Filas móviles sin truncar títulos, acción debajo; filas de escritorio medidas a 100 px.
- PDF: todos conservan nueva pestaña, noopener/noreferrer y anuncio accesible. No se abrieron los archivos ni se validó su contenido jurídico.
- Páginas Arbitraje y JPRD renderizadas para regresión; CSS y componentes visuales compartidos sin cambios. Capturas en esta carpeta.

## Limitaciones y pendientes de CENARD

Vigencia, versión y aplicación documental siguen pendientes de confirmación institucional. Se conserva la organización temporal de la fuente sin convertirla en declaración de vigencia. Las advertencias se concentran junto a filtros y al final, sin repetirse en todas las filas. La revisión se realiza en un navegador local y no equivale a auditoría formal de accesibilidad ni a validación jurídica. No se altera el contenido de los PDFs ni se verifica su disponibilidad en todos los navegadores.
