# Refinamiento de Documentos

## Ajustes y alcance

Se conserva la composición aprobada. Se añaden coincidencias resaltadas en título, tipo y servicios; enlaces discretos entre las agrupaciones con resultados; retorno al panel con foco; acción explícita del formato DOCX. Catálogo, PDFs, advertencias, header, CTA y footer intactos. No se modificaron otras páginas, rutas, SEO ni sistemas externos. Sin push ni publicación.

Los enlaces internos son anclas nativas y conservan los parámetros existentes. Sus destinos tienen identificadores estables y foco programático sin scroll previo; la llegada utiliza el desplazamiento nativo y las reglas existentes de reducción de movimiento. El panel y los títulos no quedan cubiertos por el header.

Los cambios de búsqueda/filtro ahora preservan el fragmento existente, además de q, servicio, tipo y estado. Esto evita que el efecto global de navegación lleve la página arriba al escribir después de utilizar un ancla.

## Componentes reutilizables

`src/components/ResourceUI.tsx` y `resource-ui.css` contienen piezas de composición, sin catálogo ni representación de PDF:

- ResourceHeader: etiqueta, título y descripción.
- ResourceFilterPanel: contenedor visual y destino accesible.
- ResourceResults: contador accesible y contexto.
- ResourceCriteria: restricciones eliminables.
- ResourceGroupHeading: encabezado y cantidad.
- ResourceEmpty: contenido e interacción del estado vacío suministrados por la página.
- ResourceRelated: composición de accesos relacionados suministrados como contenido.

Se reutilizan Eyebrow y Combobox existentes. Los futuros recursos pueden utilizar estas piezas con su propio contenido, filtros y representación de filas; no son un componente universal ni requieren que nóminas o FAQ adopten formato PDF. No se cambiaron otras páginas para demostrar su reutilización.

HighlightedText utiliza `src/lib/highlight.ts`: búsqueda literal normalizada, mapeo a posiciones del texto original y nodos React/mark. No genera regex desde la consulta ni inserta HTML. Conserva acentos, caracteres combinantes y caracteres suplementarios. El estilo no altera fuente ni peso. El resaltado se basa exclusivamente en q.

## Archivos de esta entrega

- `src/pages/Documents.tsx`.
- `src/pages/documents.css`.
- `src/components/ResourceUI.tsx` y `resource-ui.css`.
- `src/components/HighlightedText.tsx`.
- `src/lib/highlight.ts`.
- `scripts/highlight.test.ts`.
- Esta carpeta de verificación y capturas.

La modificación previa de `src/pages/CalculatorPage.tsx` ya estaba presente al iniciar esta tarea y se dejó intacta.

## Verificación

- 13/13 pruebas: `node --test scripts/highlight.test.ts scripts/document-search.test.ts`.
- Incluyen conteos y conservación del catálogo, intersección de filtros, ausencia de duplicados, Directivas 01 separadas, normalización, caracteres de regex/HTML literales, coincidencias repetidas y reconstrucción exacta del texto.
- Catálogo `src/data/documents.json`: SHA-256 idéntico al inicio de esta tarea. Se conservan sus 16 registros, URLs, servicios y agrupaciones.
- Lint de todos los archivos JS/TS modificados o creados en esta entrega: correcto. `git diff --check`: correcto.
- El comando habitual `npm run build` queda bloqueado por dos importaciones previas sin uso en CalculatorPage.tsx: Info e InfoNote (TS6133). El lint global también las advierte. Se respeta la exclusión expresa de calculadora y no se las modifica.
- Verificación alternativa completada: `tsc -p tsconfig.app.json --noUnusedLocals false`, `tsc -p tsconfig.node.json`, Vite build, prerender y verificador existente correctos. Solo se omite la comprobación de locales sin uso para poder revisar la app sin editar el archivo excluido; no se modifican configuraciones ni scripts del proyecto.

## Navegador local

- Sin filtros 16; Arbitraje 14; JPRD 7; JPRD + Reglamento 3. Recarga conserva 3; atrás devuelve 7 y adelante 3.
- Buscar JPRD devuelve 7 y resalta sus etiquetas de servicio además del título específico. Seleccionar servicio JPRD sin búsqueda devuelve 7, cero marcas y ninguna navegación entre grupos (solo un grupo tiene resultados).
- Buscar etica devuelve dos documentos y resalta ética conservando el acento en títulos y tipos. Navegación dinámica: 1 documento en cada agrupación.
- Consulta literal .* devuelve cero y el estado vacío, sin errores ni interpretación como expresión regular. Restablecer recupera 16. Borrar búsqueda retira todas las marcas; los filtros siguen funcionando.
- Ancla de histórico en escritorio: título a 135.4 px y header hasta 93 px; en móvil de 320 px, título a 135.3 px y header hasta 77 px. Se conserva ?q=etica y el foco llega al título.
- Volver a filtros activado mediante Enter conserva la consulta, cambia solo el fragmento y enfoca el panel. Tab continúa en Borrar búsqueda y después en el campo. Al escribir después del retorno se preserva #filtros-documentales y no se cambia el scroll ni se mueve el foco al contador.
- Contador aria-live polite/atomic, foco visible y opciones/selección del Combobox conservados.
- 320, 390, 768, 1024 y 1440 px: sin overflow, un H1 y coincidencias originales preservadas. Enlaces internos distribuidos en varias líneas cuando hace falta. Capturas incluidas.
- Formato de reclamaciones: el enlace muestra DOCX y conserva su URL original; no se fuerza descarga ni se añade nueva pestaña. No entra al contador.

## Limitaciones

Se mantiene pendiente la confirmación de CENARD sobre vigencia, versión y aplicación de cada documento. No se abrieron o reinterpretaron PDFs. Pruebas en un navegador local; no sustituyen una auditoría formal con lectores de pantalla. El build habitual requiere resolver las importaciones ya descritas en el archivo excluido de calculadora.

Verificación adicional: apertura directa con los cuatro parámetros y #filtros-documentales devuelve 1 documento. Quitar únicamente tipo conserva q, servicio, estado y fragmento. Contraste calculado de colores del resaltado: 9.37:1.
