# Directorio de árbitros: entrega y verificación

## Conservación

| Grupo | Antes | Después |
|---|---:|---:|
| Nacionales | 92 | 92 |
| Contratación pública | 40 | 40 |
| Total de registros | 132 | 132 |

Los inventarios antes y después son idénticos. Comparación completa de registros y SHA-256 del JSON original, que incluye también adjudicadores. No se modifica la fuente de datos, corrigen nombres, completan ausencias ni fusionan coincidencias. Dos registros de Andía Espinoza, Helmuth Aarón se conservan con ids ar-0-1 y ar-1-92 y sus diferentes datos publicados.

## Cambios y archivos

- `src/pages/Arbitrators.tsx`: página específica, cabecera de Recursos con periodo publicado 2025, filtros y criterios activos, índice alfabético, tabla/fichas, paginación y bloque de incorporación/renovación.
- `src/pages/arbitrators.css`: estilos exclusivos mediante prefijos arb y arb-directory.
- `src/lib/arbitrator-directory.ts`: intersección de filtros, orden estable y paginación en memoria de 20 registros.
- `scripts/arbitrator-directory.test.ts`: siete pruebas de aceptación.
- `src/components/ResourceUI.tsx`: ResourceHeader admite contenido secundario opcional para el periodo, sin cambiar su salida en Documentos.
- `src/App.tsx`: monta ArbitratorsPage en la ruta existente con su cabecera propia. No se alteran rutas ni metadatos.
- Esta carpeta: capturas e inventarios.

Se reutilizan ResourceHeader, ResourceFilterPanel, ResourceResults, ResourceCriteria, ResourceEmpty, HighlightedText y Combobox. La representación específica de profesionales permanece separada. Resources.tsx y la nómina de adjudicadores no se modifican. No se cambia Documentos visualmente, header, CTA, footer, SEO o sistemas externos. Sin publicación ni push.

## Datos y navegación

La fuente anterior tenía filtros locales, sin parámetros de URL implementados. Se agregan q, grupo, profesion, inicial y pagina. Los parámetros ajenos y el fragmento se conservan al editar/restablecer los filtros. Escritura de búsqueda reemplaza la entrada actual; filtros y páginas generan entradas navegables. Todos los cambios de criterio eliminan pagina. Páginas inválidas se ajustan con replace, sin perder filtros ni generar páginas vacías.

Orden alfabético por nombre publicado, con desempate por grupo e identificador; no implica eliminación de duplicados. Iniciales disponibles derivadas de la fuente completa, como en la política previa. Buscar y resaltar ignora mayúsculas y acentos, manteniendo la escritura original y tratando símbolos literalmente.

Las ausencias se representan por — con una aclaración; los valores originales permanecen intactos. Tabla semántica de cuatro columnas en escritorio; fichas etiquetadas en móvil. Solo se monta una representación mediante media query y useSyncExternalStore, sin duplicar nombres entre tabla y fichas en el árbol accesible. El servidor presenta tabla y la hidratación la adapta a móvil.

La paginación usa botones textuales sin flechas, 20 registros como máximo, números calculados y puntos suspensivos compactos en móvil. Solo una acción explícita de página enfoca y desplaza el resumen de resultados. La escritura y cambios de filtros no programan desplazamiento. Se respetan las reglas globales existentes de movimiento reducido.

Incorporación mantiene el contenido y correo mesadepartes@cenardarbitraje.com. Fichas enlaza a `/web/documentos/?servicio=Arbitraje&tipo=Ficha`. La Directiva 01 se obtiene del registro directiva-01-arbitraje del catálogo único, URL de Arbitraje en /2026/07/, conservando su diferenciación respecto de JPRD. No se atribuyen requisitos nuevos ni se promete incorporación.

## Pruebas

- `node --test scripts/arbitrator-directory.test.ts scripts/document-search.test.ts scripts/highlight.test.ts`: 20/20 correctas.
- `npm run build`, `npm run lint`, `git diff --check`: correctos. Aviso preexistente de ruta de calculadora deshabilitada en JPRD sin cambios.
- Navegador: 132 sin filtros; Andia devuelve las dos entradas originales y resalta Andía; Contratación pública devuelve 40; grupo + Abogado + A devuelve 4. Recarga conserva 4, atrás devuelve 40 y adelante 4.
- Recorrido real de las siete páginas: tamaños 20,20,20,20,20,20,12. Total 132 identificadores de registro, sin pérdidas ni repeticiones entre páginas.
- Foco tras paginar: resultados-arbitros a 134.6 px, header hasta 93 px en escritorio. Activación de Siguiente con Enter lleva a página 2, enfoca resultados y muestra 20 filas.
- Filtrar desde página 7 vuelve a la primera, sin dejar una página vacía. Búsqueda inexistente muestra estado vacío y cero controles de paginación; restablecimiento recupera 132.
- Entrada directa `?q=Andia&pagina=999`: ajusta a pagina=1, mantiene consulta y devuelve dos entradas. Recarga conserva resultado e ids.
- Escritura desde Contratación pública/página 2 elimina pagina, devuelve 1 registro al buscar Andia, conserva foco arb-search y scroll sin cambios. Borrar búsqueda conserva grupo y recupera 40.
- 320, 390, 768, 1024 y 1440 px: un H1, sin overflow horizontal, 20 registros montados en vista sin filtros. Móvil: cero tablas y 20 fichas; escritorio/tablet: una tabla y cero fichas. Controles de letras cómodos y distribuidos en varias líneas; paginación móvil compacta.
- Documentos renderizado sin cambios visuales y 16 resultados; adjudicadores conserva su presentación y 27 registros. Capturas de regresión incluidas.

## Pendientes

Periodo publicado 2025, sin confirmar vigencia actual. CENARD debe validar vigencia y datos de origen; no se deducen identidad o cualificación por nombres similares o campos vacíos. Revisión local en un navegador; no sustituye auditoría formal con lectores de pantalla. No se activan expedientes, perfiles, exportaciones, backend o calculadora.
