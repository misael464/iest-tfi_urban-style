# Spec · Detalle del producto y carrito

> **Pregunta que responde este archivo:** ¿qué tiene que hacer esta funcionalidad?

## Objetivo

El cliente abre una prenda desde el catálogo, ve sus fotos, su precio y su
descripción, elige talle, color y cantidad según el stock real, y la suma al
carrito. En el carrito ve cada prenda con su subtotal y el total, puede
cambiar cantidades y quitar ítems, y el carrito se conserva aunque recargue la
página.

## Requerimientos que cubre

| ID | Requerimiento |
| --- | --- |
| RF06 | Página de detalle del producto |
| RF07 | Selección de variante (talle y color) |
| RF08 | Selector de cantidad |
| RF09 | Agregar productos al carrito |
| RF10 | Ver y modificar el carrito |
| RF11 | Cálculo automático de subtotales y total |

## Criterios de aceptación

### Detalle del producto

- **CA01 (RF06)** · Cuando el cliente abre `/producto.html?slug=<slug>`, el sistema debe mostrar el nombre del producto como título (`<h1>`), el precio, la etiqueta de disponibilidad y la descripción.
- **CA02 (RF06)** · El sistema debe mostrar grande la primera foto del producto y, si tiene más de una, miniaturas debajo en el orden cargado en la base; con una sola foto, no muestra miniaturas. Si no tiene ninguna foto o no carga, muestra el recuadro “Sin foto”.
- **CA34 (RF06)** · Cuando el cliente toca una miniatura, el sistema debe mostrar esa foto como foto principal.
- **CA03 (RF06)** · Mientras el ancho de la pantalla sea de 1024 px o más, el sistema debe mostrar las fotos a la izquierda y los datos a la derecha.
- **CA04 (RF06)** · Mientras el ancho de la pantalla sea menor a 1024 px, el sistema debe mostrar todo en una columna, con las fotos primero.
- **CA05 (RF06)** · Cuando se carga el producto, el sistema debe cambiar el título de la pestaña a “<nombre del producto> | Urban Style”.
- **CA06 (RF06)** · El sistema debe mostrar el enlace “Volver al catálogo”, que abre `/catalogo.html`.
- **CA07 (RF06)** · Si el producto no existe, está dado de baja o su categoría está desactivada, entonces el sistema debe mostrar el título “No encontramos esta página”, el texto “Revisá la dirección o mirá el catálogo para encontrar tu próximo look.” y el botón “Ver catálogo”, y agregar `<meta name="robots" content="noindex">`.
- **CA08 (RF06)** · Si no se puede cargar el producto, entonces el sistema debe mostrar el mensaje de error “Algo salió mal. Probá de nuevo en un momento.”, sin mostrar el error interno de Supabase.

### Talle y color

- **CA09 (RF07)** · El sistema debe mostrar, bajo el título “Elegí tu talle y color”, un selector de color (con la muestra del color y su nombre) y un selector de talle con las variantes activas del producto.
- **CA35 (RF07)** · Cuando el cliente abre el detalle, el sistema debe mostrar el talle y el color sin elegir.
- **CA36 (RF07)** · Donde el producto tiene un solo color, el sistema debe mostrar ese color ya elegido al abrir el detalle.
- **CA10 (RF07)** · Cuando el cliente elige un color, el sistema debe mostrar tachados y deshabilitados los talles que no tienen stock en ese color.
- **CA11 (RF07)** · Cuando el cliente elige un talle, el sistema debe mostrar tachados y deshabilitados los colores que no tienen stock en ese talle.
- **CA12 (RF07)** · Cuando el cliente tiene elegidos un talle y un color, el sistema debe mostrar el stock de esa combinación con el texto “Quedan N unidades” (con 1, “Queda 1 unidad”) o, si no hay, “Sin stock en esta combinación”.
- **CA13 (RF07)** · Mientras no haya un talle y un color elegidos, o la combinación no tenga stock, el sistema debe mantener deshabilitado el botón “Agregar al carrito”.

### Cantidad

- **CA14 (RF08)** · El sistema debe mostrar la cantidad en 1 al elegir una combinación, con los botones “−” y “+” y un campo para escribir el número.
- **CA15 (RF08)** · Mientras la cantidad sea 1, el sistema debe mantener deshabilitado el botón “−”.
- **CA16 (RF08)** · Mientras la cantidad sea igual al stock de la combinación o a 10, lo que sea menor, el sistema debe mantener deshabilitado el botón “+”.
- **CA17 (RF08)** · Si el cliente escribe en la cantidad letras, decimales, un número negativo, 0 o un número mayor al máximo, entonces el sistema debe no aceptarlo y volver a la última cantidad válida.

### Agregar al carrito

