# Plan · Pedido por WhatsApp

> **Pregunta que responde este archivo:** ¿cómo se construye esta funcionalidad?

## Datos de Supabase (solo desde `js/lib/pedidos.js`, P4)

| Función | Qué hace | CA |
| --- | --- | --- |
| `enviarPedido(nombre, carrito)` | Llama a `rpc("crear_pedido")` con `p_nombre_cliente` y `p_items` (solo `varianteId` y `cantidad`). Devuelve la respuesta de la función: `{ ok, codigo, items, total }` o `{ ok: false, mensaje, errores }`. Si Supabase falla, lanza un error con un texto propio | CA04, CA10 |

`crear_pedido` ya valida, calcula con los precios de la base y guarda como
`pendiente` (CA05, CA06, CA09, CA11). Con stock 1 dice “Solo queda 1 unidad de
este talle.” (CA08).

## Lógica pura, con tests (P6)

| Archivo | Funciones | CA |
| --- | --- | --- |
| `js/lib/validaciones.js` | `esNombreValido(nombre)`: de 2 a 60 caracteres, sin contar los espacios de los costados | CA02 |
| `js/lib/whatsapp.js` | `armarMensajePedido(pedido, nombre)` con el formato de CA12 y `armarEnlaceWhatsapp(numero, mensaje)`: `https://wa.me/<número>?text=<mensaje codificado>` | CA12, CA13 |

## Archivos de pantalla

| Archivo | Qué cambia | CA |
| --- | --- | --- |
| `carrito.html` | Debajo del resumen: formulario con “Tu nombre (obligatorio)”, “Enviar pedido por WhatsApp” y el mensaje de información; un bloque oculto para la confirmación | CA01, CA14 |
| `js/paginas/carrito.js` | Valida el nombre, muestra “Enviando…”, llama a `enviarPedido`, muestra los errores (generales y por ítem) y, si sale bien, vacía el carrito y muestra la confirmación con “Abrir WhatsApp” | CA02, CA03, CA07, CA09, CA10, CA13, CA14 |
| `js/componentes/itemCarrito.js` | Cada ítem lleva `data-variante-id` y su contenedor de avisos `data-avisos`, para poner ahí el aviso de `crear_pedido` | CA07 |
| `css/componentes/formulario.css` | Campo con error: borde de 4 px (06) | CA02 |

## Decisiones

- Cuando `crear_pedido` responde `ok: false`, se muestran su `mensaje` y los de cada ítem: son textos propios escritos en [05-DATOS.md](../../docs/05-DATOS.md), no errores de Supabase. Si la llamada falla por otra cosa, se muestra el texto genérico.
- La prueba del precio alterado (tarea 8) la hace el autor desde la consola: es la comprobación de P4 de la constitución.

## Cómo se respeta la constitución

- **P2:** el formulario va en el HTML; el comportamiento, en `carrito.js`.
- **P4:** el navegador manda solo variantes y cantidades; el total y el stock los decide `crear_pedido`; los textos de error son propios o de la función, nunca `error.message`.
- **P6:** `validaciones.js` y `whatsapp.js` sin DOM ni Supabase, con tests.
