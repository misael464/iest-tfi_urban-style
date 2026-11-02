# Verificación · Catálogo, búsqueda y filtros

> **Pregunta que responde este archivo:** ¿se cumple cada criterio de la spec?

Fecha: 02/11/2026 · `npm test`: 17 tests, todos pasan

Las pruebas manuales las hizo el autor en el navegador el 02/11/2026, con
Live Server y los datos de demostración. La IA no usó el navegador: revisó
el código y corrió `npm test`.

## Inicio

- [x] CA01 · El sistema debe mostrar en el inicio un banner con el título “Tu estilo, tus reglas”, la línea “Encontrá tu próximo look y combiná las prendas a tu manera.” y el botón “Ver catálogo”.
  - Evidencia: `index.html:65-67`. Prueba manual del autor: el banner se ve con los tres elementos.
- [x] CA02 · Cuando el cliente toca “Ver catálogo” en el banner, el sistema debe abrir `/catalogo.html`.
  - Evidencia: `index.html:67` (`href="/catalogo.html"`). Prueba manual del autor: “Ver catálogo” abre el catálogo.
- [x] CA03 · El sistema debe mostrar en el inicio, bajo el título “Destacados”, hasta 8 productos activos marcados como destacados, con la misma tarjeta que el catálogo.
  - Evidencia: `js/lib/productos.js:5` y `:64` (límite de 8); `js/paginas/inicio.js:24-29` usa `crearGrillaProductos`, la misma del catálogo. Prueba manual del autor: se ven los 2 destacados de demostración.
- [x] CA04 · Si no hay ningún producto activo marcado como destacado, entonces el sistema debe ocultar la sección “Destacados”.
  - Evidencia: `index.html:73` (la sección empieza con `hidden`) y `js/paginas/inicio.js:25` (si no hay destacados, no se muestra). Sin prueba manual: los datos de demostración tienen destacados.
- [x] CA05 · El sistema debe mostrar en el inicio un acceso por cada categoría activa, con su nombre.
  - Evidencia: `js/paginas/inicio.js:37-38`. Prueba manual del autor: 4 categorías, sin Zapatillas, que está inactiva.
- [x] CA06 · Cuando el cliente toca el acceso de una categoría, el sistema debe abrir `/catalogo.html?categoria=<slug de la categoría>` con ese filtro ya aplicado.
  - Evidencia: `js/paginas/inicio.js:38`. Prueba manual del autor: “Remeras” abre el catálogo con solo la remera.

## Catálogo

- [x] CA07 · El sistema debe mostrar en `/catalogo.html` el título “Catálogo de ropa urbana” y, debajo, la cantidad de productos encontrados con el texto “1 producto” o “N productos”.
  - Evidencia: `catalogo.html:66`; `js/paginas/catalogo.js:114`; tests “usa el singular con 1” y “usa el plural con 0 y con más de 1” en `tests/formato.test.js`. Prueba manual del autor: “3 productos”.
- [x] CA08 · El sistema debe mostrar en el catálogo solo los productos activos de categorías activas.
  - Evidencia: `db/funciones.sql:41` (`WHERE p.activo AND k.activa`) y las políticas RLS de `db/politicas.sql`. Prueba manual del autor: se ven los 3 productos de demostración.
- [x] CA09 · El sistema debe mostrar en cada tarjeta la foto, el nombre, el precio con el signo `$`, un espacio y los miles separados con punto, sin decimales si son cero (por ejemplo, “$ 10.000”), y la etiqueta de disponibilidad.
  - Evidencia: `js/componentes/tarjetaProducto.js`; tests “escribe el signo, un espacio y los miles con punto” y “no muestra decimales si son cero” en `tests/formato.test.js`. Prueba manual del autor: precios y etiquetas correctos.
- [x] CA10 · El sistema debe mostrar la etiqueta según el stock total del producto: “Sin stock” con 0 unidades, “Últimas unidades” con 1 a 3 y “Disponible” con 4 o más.
  - Evidencia: tests “con 0 unidades dice Sin stock”, “de 1 a 3 unidades dice Últimas unidades” y “con 4 o más unidades dice Disponible” en `tests/formato.test.js`. Prueba manual del autor: etiquetas correctas.
- [x] CA11 · Cuando el cliente toca una tarjeta, el sistema debe abrir `/producto.html?slug=<slug del producto>`.
  - Evidencia: `js/componentes/tarjetaProducto.js:39`. La página `producto.html` se crea en `specs/002-detalle-carrito/`: hoy el enlace lleva a la dirección correcta, que todavía no existe.
- [x] CA12 · Mientras el ancho de la pantalla sea menor a 768 px, el sistema debe mostrar la grilla en 2 columnas.
  - Evidencia: `css/componentes/tarjeta-producto.css:10`. Prueba manual del autor: 2 columnas en celular.
- [x] CA13 · Mientras el ancho de la pantalla esté entre 768 y 1023 px, el sistema debe mostrar la grilla en 3 columnas.
  - Evidencia: `css/componentes/tarjeta-producto.css:16`. Prueba manual del autor: a 900 px se ven 3 columnas.
- [x] CA14 · Mientras el ancho de la pantalla sea de 1024 px o más, el sistema debe mostrar la grilla en 4 columnas.
  - Evidencia: `css/componentes/tarjeta-producto.css:23`. Prueba manual del autor en computadora.
- [x] CA15 · Si no se pueden cargar los productos, entonces el sistema debe mostrar el mensaje de error “Algo salió mal. Probá de nuevo en un momento.”, sin mostrar el error interno de Supabase.
  - Evidencia: `js/paginas/catalogo.js:135` y `js/lib/productos.js` (no propaga el mensaje de Supabase). Prueba manual del autor: con la página cargada y la red en Offline, al buscar aparece “Error: Algo salió mal. Probá de nuevo en un momento.” sin texto técnico de Supabase.