- **CA18 (RF09)** · Cuando el cliente toca “Agregar al carrito”, el sistema debe sumar la variante con la cantidad elegida al carrito, actualizar el contador del encabezado y mostrar la confirmación “¡Listo! Sumaste <nombre del producto> a tu carrito.”.
- **CA19 (RF09)** · Cuando el cliente agrega una variante que ya estaba en el carrito, el sistema debe sumar la cantidad nueva a la que había, sin pasar del stock de la variante ni de 10 unidades.
- **CA38 (RF09)** · Si la variante ya está en el carrito con todas las unidades disponibles (el stock o 10, lo que sea menor), entonces el sistema debe no sumar y mostrar el error “Ya tenés en tu carrito todas las unidades disponibles de este talle.”.
- **CA20 (RF09)** · El sistema debe guardar el carrito en `localStorage`, con la clave `urban-style-carrito`, con solo el identificador de cada variante y su cantidad, sin precios.
- **CA39 (RF09)** · Si lo guardado en `urban-style-carrito` no se puede leer, entonces el sistema debe empezar con el carrito vacío.
- **CA21 (RF09)** · Cuando el cliente recarga la página o abre otra página del sitio, el sistema debe conservar el carrito y mostrar el contador del encabezado con el valor guardado.
- **CA37 (RF09)** · El sistema debe mostrar en el contador del encabezado el total de unidades del carrito, no la cantidad de ítems distintos.

### Carrito

- **CA22 (RF10)** · El sistema debe mostrar en `/carrito.html` el título “Tu carrito” y, por cada ítem, la foto, el nombre, el talle, el color, el precio unitario, el selector de cantidad, el subtotal y el botón de texto “Quitar”.
- **CA23 (RF10)** · El sistema debe mostrar el nombre, el precio y el stock actuales de cada ítem, leídos de la base al abrir el carrito.
- **CA24 (RF10)** · Cuando el cliente cambia la cantidad de un ítem, el sistema debe guardar la cantidad nueva, con los mismos límites de CA15 a CA17.
- **CA25 (RF10)** · Cuando el cliente toca “Quitar” en un ítem, el sistema debe sacarlo del carrito y de la pantalla.
- **CA26 (RF10)** · Si una variante del carrito ya no está a la venta, entonces el sistema debe mostrar junto al ítem el aviso “Uno de los productos ya no está disponible.”.
- **CA27 (RF10)** · Si la cantidad de un ítem supera el stock actual, entonces el sistema debe mostrar junto al ítem el aviso “Solo quedan N unidades de este talle.” (con 1, “Solo queda 1 unidad de este talle.”; con 0, “Este talle se agotó. Probá con otro color o talle.”, el mismo texto que devuelve `crear_pedido`).
- **CA40 (RF10)** · El sistema debe mostrar debajo del resumen el botón secundario “Seguir comprando”, que abre `/catalogo.html`.
- **CA28 (RF10)** · Mientras el carrito esté vacío, el sistema debe mostrar el texto “Tu carrito está vacío. Mirá el catálogo y armá tu look.” y el botón “Ver catálogo”.
- **CA29 (RF10)** · Mientras el ancho de la pantalla sea de 1024 px o más, el sistema debe mostrar el resumen al costado de la lista de ítems; en pantallas más chicas, debajo.
- **CA30 (RF10)** · Si no se pueden cargar los datos del carrito, entonces el sistema debe mostrar el mensaje de error “Algo salió mal. Probá de nuevo en un momento.”, sin mostrar el error interno de Supabase.

### Subtotales y total

- **CA31 (RF11)** · El sistema debe calcular el subtotal de cada ítem como precio unitario × cantidad, y el total como la suma de los subtotales de los ítems a la venta.
- **CA32 (RF11)** · Cuando el cliente cambia una cantidad o quita un ítem, el sistema debe actualizar los subtotales y el total sin recargar la página.
- **CA33 (RF11)** · El sistema debe mostrar los precios, los subtotales y el total con el formato de la spec 001 (por ejemplo, “$ 10.000”), y el total en Montserrat Bold de 24 px, bajo el título “Resumen del pedido”.

## Fuera de alcance

- El campo “Tu nombre”, el botón “Enviar pedido por WhatsApp”, la aclaración “El pago y la entrega se coordinan por WhatsApp.” y la validación del pedido: RF12 y RF13, en `specs/003-pedido-whatsapp/`.
- Avisar que un ítem **cambió de precio**: el carrito guarda solo variante y cantidad (04-ARQUITECTURA), así que no hay un precio anterior con qué comparar. El carrito siempre muestra el precio actual (CA23).
- El recorrido “Inicio › Catálogo › Categoría › Producto” y la dirección canónica del detalle: se tratan en la Etapa 12, con [09-SEO.md](../../docs/09-SEO.md).
- Las fotos reales de los productos de demostración: las agrega el autor.
