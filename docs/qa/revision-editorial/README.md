# Revisión editorial y de información — 27/10/2026

## Resultado por página y componente

- **Biblioteca y servicios:** `src/data/documents.json` ahora identifica documentos/versiones y mantiene asociaciones a varios servicios. El catálogo resultante tiene 16 documentos y 21 referencias de origen; esos números se calcularon a partir de los datos, no se fijaron en el contador. Las dos Directivas 01 conservan sus identidades y URLs distintas. Continúan todos los históricos. `src/data/documents.ts` distingue metadatos desconocidos de agrupación de origen y genera la etiqueta de aplicación por confirmar.
- **Biblioteca:** descripción limitada a normativa de Arbitraje y JPRD; etiquetas de servicios compartidos; búsqueda, filtros combinados, parámetros de URL, recuento dinámico y estados vacíos. Certificaciones y el formato de reclamaciones aparecen como recursos relacionados fuera del catálogo.
- **Conócenos:** “Nuestros servicios” conduce a `/web/#servicios`, sin cambiar el diseño ni los textos institucionales.
- **JPRD:** se identifica el destino del CTA como “Preguntas frecuentes sobre arbitraje”; no se crearon respuestas de JPRD.
- **FAQ:** cinco preguntas conservadas, mayúsculas y ortografía corregidas, enumeraciones en listas y enlace al Reglamento Procesal y Apéndices en la respuesta sobre artículo 11. La orientación general queda separada de la consulta específica. Las alternativas para expresiones promocionales solo figuran en `docs/propuesta-editorial-faq.md`, no se publicaron como reglas nuevas.
- **Secretaría, Consejo y Organigrama:** bloque común de información relacionada; los órganos enlazan sus páginas. Las funciones del organigrama se atribuyen al párrafo institucional acompañante conservado en `docs/source/organigrama.json`, no al texto de la imagen; su aprobación sigue pendiente.
- **Contacto:** sección estable `#reclamaciones` con descarga del mismo DOCX del footer y aviso de instrucciones pendientes. La fuente del enlace se centraliza en `site.claimsForm`. El bloque global de contacto se oculta únicamente en Contacto.
- **Nóminas:** recuentos siguen identificados como registros, con concordancia singular/plural. El filtro Grupo desaparece cuando solo hay un grupo; la nota inferior se adapta a ese contexto. Todos los datos y periodos se conservan.
- **Certificaciones:** cinco fichas y destinos conservados; aviso explícito de identificación provisional de las constancias. No se eligieron códigos, años o versiones de ISO por inferencia.

## Observaciones que ya estaban resueltas y se conservaron

- Correos con `mailto:` a su dirección visible; llamada con `tel:` y WhatsApp como acción separada.
- Fuente compartida de profesionales y documentos; ahora se refina el modelo documental sin crear copias en las páginas.
- Nóminas identificadas como registros, búsqueda sin tildes/mayúsculas, tablas desktop y tarjetas móviles con los mismos campos, campos desconocidos como “No publicado”, índice sin letra O repetida.
- Cinco recursos de Certificaciones, los tres estados de Atalaya, enlace de Laudos y ausencia de botones ficticios para categorías sin recurso.
- Avisos de revisión institucional, semántica básica, skip link, menú por teclado, foco visible y regla de movimiento reducido.
- Identidad, tipografías, logos, rutas, hero estático, footer compacto y supresión del crédito solicitada anteriormente.

No se encontraron `AGENTS.md` en el repositorio ni en los directorios ascendentes revisados. Se respetó la arquitectura React/Vite existente.

## Comprobaciones ejecutadas

