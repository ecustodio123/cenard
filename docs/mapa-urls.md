# Mapa de URLs y conservación de recursos

Las rutas originales se mantienen. No hay redirecciones 301 necesarias para estas páginas en la preview. El origen final requiere confirmación.

| Ruta | Acción |
| --- | --- |
| `/web/` | Conservar ruta existente |
| `/web/conocenos/` | Conservar ruta existente |
| `/web/arbitraje/` | Conservar ruta existente |
| `/web/jprd/` | Conservar ruta existente |
| `/web/servicio-de-arbitraje/` | Conservar ruta existente |
| `/web/secretaria-general/` | Conservar ruta existente |
| `/web/alto-consejo/` | Conservar ruta existente |
| `/web/organigrama/` | Conservar ruta existente |
| `/web/certificaciones/` | Conservar ruta existente |
| `/web/listado-de-arbitros/` | Conservar ruta existente |
| `/web/nomina-de-adjudicadores/` | Conservar ruta existente |
| `/web/atalaya-de-integridad/` | Conservar ruta existente |
| `/web/calculadora/` | Conservar ruta existente |
| `/web/documentos/` | Nueva página |
| `/web/contacto/` | Nueva página |

`/` es un alias de inicio para desarrollo; si se aprueba como entrada en producción, definir 301 a `/web/` en el hosting. Las rutas sin barra final pueden normalizarse a su equivalente con barra, conservando query strings. No se aplican cambios al hosting actual.

Los documentos y el formato de reclamaciones conservan su URL pública exacta. El manifiesto `manifiesto-recursos.json` registra 27 referencias de página (22 URLs de archivo distintas), sin sustituciones. Al cambiar de hosting se deberá preservar `/web/wp-content/uploads/` o proporcionar destinos reales y un mapa de equivalencias aprobado; actualmente no hay archivos migrados ni nuevos destinos que redirigir.

Las imágenes de preview y las fuentes se alojan localmente. El logo es el archivo de CENARD, no una recreación. Las fotografías ilustrativas y del Alto Consejo requieren aprobación de uso. Las fuentes tienen licencia OFL incluida. No se accedió a sistemas excluidos.