# Nómina de adjudicadores: entrega

## Inventario y conservación

| Grupo | Antes | Después |
|---|---:|---:|
| Contratación pública | 27 | 27 |
| Total de registros | 27 | 27 |

No hay grupos adicionales en el catálogo de adjudicadores. Se registró este inventario antes de retirar el selector de grupo de una sola opción. Los inventarios antes y después son idénticos y el SHA-256 del JSON global también: nombres, profesiones, especialidades, grupo, periodo y ausencias sin cambios, incluidos todos los datos de árbitros. No se completan campos mediante otras nóminas ni se fusionan registros.

## Diseño e interacción

Página hermana de Árbitros: cabecera crema y periodo publicado 2025, panel blanco integrado, búsqueda resaltada, Combobox de profesión generado desde los datos, iniciales publicadas, contador y criterios eliminables. Grupo publicado como contexto común, sin repetirlo en cada fila.

Tabla de tres columnas en escritorio y fichas etiquetadas en móvil. Se conservan las especialidades publicadas llamadas Contratación Pública, aunque el grupo tenga la misma denominación. Los vacíos se muestran con —, con explicación del significado. No se crean fotografías, perfiles ni enlaces sobre nombres sin destino.

Dos páginas de 20 y 7 registros. La paginación se oculta si solo hay una página, manteniendo el rango. Los filtros se aplican antes de paginar; cambios de criterio y restablecimiento reinician página. Las páginas inválidas se ajustan sin perder filtros. Solo paginar programa foco y scroll al resumen, respetando la preferencia global de movimiento reducido.

## Componentes reutilizados y archivos

- `src/pages/Adjudicators.tsx`: página específica y contenido de JPRD.
- `src/pages/adjudicators.css`: solo ajustes con ámbito adj-directory; reutiliza arbitrators.css sin editarlo.
- `src/components/DirectoryPagination.tsx`: extracción exacta de la paginación de Árbitros; hideSingle es opcional y solo lo activa adjudicadores.
- `src/lib/use-directory-mobile.ts`: extracción del mismo media query para montar una única representación accesible.
- `src/lib/arbitrator-directory.ts`: expone el filtro/orden/paginación para ambas clases de registro; arbitratorResults conserva su comportamiento mediante wrapper.
- `src/pages/Arbitrators.tsx`: únicamente sustituye código idéntico por el componente y hook compartidos; presentación y datos intactos.
- `src/App.tsx`: monta la cabecera y página propia en la ruta existente, sin cambios de SEO ni rutas nuevas.
- `scripts/adjudicator-directory.test.ts`: seis pruebas específicas.
- Esta carpeta: inventarios y capturas.

Se reutilizan también ResourceHeader, ResourceFilterPanel, ResourceResults, ResourceCriteria, ResourceEmpty, HighlightedText y Combobox. No se modifican header/CTA/footer, documentos oficiales, Arbitraje, JPRD, calculadora o servicios externos.

## Destinos de incorporación y renovación

- Fichas: `/web/documentos/?servicio=JPRD&tipo=Ficha`.
- Directiva: registro directiva-01-jprd del catálogo único; https://cenardarbitraje.com/web/wp-content/uploads/2025/08/Directiva-01-Incorporacion-y-Renovacion.pdf (con anuncio de PDF en otra pestaña).
- Se conserva mesadepartes@cenardarbitraje.com, sin afirmar requisitos o garantías de admisión.

## Pruebas

- 26/26: `node --test scripts/adjudicator-directory.test.ts scripts/arbitrator-directory.test.ts scripts/document-search.test.ts scripts/highlight.test.ts`.
- `npm run build`, `npm run lint` y `git diff --check`: correctos. Continúa el aviso preexistente sobre la calculadora deshabilitada en JPRD; no se toca.
- Navegador: sin filtros 27; recorrido real 20 en la primera página y 7 en la segunda, con 27 ids distintos en total. Siguiente con Enter enfoca resultados-adjudicadores, a 135.2 px con header hasta 93 px en escritorio.
- Ingeniero Electrónico: 1 registro (Solis Villanueva, Reiner Absalón), sin paginación y con rango visible. No se modifica su escritura.
- Buscar Andía: 1 registro escrito originalmente Andia Espinoza, Helmuth Aarón. Se resalta Andia sin añadirle acento. Los valores se conservan literalmente.
- Borrar búsqueda conserva profesión: Abogado devuelve 12. Recarga conserva 12; atrás vuelve a q=Andía + Abogado (1); adelante recupera 12. Quitar profesión devuelve 27.
- Consulta literal .*: estado vacío sin paginación; restablecer recupera 27.
- Entrada directa con q=Andía, profesión=Abogado, inicial=A y pagina=999: ajusta pagina=1 sin perder criterios, devuelve 1 y oculta la paginación. Quitar solo inicial conserva q y profesión.
- 320, 390, 768, 1024 y 1440 px: un H1, sin overflow horizontal ni selector de grupo. Móvil: 20 fichas y cero tablas; escritorio/tablet: una tabla y cero fichas. No hay duplicación accesible.
- Tabla de escritorio: tres columnas y cero etiquetas de grupo en las filas. Opciones del selector proceden de las profesiones reales; Todas conserva el registro sin profesión.
- Árbitros: 132 registros, 20 filas iniciales y cambio a página 2 correcto tras la extracción de paginación/hook. Captura de regresión incluida. Su CSS no cambia.

## Pendientes y limitaciones

El periodo publicado 2025 no acredita vigencia actual; se conserva la confirmación pendiente de CENARD. No se validan nuevas credenciales ni se enriquecen campos vacíos. Revisión en un navegador local, sin auditoría formal de lectores de pantalla. Sin publicación ni push.
