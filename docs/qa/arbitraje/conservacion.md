# Arbitraje: inventario y decisiones de conservación

Revisión: 28/10/2026. Antes de implementar se revisaron React 19, Vite 8, React Router, componentes UI, estilos y catálogo compartido `src/data/documents.json`. No se encontraron instrucciones AGENTS.md en el repositorio ni sus ancestros.

## Fuentes

- Contenido original: https://cenardarbitraje.com/web/arbitraje/ (consultado y contrastado con el HTML público).
- V2 solicitada: https://cenard.pages.dev/web/arbitraje/ no respondió en el lector web; se revisa la implementación local como referencia V2.
- Copia de referencia existente: `docs/source/arbitraje.json`.
- Se mantienen los 14 registros de Arbitraje del catálogo compartido: siete desde el 04/08/2025 y siete históricos hasta el 03/08/2025. Las 14 URLs coinciden con el HTML original consultado. No se alteran archivos ni se deduce vigencia, aprobación o publicación a partir de sus URLs.

## Contenido y enlaces

- Apertura editorial única con introducción de trabajo solicitada y contacto existente.
- Cuatro accesos literales: `/calculadora`, `/atalaya-de-integridad`, `/listado-de-arbitros`, `https://sistema.cenardarbitraje.com/login`. Los tres primeros NO son rutas registradas en la aplicación; se conservan por instrucción expresa, sin alias ni redirecciones. No se prueba calculadora ni se visita Atenea.
- Se conservan íntegramente los tres textos V2 de Administración de arbitrajes, Designación de árbitros y Asistencia administrativa. Su respaldo específico no está identificado en la página antigua de Arbitraje: requieren aprobación editorial institucional.
- Se conserva enlace FAQ existente y repositorio documental filtrado por Arbitraje.
- La referencia histórica de la fuente a Directiva 4–2025–OECE–CD, numeral 8.2.7.2 y 2000 UIT se presenta únicamente como nota pendiente de validación jurídica de CENARD. No había una nota específica visible en el componente local de Arbitraje; sí un pendiente general en `docs/pendientes-cliente.md`. Se hace explícita junto a los documentos.
- Se mantienen CTA y footer globales.

## Fotografía provisional

Archivo: `public/assets/arbitration/arbitraje-provisional.webp` (760 × 507, WebP optimizado).
Fuente original: https://cenardarbitraje.com/web/wp-content/uploads/2025/05/000102605M.jpg
Página de procedencia: https://cenardarbitraje.com/web/arbitraje/
Licencia: no identificada públicamente; recurso de la web antigua reutilizado provisionalmente según autorización del usuario. No se afirma que sea una imagen con licencia libre. Confirmar derechos de uso antes de producción, tal como recoge el pendiente general del proyecto.
Sin marca de agua visible. Fotografía ilustrativa, no atribuida a personas, instalaciones o actividades reales de CENARD. La configuración del recurso y el atributo `data-provisional` facilitan sustituirla sin cambiar la composición. No se añaden más imágenes decorativas ni hotlinking.

## Documentos conservados

