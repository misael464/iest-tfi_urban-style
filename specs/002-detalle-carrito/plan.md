# Plan · Detalle del producto y carrito

> **Pregunta que responde este archivo:** ¿cómo se construye esta funcionalidad?

## Datos de Supabase (solo desde `js/lib/productos.js`, P4)

| Función | Qué lee | Para |
| --- | --- | --- |
| `obtenerProductoPorSlug(slug)` | `productos` con sus imágenes y sus variantes (con talle y color), `.maybeSingle()` | Detalle. Si la RLS no lo devuelve, es “No encontrado” (CA07) |
| `obtenerVariantesDelCarrito(ids)` | `variantes` con su producto, su primera foto, su talle y su color, `.in("id", ids)` | Carrito. La que no vuelve, o vuelve sin producto, no está a la venta (CA26) |

## Lógica pura, con tests (P6)

| Archivo | Funciones | CA |
| --- | --- | --- |
| `js/lib/carrito.js` | `agregarAlCarrito`, `cambiarCantidad`, `quitarDelCarrito`, `calcularSubtotal`, `calcularTotal`, `contarUnidades`, `leerCarritoGuardado` (texto → carrito; vacío si está roto). Aparte, `leerCarrito` y `guardarCarrito` usan `localStorage` con la clave `urban-style-carrito` | CA19, CA20, CA24, CA25, CA31, CA37, CA38, CA39 |
| `js/lib/validaciones.js` | `esCantidadValida(cantidad, maximo)` y `obtenerCantidadMaxima(stock)` (el menor entre el stock y 10) | CA15 a CA17 |
| `js/lib/formato.js` | `textoStock(stock)`: “Queda 1 unidad”, “Quedan N unidades” o “Sin stock en esta combinación” | CA12 |

El carrito es una lista `[{ varianteId, cantidad }]`: nunca guarda precios (CA20).

## Archivos de pantalla

| Archivo | Qué hace | CA |
| --- | --- | --- |
| `producto.html`, `css/paginas/producto.css`, `js/paginas/producto.js` | Detalle, título de la pestaña, “No encontrado” con `noindex`, error | CA01, CA03 a CA08 |
| `js/componentes/galeriaProducto.js` (nuevo en 04) | Foto principal y miniaturas | CA02, CA34 |
| `js/componentes/selectorVariante.js` + `css/componentes/selector-variante.css` | Talle y color, tachados sin stock, un solo color ya elegido | CA09 a CA11, CA35, CA36 |
| `js/componentes/selectorCantidad.js` (estilos en `selector-variante.css`) | “−”, campo y “+” con sus límites | CA14 a CA17, CA24 |
| `carrito.html`, `css/paginas/carrito.css`, `js/paginas/carrito.js` | Lista, resumen al costado o debajo, “Seguir comprando”, vacío y error; `noindex` (09) | CA22, CA23, CA28 a CA30, CA32, CA40 |
| `js/componentes/itemCarrito.js` + `css/componentes/item-carrito.css` | Un ítem con sus avisos y “Quitar” | CA22, CA25 a CA27 |
| `js/componentes/resumenCarrito.js` | Subtotal y total de 24 px bajo “Resumen del pedido” | CA31, CA33 |
| `js/componentes/encabezado.js` | `actualizarContadorCarrito()` con el total de unidades, en todas las páginas | CA18, CA21, CA37 |
| Pie de todas las páginas | Enlace “Carrito” y “© 2026 Urban Style · Tienda de demostración” | — |

## Decisiones

- `leerCarritoGuardado(texto)` va separada de `leerCarrito()`: así CA39 se prueba sin navegador.
- `galeriaProducto.js` se suma al árbol de [04-ARQUITECTURA.md](../../docs/04-ARQUITECTURA.md). Sus estilos van en `producto.css`; los del selector de cantidad, en `selector-variante.css`.
- `esCantidadValida` suma el parámetro `maximo`, que por defecto es 10: el ejemplo de 07 sigue funcionando.

## Cómo se respeta la constitución

- **P2:** cada página con su `.html`, su `.css` y su `.js`.
- **P3:** solo variables; la muestra de color usa el `hex` de la base.
- **P4:** `createElement` y `textContent`; precio y stock siempre leídos de la base, nunca guardados.
- **P6:** `carrito.js`, `validaciones.js` y `formato.js` sin DOM, sin Supabase y con tests; `localStorage` solo en `leerCarrito` y `guardarCarrito`.
