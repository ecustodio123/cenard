# Combobox compartido CENARD

Se reemplazan todos los selectores nativos de `src`: dos de la biblioteca, grupo/profesión de nóminas y moneda/servicio adicional de la calculadora. La calculadora sigue deshabilitada: no se crean rutas ni se modifican tarifas, validaciones, modalidades o lógica de cálculo.

## Componente

`src/components/Combobox.tsx` y `combobox.css`: selector de valor único controlado, etiqueta visible, rol combobox, listbox y opciones, estado expandido/seleccionado, foco virtual mediante aria-activedescendant, selección visible con marca, indicador funcional con espacio lateral de 16 px, textos largos sin truncar.

Portal fijo que evita recortes por contenedores; anchura y altura adaptadas a la pantalla, apertura superior/inferior según espacio y desplazamiento interno si hace falta. Mantiene el foco en el control, cierra al salir con Tab, Escape o pulsar fuera. Soporta Enter/Espacio, flechas de teclado, Home/End y búsqueda incremental por letras sin distinguir acentos o mayúsculas. Sin animaciones ni dependencias nuevas.

Props para id, nombre, formulario, disabled, invalid, descripción de error, blur y referencia de foco. Calculadora integrada mediante Controller de React Hook Form; valores y reinicios conservados, con campos ocultos para asociación al formulario.

## Archivos migrados

- `src/pages/Documents.tsx`: filtros de tipo y agrupación; mismos parámetros y opciones.
- `src/pages/Resources.tsx`: grupo y profesión; mismos filtros y conjuntos de datos.
- `src/pages/CalculatorPage.tsx`: moneda y servicio adicional; solo sustitución de controles.

Se conservan los demás cambios previos del usuario. No se modifican catálogo documental, PDFs, rutas, header/footer ni servicios externos. Los indicadores nuevos son exclusivamente funcionales de los combobox solicitados.

## Verificación

- `rg '<select|<option' src`: sin selectores nativos pendientes.
- `npm run build`: correcto; aviso existente sobre calculadora deshabilitada preservado.
- `npm run lint`: correcto.
- `node --test scripts/document-search.test.ts scripts/calculator.test.ts`: 9/9 correctas. Las pruebas de calculadora verifican formatos y campos, sin calcular tarifas.
- Navegador, biblioteca: selección Reglamento por ratón devuelve 8 resultados; End + Enter selecciona Ficha y devuelve 2; búsqueda por letra r selecciona Reglamento, que combinado con histórico devuelve 4. Histórico por ratón devuelve 7 y conserva la URL de filtro.
- Escape cierra conservando selección. Tab cierra y enfoca el siguiente combobox. Pulsación fuera cierra la lista. Árbol de accesibilidad muestra combobox expandido, valor y opciones seleccionadas.
- 320, 390, 768, 1024 y 1440 px: listas dentro de límites de pantalla y sin overflow horizontal. Opciones largas legibles y salto natural del valor si es necesario. Capturas incluidas.
- Nómina de árbitros: grupo Contratación pública devuelve 40; selección de profesión y Limpiar filtros devuelve 132. Nómina de adjudicadores: se revisan las cuatro opciones de profesión en móvil, sin recorte.
- Calculadora: migración comprobada por compilación y pruebas de validación; no se habilitó su ruta pública ni se realizó una prueba visual de esa página deshabilitada.
- Sin publicación ni push. La revisión de accesibilidad se limita al navegador local y no sustituye pruebas con lectores de pantalla específicos.
