# Verificación · Detalle del producto y carrito

> **Pregunta que responde este archivo:** ¿se cumple cada criterio de la spec?

Fecha: 02/11/2026 · `npm test`: 44 tests, todos pasan

Las pruebas manuales las hizo el autor en el navegador el 02/11/2026, con
Live Server y los datos de demostración, en tres momentos: al terminar la
tarea 6, la 10 y la 11 (más la repetición después de corregir el error 10).
La IA no usó el navegador: revisó el código y corrió `npm test`.

## Detalle del producto

- [x] CA01 · Cuando el cliente abre `/producto.html?slug=<slug>`, el sistema debe mostrar el nombre del producto como título (`<h1>`), el precio, la etiqueta de disponibilidad y la descripción.
  - Evidencia: `producto.html:73-74`; `js/paginas/producto.js`. Prueba manual del autor: la remera muestra nombre, precio, “Disponible” y descripción.
- [x] CA02 · El sistema debe mostrar grande la primera foto del producto y, si tiene más de una, miniaturas debajo en el orden cargado en la base; con una sola foto, no muestra miniaturas. Si no tiene ninguna foto o no carga, muestra el recuadro “Sin foto”.
  - Evidencia: `js/componentes/galeriaProducto.js:22`, `:64-65` y `:70`. Prueba manual del autor: “Sin foto” en la remera (su foto no existe todavía).
- [x] CA34 · Cuando el cliente toca una miniatura, el sistema debe mostrar esa foto como foto principal.
  - Evidencia: `js/componentes/galeriaProducto.js:43`. Sin prueba manual: ningún producto de demostración tiene más de una foto.
- [x] CA03 · Mientras el ancho de la pantalla sea de 1024 px o más, el sistema debe mostrar las fotos a la izquierda y los datos a la derecha.
  - Evidencia: `css/paginas/producto.css:20`. Prueba manual del autor en computadora.
- [x] CA04 · Mientras el ancho de la pantalla sea menor a 1024 px, el sistema debe mostrar todo en una columna, con las fotos primero.
  - Evidencia: `css/paginas/producto.css` (una columna por defecto). Prueba manual del autor en celular.
- [x] CA05 · Cuando se carga el producto, el sistema debe cambiar el título de la pestaña a “<nombre del producto> | Urban Style”.
  - Evidencia: `js/paginas/producto.js:51`. Prueba manual del autor: la pestaña dice “Remera Demo Oversize | Urban Style”.
- [x] CA06 · El sistema debe mostrar el enlace “Volver al catálogo”, que abre `/catalogo.html`.
  - Evidencia: `producto.html:65`.
- [x] CA07 · Si el producto no existe, está dado de baja o su categoría está desactivada, entonces el sistema debe mostrar el título “No encontramos esta página”, el texto “Revisá la dirección o mirá el catálogo para encontrar tu próximo look.” y el botón “Ver catálogo”, y agregar `<meta name="robots" content="noindex">`.
  - Evidencia: `producto.html:97`; `js/paginas/producto.js:131` y `:134`; `js/lib/productos.js:106` (la RLS no devuelve productos inactivos). Prueba manual del autor: `?slug=no-existe` y sin slug muestran solo “No encontrado” (repetida después de corregir el error 10).
- [x] CA08 · Si no se puede cargar el producto, entonces el sistema debe mostrar el mensaje de error “Algo salió mal. Probá de nuevo en un momento.”, sin mostrar el error interno de Supabase.
  - Evidencia: `js/paginas/producto.js:45`. Prueba manual del autor: con el dominio de Supabase bloqueado en DevTools (Request conditions), el detalle muestra “Error: Algo salió mal. Probá de nuevo en un momento.” sin texto técnico.

## Talle y color

- [x] CA09 · El sistema debe mostrar, bajo el título “Elegí tu talle y color”, un selector de color (con la muestra del color y su nombre) y un selector de talle con las variantes activas del producto.
  - Evidencia: `js/componentes/selectorVariante.js`. Prueba manual del autor: eligió Negro y L en la remera.
- [x] CA35 · Cuando el cliente abre el detalle, el sistema debe mostrar el talle y el color sin elegir.
  - Evidencia: `js/componentes/selectorVariante.js:81`. Prueba manual del autor en la remera.
- [x] CA36 · Donde el producto tiene un solo color, el sistema debe mostrar ese color ya elegido al abrir el detalle.
  - Evidencia: `js/componentes/selectorVariante.js:81`. Prueba manual del autor: el buzo abre con Gris elegido.
- [x] CA10 · Cuando el cliente elige un color, el sistema debe mostrar tachados y deshabilitados los talles que no tienen stock en ese color.
  - Evidencia: `js/componentes/selectorVariante.js:49` y `:112`; `css/componentes/selector-variante.css` (tachado). Sin prueba manual específica: en los datos de demostración, elegir un color no deja ningún talle sin stock.