- **Código de ética 2025** (desde el 04/08/2025): https://cenardarbitraje.com/web/wp-content/uploads/2025/11/CODIGO-DE-ETICA.pdf
- **Reglamento procesal y apéndices 2025** (desde el 04/08/2025): https://cenardarbitraje.com/web/wp-content/uploads/2026/05/Reglamento-Procesal-y-Apendices-2025-1.pdf
- **Reglamento interno 2025** (desde el 04/08/2025): https://cenardarbitraje.com/web/wp-content/uploads/2026/07/REGLAMENTO-INTERNO-CENARD.pdf
- **Directiva 01 incorporación y renovación** (desde el 04/08/2025): https://cenardarbitraje.com/web/wp-content/uploads/2026/07/Directiva-01-Incorporacion-y-Renovacion.pdf
- **Reglamento de costos 2025** (desde el 04/08/2025): https://cenardarbitraje.com/web/wp-content/uploads/2026/05/REGLAMENTO-DE-COSTOS-2025-ACTUALIZADO.pdf
- **Fichas de renovación árbitro / adjudicador** (desde el 04/08/2025): https://cenardarbitraje.com/web/wp-content/uploads/2025/11/Ficha-renovacion.pdf
- **Fichas de inscripción árbitro / adjudicador** (desde el 04/08/2025): https://cenardarbitraje.com/web/wp-content/uploads/2025/11/FICHAS-1.pdf
- **Directiva sobre costos para medidas de emergencias – arbitro de emergencia** (hasta el 03/08/2025): https://cenardarbitraje.com/web/wp-content/uploads/2025/05/CNR-Arbitraje-Sobre-los-costos-para-procedimientos-de-emergencia-.pdf
- **Directiva de elección de árbitro y escrutinio 2024** (hasta el 03/08/2025): https://cenardarbitraje.com/web/wp-content/uploads/2025/05/Directiva-de-Eleccion-de-Arbitro-y-Escrutinio-2024.pdf
- **Reglamento procesal de arbitraje 2023** (hasta el 03/08/2025): https://cenardarbitraje.com/web/wp-content/uploads/2025/05/Reglamento-Procesal-de-Arbitraje.pdf
- **Código de ética** (hasta el 03/08/2025): https://cenardarbitraje.com/web/wp-content/uploads/2025/05/CODIGO-DE-ETICA-CENARD-2023-2024-3.pdf
- **Reglamento para arbitraje acelerado** (hasta el 03/08/2025): https://cenardarbitraje.com/web/wp-content/uploads/2025/05/Reglamento-Arbitraje-Acelerado-2023-1.pdf
- **Reglamento de costo 2024** (hasta el 03/08/2025): https://cenardarbitraje.com/web/wp-content/uploads/2025/05/Reglamento-de-Costos-2024-2.pdf
- **Reglamento de costos para cuantías indeterminadas 2024** (hasta el 03/08/2025): https://cenardarbitraje.com/web/wp-content/uploads/2025/05/Reglamento-de-Cuantias-Indeterminadas-2024.pdf

## Verificación de implementación

- `npm run build`: correcto (TypeScript, Vite, prerender y verificación existente de páginas).
- `npm run lint`: correcto. `git diff --check`: correcto.
- Navegador local: revisado a 320, 390, 768, 1024 y 1440 px. Sin overflow horizontal; un H1 en todos los tamaños. Panel de herramientas: 1 columna en móvil, 2 en tablet/intermedio y 4 en escritorio amplio. Capturas en esta carpeta.
- Se revisó la página renderizada, incluidos acompañamiento, biblioteca y textos largos. Se ajustó el espaciado de las filas compartidas para mantener los módulos compactos. Acciones y párrafos alineados en escritorio.
- Dos grupos con siete PDFs cada uno, grupo A abierto y B cerrado inicialmente. Apertura y cierre de históricos mediante Enter comprobados en navegador, con foco visible y estado nativo expandido/contraído en el árbol de accesibilidad.
- Ancla Consultar normativa comprobada: título a 139 px, cabecera fija hasta 93 px en escritorio. Destino visible.
- Se inspeccionaron los cuatro href en el DOM sin navegarlos. PDFs con nueva pestaña y noopener/noreferrer; Atenea con indicación textual de sitio externo y nueva pestaña. No se abrió ni auditó Atenea; no se ejecutó ni probó la calculadora. No se descargaron ni revisaron los contenidos internos de los PDFs: solo se contrastaron sus URLs con la fuente original.
- No se realizó publicación ni push. No se modificaron Conócenos, Organización institucional, header/footer, rutas/alias, SEO ni catálogos documentales. La condición en App solo evita la apertura duplicada de Arbitraje y monta su componente específico.

## Archivos de la entrega

- `src/pages/Arbitration.tsx`: página específica, recursos y controles documentales.
- `src/pages/arbitration.css`: composición y estilos exclusivamente de Arbitraje.
- `src/App.tsx`: montaje del componente y cabecera propia de Arbitraje.
- `public/assets/arbitration/arbitraje-provisional.webp`: imagen local, optimizada y sustituible.
- Este inventario y capturas de revisión.

## Pendientes

Aprobación de los textos de acompañamiento; confirmación de aplicación/vigencia y agrupación documental; confirmación jurídica de la referencia a la Directiva y 2000 UIT; derechos y aprobación de la fotografía antes de producción. Los destinos literales internos sin `/web` requieren implementación o una decisión posterior del cliente: por instrucción se conservan sin crear rutas.
