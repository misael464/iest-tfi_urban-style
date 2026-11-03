# Verificación · Pedido por WhatsApp

> **Pregunta que responde este archivo:** ¿se cumple cada criterio de la spec?

Fecha: 02/11/2026 · `npm test`: 52 tests, todos pasan

Las pruebas manuales las hizo el autor el 02/11/2026, en el navegador con Live
Server y en el panel de Supabase, al terminar las tareas 7 y 8. La IA no usó
el navegador: revisó el código y corrió `npm test`.

## Formulario del pedido

- [x] CA01 · Mientras el carrito tenga ítems, el sistema debe mostrar en `/carrito.html`, debajo del resumen, el campo “Tu nombre (obligatorio)”, el botón principal “Enviar pedido por WhatsApp” y el mensaje de información “El pago y la entrega se coordinan por WhatsApp.”.
  - Evidencia: `carrito.html:77-96`. Prueba manual del autor: hizo el pedido desde ese formulario.
- [x] CA02 · Si el cliente envía el pedido con un nombre de menos de 2 o más de 60 caracteres, entonces el sistema debe mostrar debajo del campo el error “Escribí tu nombre (entre 2 y 60 caracteres).” y no enviar nada a Supabase.
  - Evidencia: `js/paginas/carrito.js:115`; `css/componentes/formulario.css:25`; tests de `esNombreValido` en `tests/validaciones.test.js`. Prueba manual del autor: con el nombre vacío aparece el error con borde grueso.
- [x] CA03 · Mientras se envía el pedido, el sistema debe mostrar el botón con el texto “Enviando…” y deshabilitado, para evitar envíos dobles.
  - Evidencia: `js/paginas/carrito.js:20` y `:139`. Prueba manual del autor: se ve “Enviando…”.

## Validación en Supabase

- [x] CA04 · El sistema debe enviar a la función `crear_pedido` solo el nombre y la lista de variantes con sus cantidades, sin precios ni totales.
  - Evidencia: `js/lib/pedidos.js:13`.
- [x] CA05 · Cuando `crear_pedido` recibe un pedido, el sistema debe leer de la base el precio y el stock de cada variante y calcular los subtotales y el total con esos precios.
  - Evidencia: `db/funciones.sql:109` y `:141`. Prueba manual del autor: el pedido 1 quedó con total 10000, el precio de la base.
- [x] CA06 · Si el pedido llega con campos de más, como un precio o un total, entonces el sistema debe ignorarlos y calcular igual con los precios de la base.
  - Evidencia: `db/funciones.sql:141` (solo lee `varianteId` y `cantidad`). Prueba manual del autor (tarea 8): con `precio: 1` y `total: 1`, `crear_pedido` devolvió `ok: true`, `US-000003` y total 20000. Además, el `insert` directo en `pedidos` con la clave anon devolvió 401 Unauthorized.
- [x] CA07 · Si alguna variante no está a la venta o no tiene stock suficiente, entonces el sistema debe no registrar el pedido, mostrar el mensaje “Revisá los productos marcados en tu carrito.” y, junto a cada ítem con problema, el aviso que devuelve `crear_pedido`.
  - Evidencia: `js/paginas/carrito.js:157-161`; `db/funciones.sql:109-122`. Prueba manual del autor: con stock que no alcanza se ve el aviso en el ítem. El caso de la variante que no está a la venta (999) se marca con evidencia de código, sin prueba manual.
- [x] CA08 · El sistema debe usar en los avisos de `crear_pedido` los mismos textos que el carrito: “Uno de los productos ya no está disponible.”, “Este talle se agotó. Probá con otro color o talle.”, “Solo quedan N unidades de este talle.” y, con 1, “Solo queda 1 unidad de este talle.”.
  - Evidencia: `db/funciones.sql:114`, `:117` y `:122`, iguales a `js/componentes/itemCarrito.js`. Sin prueba manual de los casos de 1 y de no disponible.
- [x] CA09 · Si el carrito tiene más de 20 productos distintos, entonces el sistema debe mostrar el error “Tu carrito tiene demasiados productos distintos.” y no registrar el pedido.
  - Evidencia: `db/funciones.sql:84`; `js/paginas/carrito.js:157` muestra el mensaje de la función. Sin prueba manual.
- [x] CA10 · Si no se puede enviar el pedido por un error inesperado, entonces el sistema debe mostrar el mensaje de error “Algo salió mal. Probá de nuevo en un momento.”, sin mostrar el error interno de Supabase, y conservar el carrito.
  - Evidencia: `js/lib/pedidos.js:17`; `js/paginas/carrito.js:132` (el carrito solo se vacía si el pedido salió bien). Sin prueba manual.

## Registro y WhatsApp

- [x] CA11 · Cuando el pedido es válido, el sistema debe guardarlo en la base con estado `pendiente` y un código único con el formato `US-000001`.
  - Evidencia: `db/funciones.sql:156`. Prueba manual del autor: en Supabase quedó el pedido 1 `pendiente`, y la confirmación mostró `US-000001`.
- [x] CA12 · El sistema debe armar el mensaje de WhatsApp con los datos que devuelve `crear_pedido` y este formato: una línea por ítem con la cantidad, el nombre, el talle, el color, el precio unitario y el subtotal, y el total como suma de todas las líneas (ejemplo en `spec.md`).
  - Evidencia: `js/lib/whatsapp.js:10`; test “arma el mensaje con el formato de CA12” en `tests/whatsapp.test.js`. Prueba manual del autor: WhatsApp abrió con el mensaje de CA12.
- [x] CA13 · Cuando el cliente toca “Abrir WhatsApp”, el sistema debe abrir en otra pestaña `https://wa.me/<número de js/config/sitio.js>` con el mensaje ya escrito, codificado con `encodeURIComponent`. WhatsApp no se abre solo, porque los navegadores bloquean las ventanas emergentes.
  - Evidencia: `carrito.html:103-106` (`target="_blank"`); `js/paginas/carrito.js:187`; `js/lib/whatsapp.js:30`; test “codifica tildes, espacios y saltos de línea” en `tests/whatsapp.test.js`. Prueba manual del autor: WhatsApp abrió al número de la tienda.
- [x] CA14 · Cuando el pedido se registra, el sistema debe vaciar el carrito, poner el contador del encabezado en 0 y mostrar la confirmación “¡Listo! Tu pedido US-000001 está armado. Envialo por WhatsApp para confirmarlo.”, con el código real del pedido, y el botón principal “Abrir WhatsApp”.
  - Evidencia: `js/paginas/carrito.js:173-187`. Prueba manual del autor: confirmación con `US-000001`, contador en 0 y botón “Abrir WhatsApp”.

## Resumen

14 de 14 CA se cumplen: la funcionalidad está terminada (P1). CA04, CA09 y
CA10, y los casos de “no disponible” y de 1 unidad de CA07 y CA08, se
marcaron con evidencia de código o de tests, sin prueba manual; cada uno lo
aclara.