- `npm run build`: TypeScript, Vite, prerender y comprobación de metadatos y enlaces internos de las 14 rutas visibles. Sin errores.
- `npm run lint`: sin errores ni advertencias.
- `node --test scripts/documents.test.ts`: una prueba de integridad del modelo, no una batería de comprobaciones de textos. Compara todas las referencias normativas archivadas de Arbitraje/JPRD, identidades, asociaciones por servicio, históricos y dos Directivas independientes. Sin errores. No se ejecutó `npm test`, cuyo objetivo actual no forma parte de este encargo.
- Comprobación adicional de preservación contra el estado inicial: los JSON completos de profesionales, certificaciones, Consejo y Secretaría son iguales; los archivos de las áreas excluidas se mantienen intactos.
- **98 vistas locales:** 14 rutas en 320, 375, 390, 430, 768, 1024 y 1440 px. Sin desbordamiento global, un H1 por página y sin `href="#"` ni destinos vacíos. Resultados en `layout.json`.
- FAQ abiertas a 320, 390, 768 y 1440 px: sin overflow, seis elementos de lista y dos respuestas abiertas, incluida la referencia normativa contextual. `faq-expandida.json`.
- **Biblioteca:** “ética” obtiene dos documentos/versiones; combinado con JPRD y tipo Código de ética, uno. La URL filtrada conserva búsqueda y filtros tras recarga. Búsqueda inexistente, estado vacío y restablecimiento comprobados. Arbitraje conserva sus 14 documentos y JPRD sus 7, incluyendo los compartidos. Dos Directivas 01 con URLs distintas. Estos son resultados observados, no constantes del componente.
- **Nóminas:** “ANDIA” encuentra dos registros de grupos distintos; un filtro por contratación pública deja uno. Restablecer recupera 132 registros; adjudicadores conserva 27 y no muestra el filtro de grupo único. Los números describen registros, no personas únicas verificadas.
- **CTA y anclas:** Conócenos abre `#servicios`; el destino quedó a 225 px del borde superior con header de 93 px, sin tapar el contenido. JPRD conduce a las FAQ de arbitraje con etiqueta inequívoca. `#reclamaciones` también queda visible; Contacto no muestra el bloque global autorreferente. Footer y Contacto comparten la URL exacta del DOCX.
- **Teclado:** menú activado con Enter; primer enlace recibe foco; Escape cierra y devuelve foco al botón; Tab muestra contorno sólido de 3 px. FAQ activada desde `summary` con Enter. Resultados en `funcional.json`.
- **Contraste:** medición de colores computados de los elementos nuevos/refinados: títulos y enlaces 13.97:1, subtítulos 5.73:1, etiquetas 7.26:1 y nota informativa 12.93:1. `contraste-y-movimiento.json`. Se conserva la regla compilada de `prefers-reduced-motion`, que elimina animación/transición y el scroll suave.
- **Referencia publicada:** se consultaron mediante navegador Biblioteca, Conócenos, JPRD, FAQ y Contacto de `https://cenard.pages.dev/web/`, confirmando las observaciones previas. `referencia.json` registra el estado observado. No se modificó ese sitio.

## Capturas

27 capturas de páginas modificadas: vistas completas a 390 y 1440 px; las nóminas se capturan en viewport para evitar imágenes de decenas de miles de píxeles. Se añadieron capturas de las FAQ abiertas y un resumen de la biblioteca filtrada.

| Página | Móvil | Desktop |
| --- | --- | --- |
| Documentos | [390 px](documentos-390.png) | [1440 px](documentos-1440.png) |
| Conócenos | [390 px](conocenos-390.png) | [1440 px](conocenos-1440.png) |
| Arbitraje | [390 px](arbitraje-390.png) | [1440 px](arbitraje-1440.png) |
| JPRD | [390 px](jprd-390.png) | [1440 px](jprd-1440.png) |
| FAQ abiertas | [390 px](faq-abierta-390.png) | [1440 px](faq-abierta-1440.png) |
| Secretaría | [390 px](secretaria-general-390.png) | [1440 px](secretaria-general-1440.png) |
| Consejo | [390 px](alto-consejo-390.png) | [1440 px](alto-consejo-1440.png) |
| Organigrama | [390 px](organigrama-390.png) | [1440 px](organigrama-1440.png) |
| Árbitros | [390 px](listado-de-arbitros-390.png) | [1440 px](listado-de-arbitros-1440.png) |
| Adjudicadores | [390 px](nomina-de-adjudicadores-390.png) | [1440 px](nomina-de-adjudicadores-1440.png) |
| Certificaciones | [390 px](certificaciones-390.png) | [1440 px](certificaciones-1440.png) |
| Contacto | [390 px](contacto-390.png) | [1440 px](contacto-1440.png) |

## Límites y pendientes

- Pruebas ejecutadas en el navegador integrado de Codex; no se certifica el comportamiento en todos los navegadores ni con lectores de pantalla.
- La preferencia de movimiento reducido se revisó en CSS compilado; no se cambió la configuración del equipo ni se simuló otro estado del sistema. El contraste medido cubre elementos representativos, no una auditoría AA completa de todos los estados e imágenes.
- No hay puntuaciones Lighthouse, mediciones de Core Web Vitals de producción ni aprobación jurídica.
- No se verificó el contenido jurídico de los PDF, la vigencia de los registros ni procedimientos de reclamaciones. Los archivos públicos siguen dependiendo del sitio antiguo; no se ejecutó migración ni se cambiaron sus destinos.
- Pendientes concretos de CENARD y preguntas por página: `docs/pendientes-validacion-cenard.md`. La revisión conserva los avisos, no declara el sitio listo para producción.
- No se trabajó ni se hicieron pruebas de las áreas excluidas por el encargo. No se accedió a ellas. No se modificaron V1, DNS, hosting ni servicios externos, y no se desplegaron estos cambios.
