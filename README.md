# CENARD · Rediseño institucional

Sitio multipágina en React 19 + Vite + TypeScript. Diseño editorial con identidad verde petróleo, Source Sans 3 y Source Serif 4 autoalojadas. Implementación local basada en el contenido público de https://cenardarbitraje.com/web/ y en el documento de revisión institucional 02.

## Desarrollo

```sh
npm ci
npm run dev
```

```sh
npm run build    # TypeScript, Vite y prerender de todas las rutas
npm run preview  # Revisión del HTML prerenderizado e hidratación
npm test         # Validación de entradas monetarias y seis modalidades
npm run lint    # Análisis estático con Oxlint
```

Usar Node 22.18+ o una versión actual compatible con Vite. Las pruebas usan la eliminación nativa de tipos de Node.

## Páginas e interacción

Se conservan las rutas institucionales de origen, salvo la calculadora temporalmente oculta, y se agregan `/web/documentos/` y `/web/contacto/`. Inicio también responde en `/` como alias de preview. La biblioteca tiene búsqueda, filtros en URL, recuento, restablecimiento y estado vacío. Las nóminas permiten buscar sin tildes o diferencias de mayúsculas, filtrar por grupo/profesión e inicial del apellido. Tabla desktop y fichas móviles muestran los mismos datos.

Incluye menú móvil con manejo del foco y Escape, FAQ y comunicado accesibles, organigrama HTML, cinco fichas documentales de certificación y canales de atención centralizados. Los archivos públicos conservan sus URLs originales; no se migró ni retiró infraestructura.

**Calculadora oculta temporalmente:** la opción `features.tariffCalculator` en `src/data/site.ts` controla sus accesos, navegación y ruta pública. Con el valor `false`, no se genera su HTML ni se incluye en el sitemap, y su URL muestra la página 404. El código se conserva para retomarlo después.

Implementación conservada: seis modalidades con campos específicos, PEN/USD, validación mediante Zod y React Hook Form. No calcula importes hasta disponer de reglas y resultados aprobados por CENARD. La interfaz explica este estado y permite revisar el formato de los datos sin simular una cotización.

## Contenido y mantenimiento

- `src/data/site.ts`: navegación, páginas, contacto y comunicado.
- `src/data/professionals.json`: personas, grupo, profesión/especialidad publicada y periodo de origen. No fusionar categorías automáticamente.
- `src/data/documents.json`: un documento o versión por ficha, con identidad estable, varios servicios y referencias de origen separadas. `src/data/documents.ts` define el modelo y las etiquetas de agrupación temporal. Las fechas de publicación, versiones y periodos de aplicación no confirmados permanecen ausentes. No fusionar documentos por título; las dos Directivas 01 son referencias independientes.
- `src/data/certifications.json`, `council.json`, `secretary.json` y `faq.json`: contenido institucional compartido.
- `src/pages/`: plantillas por tipo de contenido.
- `src/index.css`: tokens, composición y breakpoints.
- `src/lib/calculator.ts`: validación independiente de la UI y bloqueo explícito de cálculo. Añadir motor y casos de referencia solo con tarifas aprobadas.
- `docs/source/`: capturas de contenido público de las 13 páginas, tomadas el 24/10/2026. No se ejecuta ese HTML en la aplicación.
- `docs/inventario-contenido.md`: inventario editorial y de enlaces.
- `docs/pendientes-cliente.md`: requisitos de aprobación antes de publicar.
- `docs/mapa-urls.md`, `docs/manifiesto-recursos.json`: conservación de rutas y archivos.
- `docs/qa/`: capturas y resultados de verificación local.

No incluye CMS ni panel editorial: los cambios se realizan en archivos y requieren una nueva compilación.

## Prerender y SEO

`npm run build` genera HTML completo para las 14 rutas visibles, el alias raíz y 404. Se hidrata sobre ese HTML para mantener los controles interactivos. Cada página tiene un H1, título y descripción propios. La preview tiene `noindex,nofollow` y `robots.txt` bloqueado.

El dominio final no se presupone. Para una compilación aprobada se proporcionan `SITE_URL` y `SITE_INDEXABLE=true` como variables de entorno del proceso de build. Con SITE_URL se genera canonical, Open Graph y sitemap; la indexación solo se activa si también se establece SITE_INDEXABLE=true. `.env.example` documenta las variables; el prerender lee `process.env`, por lo que deben exportarse en la terminal o CI (no basta con crear `.env`).

Servir los archivos de `dist/`, resolviendo `/web/<ruta>/` a su `index.html`. Servir `404.html` con estado HTTP 404 para rutas desconocidas. No utilizar un fallback universal 200 que oculte errores. La configuración concreta depende del hosting aprobado.

## Alcance

Mesa de Partes y Atenea están excluidos y no se visitaron. No se modificaron el WordPress actual, el dominio ni producción. La entrega se limita al repositorio y a la preview local. No hay analítica ni llamadas de datos a servidores de terceros; al abrir recursos, PDF y canales externos el visitante accede a los destinos publicados.

## Revisión editorial institucional (27/10/2026)

La biblioteca cuenta documentos/versiones y muestra una ficha por archivo común, conservando sus servicios. Las etiquetas de fecha indican agrupación de origen y aplicación por confirmar. Certificaciones y el formato de reclamaciones se enlazan como recursos relacionados fuera del catálogo.

Los CTA, las FAQ con listas y enlace al Reglamento Procesal, la navegación entre autoridades y la sección `/web/contacto/#reclamaciones` conservan las rutas del proyecto. El bloque global de contacto se oculta únicamente en la propia página Contacto.

Pendientes específicos: `docs/pendientes-validacion-cenard.md`. Propuesta editorial sin publicar: `docs/propuesta-editorial-faq.md`. Comprobación de integridad del catálogo: `node --test scripts/documents.test.ts`. La prueba utiliza las referencias públicas archivadas para comprobar que no se pierden enlaces ni asociaciones por servicio.

Los archivos de `src/data/` son datos editoriales curados. `scripts/extract-source-data.py` documenta la extracción histórica de V1 y **no debe ejecutarse sobre los datos curados**: escribe el formato de importación original. Para actualizar el catálogo, editar el modelo actual y ejecutar la comprobación de integridad.