- [x] CA11 · Cuando el cliente elige un talle, el sistema debe mostrar tachados y deshabilitados los colores que no tienen stock en ese talle.
  - Evidencia: `js/componentes/selectorVariante.js:108`. Prueba manual del autor: Blanco aparece tachado en la remera.
- [x] CA12 · Cuando el cliente tiene elegidos un talle y un color, el sistema debe mostrar el stock de esa combinación con el texto “Quedan N unidades” (con 1, “Queda 1 unidad”) o, si no hay, “Sin stock en esta combinación”.
  - Evidencia: `js/paginas/producto.js:84`; tests “con 1 unidad usa el singular”, “con más de 1 usa el plural” y “sin stock lo dice” en `tests/formato.test.js`. Prueba manual del autor: Negro + L dice “Quedan 2 unidades”.
- [x] CA13 · Mientras no haya un talle y un color elegidos, o la combinación no tenga stock, el sistema debe mantener deshabilitado el botón “Agregar al carrito”.
  - Evidencia: `js/paginas/producto.js:85`. Prueba manual del autor.

## Cantidad

- [x] CA14 · El sistema debe mostrar la cantidad en 1 al elegir una combinación, con los botones “−” y “+” y un campo para escribir el número.
  - Evidencia: `js/paginas/producto.js:89`. Prueba manual del autor.
- [x] CA15 · Mientras la cantidad sea 1, el sistema debe mantener deshabilitado el botón “−”.
  - Evidencia: `js/componentes/selectorCantidad.js:45`. Prueba manual del autor: “−” y “+” con sus límites.
- [x] CA16 · Mientras la cantidad sea igual al stock de la combinación o a 10, lo que sea menor, el sistema debe mantener deshabilitado el botón “+”.
  - Evidencia: `js/componentes/selectorCantidad.js:46`; tests “es el stock si es 10 o menos” y “tiene un tope de 10” en `tests/validaciones.test.js`. Prueba manual del autor.
- [x] CA17 · Si el cliente escribe en la cantidad letras, decimales, un número negativo, 0 o un número mayor al máximo, entonces el sistema debe no aceptarlo y volver a la última cantidad válida.
  - Evidencia: `js/componentes/selectorCantidad.js:64`; tests de `esCantidadValida` en `tests/validaciones.test.js`. Prueba manual del autor: los valores inválidos vuelven al último válido.

## Agregar al carrito

- [x] CA18 · Cuando el cliente toca “Agregar al carrito”, el sistema debe sumar la variante con la cantidad elegida al carrito, actualizar el contador del encabezado y mostrar la confirmación “¡Listo! Sumaste <nombre del producto> a tu carrito.”.
  - Evidencia: `js/paginas/producto.js:120-123`. Prueba manual del autor: confirmación y contador en 2.
- [x] CA19 · Cuando el cliente agrega una variante que ya estaba en el carrito, el sistema debe sumar la cantidad nueva a la que había, sin pasar del stock de la variante ni de 10 unidades.
  - Evidencia: tests “suma la cantidad si la variante ya estaba” y “no pasa del máximo al sumar” en `tests/carrito.test.js`.
- [x] CA38 · Si la variante ya está en el carrito con todas las unidades disponibles (el stock o 10, lo que sea menor), entonces el sistema debe no sumar y mostrar el error “Ya tenés en tu carrito todas las unidades disponibles de este talle.”.
  - Evidencia: `js/paginas/producto.js:113`; test “si ya tenía el máximo, no suma y avisa que está completo” en `tests/carrito.test.js`. Prueba manual del autor: al agregar otra vez aparece el error y el contador sigue en 2.
- [x] CA20 · El sistema debe guardar el carrito en `localStorage`, con la clave `urban-style-carrito`, con solo el identificador de cada variante y su cantidad, sin precios.
  - Evidencia: `js/lib/carrito.js:57` y `:94`; test “descarta campos de más, como un precio guardado a mano” en `tests/carrito.test.js`. Prueba manual del autor: cargó el carrito a mano con esa clave.
- [x] CA39 · Si lo guardado en `urban-style-carrito` no se puede leer, entonces el sistema debe empezar con el carrito vacío.
  - Evidencia: tests de `leerCarritoGuardado` en `tests/carrito.test.js`. Prueba manual del autor: con “roto”, el contador vuelve a 0 sin errores.
- [x] CA21 · Cuando el cliente recarga la página o abre otra página del sitio, el sistema debe conservar el carrito y mostrar el contador del encabezado con el valor guardado.
  - Evidencia: `js/componentes/encabezado.js:20`. Prueba manual del autor: el contador se mantiene al recargar y al cambiar de página.
- [x] CA37 · El sistema debe mostrar en el contador del encabezado el total de unidades del carrito, no la cantidad de ítems distintos.
  - Evidencia: `js/componentes/encabezado.js:20`; test “suma las unidades, no los ítems distintos” en `tests/carrito.test.js`. Prueba manual del autor: 2 + 1 unidades muestran 3.

