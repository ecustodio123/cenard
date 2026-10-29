# Preguntas frecuentes sobre arbitraje

## Ruta e identidad

Ruta principal nueva: `/web/preguntas-frecuentes/`.
Ruta sustituida: `/web/servicio-de-arbitraje/`.

La ruta anterior deja de generarse y muestra la página no encontrada de la aplicación. No se crea alias ni redirección. Navegación Recursos conserva la etiqueta Preguntas frecuentes y usa la nueva ruta; el enlace desde Arbitraje también se actualiza. Las referencias de scripts/archivo a la web antigua se conservan como fuentes históricas, no son enlaces internos de navegación. No se modifican scripts de SEO, sitemap, canonical o redirecciones. El pipeline existente deriva sus salidas de la ruta registrada, sin trabajo adicional sobre esos mecanismos.

H1: Preguntas frecuentes sobre arbitraje. Cabecera compartida ResourceHeader con la introducción y etiqueta solicitadas, sin fotos ni breadcrumbs. CTA, header y footer globales conservados.

## Diseño e interacción

Dos columnas en escritorio amplio, aproximadamente 30/70; la orientación queda a la izquierda. Una columna hasta 1100 px, preguntas primero y orientación después. La ayuda permanece estática: no usa sticky ni puede superponerse a CTA/footer.

Cinco details/summary nativos sin grupo exclusivo: toda la cabecera accionable, número, texto de pregunta e indicador Ver respuesta/Ocultar respuesta. Varias respuestas pueden abrirse a la vez. Sin flechas ni chevrones. Fondo crema tenue y borde verde discreto al abrir; foco de 3 px visible. No se anima altura ni hay código que desplace la página al desplegar. Se conserva la reducción de movimiento global.

Respuestas a 16 px e interlineado 1.65; ancho limitado a 70ch; listas espaciadas y alineación con la pregunta. PDF indicado, apertura en nueva pestaña anunciada visualmente y mediante el helper accesible existente.

## Conservación editorial

`src/data/faq.json` queda idéntico byte por byte. Copias antes/después incluidas. Se conservan los cinco textos de preguntas, respuestas, listas y documentId. Solo cambia el orden de presentación:

1. Tipo de controversias.
2. Inicio del proceso.
3. Participación de abogados.
4. Ventajas frente al proceso judicial.
5. Ventajas de CENARD.

La asociación documental conserva el archivo exacto:
https://cenardarbitraje.com/web/wp-content/uploads/2026/05/Reglamento-Procesal-y-Apendices-2025-1.pdf

La nota Base editorial sujeta a revisión institucional y jurídica antes de publicar se conserva después de las preguntas, una sola vez en el contenido específico de esta página. La advertencia genérica del footer global permanece como estaba.

## Archivos de la entrega

- `src/pages/Faq.tsx`: página específica y orden visual, reutiliza ResourceHeader y ExternalLink.
- `src/pages/faq.css`: estilos exclusivos de FAQ.
- `src/pages/Institution.tsx`: se extrae la antigua FaqPage y su importación de datos; otras páginas conservadas.
- `src/App.tsx`: monta FaqPage con cabecera propia en la ruta nueva.
- `src/data/site.ts`: slug y referencia de Recursos actualizados; nombre de menú mantenido.
- `src/pages/Arbitration.tsx`: solo destino del enlace FAQ actualizado.
- Esta carpeta de QA.

Los cambios concurrentes detectados en `src/components/resource-ui.css` y `src/pages/arbitrators.css` corresponden al usuario y se preservaron; no se editaron como parte de esta tarea.

## Comprobaciones

- `npm run build`: correcto (TypeScript, Vite, prerender y verificador de rutas existente). Aviso previo de calculadora deshabilitada en JPRD sin cambios.
- `npm run lint` y `git diff --check`: correctos.
- Comparación literal del JSON antes/después; comprobación del HTML renderizado con las cinco preguntas en orden, cada respuesta/lista íntegra y archivo documental exacto. Ruta anterior no generada en dist.
- Búsqueda en src: no quedan referencias de navegación a servicio-de-arbitraje.
- Navegador: ruta nueva con un H1 y cinco preguntas. Ruta antigua permanece en su URL y muestra página no encontrada, sin redirigir.
- Acceso real desde Arbitraje navega a la ruta nueva. Menú Recursos muestra Preguntas frecuentes con href nuevo.
- Dos respuestas abiertas mediante Enter permanecen abiertas simultáneamente. Árbol de accesibilidad anuncia expanded y Ocultar respuesta. Foco visible comprobado. Se abrieron las cinco respuestas simultáneamente.
- Cierre de un control visible sin lógica de scroll programado; solo ajuste nativo de aproximadamente un píxel observado. No se añaden efectos de desplazamiento.
- 320, 390, 768, 1024 y 1440 px: un H1, cinco respuestas abiertas sin overflow. Una columna hasta tablet y dos en escritorio amplio. Orientación después de toda la sección de preguntas en los cuatro tamaños menores.
- Capturas cerradas/abiertas y revisión del PDF en móvil de 320 px. Preguntas y respuestas sin alturas fijas ni truncamiento.
- El enlace PDF conserva target blank y noreferrer, con indicación de PDF y apertura en otra pestaña. No se abre ni audita el documento.

## Puntos pendientes de aprobación institucional y jurídica

Se mantienen como afirmaciones existentes pendientes de revisión, sin calificarlas como errores jurídicos confirmados:

- Beneficios comerciales e institucionales atribuidos a CENARD, incluidas cualificación, celeridad, costos y herramientas.
- Confidencialidad y alcance de las controversias arbitrables.
- Participación de abogados y recomendación de asesoría.
- Referencia al artículo 11 y documentos de inicio.
- Correspondencia y aplicabilidad del Reglamento Procesal y Apéndices enlazado.

No se reescriben respuestas ni se amplía su alcance a JPRD. Revisión en un navegador local, sin auditoría formal adicional de lectores de pantalla o validación jurídica. Sin publicación ni push.
