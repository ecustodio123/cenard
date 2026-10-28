# Organización institucional — implementación y revisión

Se unificaron Alto Consejo, Secretaría General y Director y Organigrama en `/web/organizacion-institucional/`.

## Resultado

- Un encabezado interno con el H1 y la introducción solicitados, sin breadcrumbs.
- Navegación interna sin barra sticky adicional: Estructura institucional, Alto Consejo y Dirección y Secretaría.
- Organigrama HTML con sus tres órganos, funciones y relaciones existentes; mantiene la disposición vertical accesible, sin depender de una imagen.
- Cinco integrantes de Alto Consejo en el orden original, con la galería elegida. Tres columnas en 1440 px, dos en 768 y 1024 px y una en 320 y 390 px.
- Tarjeta compartida para perfiles: fotos con dimensiones, carga diferida, nombre accesible, separador, botón “Ver perfil profesional” y biografía desplegable con details/summary.
- Dr. Ángel Alcalá Contreras conserva su denominación conjunta “Secretario General y Director”, introducción y las cinco secciones completas de su biografía. No se dividió el cargo ni se creó otro titular.
- Elizabeth Pereira Samanez conserva su identificación como “Secretaria arbitral / técnica”. La fuente no aporta biografía ni fotografía; se indica la ausencia de biografía y se reutiliza el icono neutral del proyecto. Para Dirección se reutiliza el monograma AC.
- Se mantiene el contacto institucional autorizado de Secretaría y el cierre habitual de contacto.
- El submenú Institución muestra Conócenos, Organización institucional y Certificaciones, tanto en escritorio como en móvil.
- Los enlaces de Inicio y Conócenos llevan a la ruta nueva con sus anclas cuando nombran un órgano.
- Se retiraron los tres registros de rutas anteriores y el componente de enlaces cruzados entre esas páginas. No se añadieron alias ni redirecciones.

## Archivos de implementación modificados

- `src/App.tsx`: una sola página registrada.
- `src/data/site.ts`: registro del encabezado y submenú institucional.
- `src/pages/Institution.tsx`: estructura unificada y componente compartido de perfiles; enlaces de Conócenos.
- `src/pages/HomePage.tsx`: destinos de enlaces institucionales.
- `src/components/UI.tsx`: retirada del componente de enlaces cruzados a las páginas antiguas.
- `src/index.css`: distribución, anclas y perfiles de la página unificada.

Los JSON de Consejo y Secretaría se reutilizaron sin modificaciones. No se modificaron en este trabajo la calculadora, Mesa de Partes, Atenea, backend, CMS, autenticación ni bases de datos. Los mecanismos existentes de prerenderizado, sitemap, canonical y metadatos no se editaron; la compilación sigue el registro de páginas vigente automáticamente. No se realizó publicación ni push.

## Verificación realizada

- `npm run build`: correcto; genera y verifica las 12 rutas institucionales actuales.
- `git diff --check`: correcto.
- Comprobación del HTML generado: un H1, siete tarjetas de personas, cinco biografías completas de Consejo y toda la introducción y las cinco secciones de Dirección. Cargos y nombres conservados, sin breadcrumbs ni perfiles inicialmente abiertos.
- Revisión de todos los HTML generados: no quedan enlaces a las tres rutas retiradas ni sus directorios de salida.
- Navegador en 320, 390, 768, 1024 y 1440 px: sin overflow horizontal; secciones en el orden requerido y columnas de Consejo según lo solicitado. Evidencia: [layout.json](layout.json).
- Apertura con Enter y clic. Dos perfiles permanecen abiertos de forma independiente. La tarjeta de Carlos conserva sus 594 px de altura mientras se abre la de Delia.
- Foco visible de teclado: contorno sólido de 3 px.
- Perfil de Dirección: apertura correcta y cinco apartados biográficos presentes.
- Anclas: títulos visibles bajo el header; Dirección quedó a 311 px con header hasta 93 px en escritorio, y Alto Consejo a 295 px con header hasta 77 px en móvil.
- Menú de escritorio: exactamente los tres enlaces institucionales solicitados. Menú móvil: nueva ruta correcta, apertura y cierre con Escape comprobados.
- Perfil abierto en 390 px: sin overflow horizontal.
- Consola del navegador: sin errores capturados.
- Se conserva la regla global existente de prefers-reduced-motion y no se agregan animaciones ni dependencias.

No se realizaron pruebas con lector de pantalla, dispositivo táctil físico ni emulación de la preferencia de movimiento del sistema. Las interacciones usan controles HTML nativos y superficies pulsables de al menos 44 px.

## Validación institucional pendiente

- Confirmar la composición vigente y las fotografías del Alto Consejo.
- Confirmar vigencia de cargos y biografías de Dirección y Secretaría.
- Aprobar las funciones resumidas del organigrama, ya identificadas como pendientes en la página original.
- Confirmar el cargo conjunto de Dirección y Secretaría y la denominación exacta del puesto de Elizabeth.
- Si se desean retratos de Dirección o Secretaría, aportar fotografías identificadas y aprobadas; actualmente se usan recursos neutrales.

Las advertencias correspondientes permanecen visibles en la página.

## Capturas

- [Página completa, 390 px](390.png).
- [Página completa, 1440 px](1440.png).
- [Galería de Alto Consejo](alto-consejo.png).
- [Dirección y Secretaría General](direccion-secretaria.png).