## Carrito

- [x] CA22 · El sistema debe mostrar en `/carrito.html` el título “Tu carrito” y, por cada ítem, la foto, el nombre, el talle, el color, el precio unitario, el selector de cantidad, el subtotal y el botón de texto “Quitar”.
  - Evidencia: `carrito.html:63`; `js/componentes/itemCarrito.js`. Prueba manual del autor: ítems y total correctos.
- [x] CA23 · El sistema debe mostrar el nombre, el precio y el stock actuales de cada ítem, leídos de la base al abrir el carrito.
  - Evidencia: `js/paginas/carrito.js:36`; `js/lib/productos.js:123`.
- [x] CA24 · Cuando el cliente cambia la cantidad de un ítem, el sistema debe guardar la cantidad nueva, con los mismos límites de CA15 a CA17.
  - Evidencia: `js/paginas/carrito.js:78`; `js/componentes/itemCarrito.js` usa `crearSelectorCantidad`. Prueba manual del autor: cambiar cantidad.
- [x] CA25 · Cuando el cliente toca “Quitar” en un ítem, el sistema debe sacarlo del carrito y de la pantalla.
  - Evidencia: `js/paginas/carrito.js:81` y `:91`. Prueba manual del autor: quitar con más de un ítem y quitar el último (después de corregir el error 10).
- [x] CA26 · Si una variante del carrito ya no está a la venta, entonces el sistema debe mostrar junto al ítem el aviso “Uno de los productos ya no está disponible.”.
  - Evidencia: `js/componentes/itemCarrito.js:79`. Prueba manual del autor: con la variante 999.
- [x] CA27 · Si la cantidad de un ítem supera el stock actual, entonces el sistema debe mostrar junto al ítem el aviso “Solo quedan N unidades de este talle.” (con 1, “Solo queda 1 unidad de este talle.”; con 0, “Este talle se agotó. Probá con otro color o talle.”, el mismo texto que devuelve `crear_pedido`).
  - Evidencia: `js/componentes/itemCarrito.js:18` y `:22`. Prueba manual del autor: “Solo quedan 2 unidades de este talle.”. Los casos de 1 y 0 se marcan con evidencia de código, sin prueba manual.
- [x] CA40 · El sistema debe mostrar debajo del resumen el botón secundario “Seguir comprando”, que abre `/catalogo.html`.
  - Evidencia: `carrito.html:76`. Prueba manual del autor.
- [x] CA28 · Mientras el carrito esté vacío, el sistema debe mostrar el texto “Tu carrito está vacío. Mirá el catálogo y armá tu look.” y el botón “Ver catálogo”.
  - Evidencia: `carrito.html:81`; `js/paginas/carrito.js:91`. Prueba manual del autor: al quitar el último ítem (después de corregir el error 10).
- [x] CA29 · Mientras el ancho de la pantalla sea de 1024 px o más, el sistema debe mostrar el resumen al costado de la lista de ítems; en pantallas más chicas, debajo.
  - Evidencia: `css/paginas/carrito.css:20`. Prueba manual del autor.
- [x] CA30 · Si no se pueden cargar los datos del carrito, entonces el sistema debe mostrar el mensaje de error “Algo salió mal. Probá de nuevo en un momento.”, sin mostrar el error interno de Supabase.
  - Evidencia: `js/paginas/carrito.js:40`. Prueba manual del autor: con el dominio de Supabase bloqueado en DevTools (Request conditions), el carrito muestra el mismo mensaje sin texto técnico.

## Subtotales y total

- [x] CA31 · El sistema debe calcular el subtotal de cada ítem como precio unitario × cantidad, y el total como la suma de los subtotales de los ítems a la venta.
  - Evidencia: tests “el subtotal es precio por cantidad” y “el total suma los subtotales de los ítems a la venta” en `tests/carrito.test.js`. Prueba manual del autor: $ 20.000 + $ 20.000 = $ 40.000.
- [x] CA32 · Cuando el cliente cambia una cantidad o quita un ítem, el sistema debe actualizar los subtotales y el total sin recargar la página.
  - Evidencia: `js/paginas/carrito.js:78`; `js/componentes/itemCarrito.js` (subtotal). Prueba manual del autor.
- [x] CA33 · El sistema debe mostrar los precios, los subtotales y el total con el formato de la spec 001 (por ejemplo, “$ 10.000”), y el total en Montserrat Bold de 24 px, bajo el título “Resumen del pedido”.
  - Evidencia: `carrito.html:74`; `css/paginas/carrito.css:45`; tests de `formatearPrecio` en `tests/formato.test.js`. Prueba manual del autor.

## Resumen

40 de 40 CA se cumplen: la funcionalidad está terminada (P1). CA06, CA10, CA19, CA23 y CA34, y los casos de 1 y 0 de
CA27, se marcaron con evidencia de código o de tests, sin prueba manual
específica; cada uno lo aclara.