- [x] CA28 · Si un producto no tiene foto, entonces el sistema debe mostrar en su tarjeta un recuadro con el texto “Sin foto” en lugar de la imagen.
  - Evidencia: `js/componentes/tarjetaProducto.js:8-19` y `:29` (también si la foto no carga). Prueba manual del autor: las 3 tarjetas muestran “Sin foto”.

## Búsqueda

- [x] CA16 · Cuando el cliente aprieta Enter en el buscador o toca el botón “Buscar”, el sistema debe mostrar los productos cuyo nombre contiene el texto escrito, sin distinguir mayúsculas ni tildes. Por ejemplo, “pantalon” encuentra “Pantalón Demo Cargo”.
  - Evidencia: `catalogo.html:69` (`<form role="search">`); `js/paginas/catalogo.js:27`; `db/funciones.sql:42` (`unaccent` e `ILIKE`). Prueba manual del autor: “pantalon” con Enter y con “Buscar” deja solo el pantalón.
- [x] CA17 · Cuando el cliente busca un texto con filtros elegidos, el sistema debe mostrar solo los productos que cumplen la búsqueda y todos los filtros.
  - Evidencia: `js/lib/productos.js:48-52` manda la búsqueda y los filtros en la misma llamada; `db/funciones.sql:41-52` los aplica juntos. Sin prueba manual combinada.
- [x] CA18 · Cuando el cliente busca un texto, el sistema debe guardarlo en la dirección con el parámetro `buscar`, por ejemplo `/catalogo.html?buscar=buzo`.
  - Evidencia: `js/paginas/catalogo.js:57`; test “escribe la búsqueda y repite talle y color si hay varios” en `tests/filtros.test.js`. Prueba manual del autor: la dirección queda en `?buscar=pantalon`.

## Filtros

- [x] CA19 · El sistema debe ofrecer cuatro filtros: categoría (una sola a la vez), talle (uno o varios), color (uno o varios, con la muestra del color y su nombre) y la casilla “Solo con stock”.
  - Evidencia: `js/componentes/filtrosCatalogo.js:52` (categoría con radio), `:84` (muestra con el color de la base) y `:95`. Prueba manual del autor: usó talle, color y “Solo con stock”.
- [x] CA20 · Cuando el cliente elige filtros de distintos tipos, el sistema debe mostrar solo los productos que tienen al menos una variante activa que cumple todos los filtros a la vez, donde alcanza con uno de los talles elegidos y uno de los colores elegidos.
  - Evidencia: `db/funciones.sql:50-52` (la misma variante cumple talle, color y stock). Prueba manual del autor: talle M + Gris deja solo el buzo.
- [x] CA21 · Cuando el cliente marca “Solo con stock”, el sistema debe mostrar solo los productos que tienen al menos una variante con stock que también cumple los demás filtros elegidos.
  - Evidencia: `db/funciones.sql:52`. Prueba manual del autor: “Solo con stock” + Blanco no deja ninguno (la remera blanca tiene stock 0).
- [x] CA22 · Cuando el cliente cambia un filtro, el sistema debe guardarlo en la dirección con los parámetros `categoria`, `talle`, `color` y `disponible=1`, repitiendo `talle` o `color` si hay más de uno.
  - Evidencia: `js/paginas/catalogo.js:57`; test “escribe la búsqueda y repite talle y color si hay varios” en `tests/filtros.test.js`. Prueba manual del autor: con F5 los filtros siguen marcados, así que quedaron en la dirección.
- [x] CA23 · Cuando alguien abre una dirección del catálogo con búsqueda o filtros, el sistema debe mostrar el catálogo con esa búsqueda y esos filtros ya aplicados y marcados.
  - Evidencia: `js/paginas/catalogo.js:20` y `:26`; tests “lee la búsqueda y todos los filtros de la dirección” y “lo que escribe se vuelve a leer igual” en `tests/filtros.test.js`. Prueba manual del autor: con F5 los filtros siguen marcados.
- [x] CA24 · Cuando el cliente toca “Limpiar filtros”, el sistema debe quitar la búsqueda y todos los filtros, de la pantalla y de la dirección, y mostrar todos los productos del catálogo.
  - Evidencia: `js/paginas/catalogo.js:45-46`; test “con los filtros vacíos deja la dirección sin parámetros” en `tests/filtros.test.js`. Prueba manual del autor: vuelve a los 3 productos sin parámetros.
- [x] CA25 · Mientras el ancho de la pantalla sea menor a 1024 px, el sistema debe mostrar los filtros solo después de que el cliente toque el botón “Filtrar”.
  - Evidencia: `css/componentes/filtros-catalogo.css:8`; `js/paginas/catalogo.js:63`. Prueba manual del autor en celular: aparece el botón “Filtrar”.
- [x] CA26 · Mientras el ancho de la pantalla sea de 1024 px o más, el sistema debe mostrar los filtros en una columna a la izquierda de la grilla.
  - Evidencia: `css/paginas/catalogo.css:32`; `css/componentes/filtros-catalogo.css:96`. Prueba manual del autor en computadora: filtros a la izquierda.

## Sin resultados

- [x] CA27 · Si la búsqueda o los filtros no devuelven productos, entonces el sistema debe mostrar el texto “No encontramos prendas con esos filtros.” y el botón “Limpiar filtros”.
  - Evidencia: `js/paginas/catalogo.js:120`. Prueba manual del autor: con “zzz” aparecen el texto y el botón.

## Resumen

28 de 28 CA se cumplen: la funcionalidad está terminada (P1). CA04, CA11 y
CA17 se marcaron con evidencia de código, sin prueba manual; cada uno lo
aclara.
