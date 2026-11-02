# Spec · Pedido por WhatsApp

> **Pregunta que responde este archivo:** ¿qué tiene que hacer esta funcionalidad?

## Objetivo

Desde el carrito, el cliente escribe su nombre y envía el pedido. Supabase
valida el pedido con los precios y el stock de la base y lo registra como
`pendiente`, con un código propio. Después se abre WhatsApp con el mensaje del
pedido ya escrito, listo para mandarlo al negocio, y el carrito queda vacío.

## Requerimientos que cubre

| ID | Requerimiento |
| --- | --- |
| RF12 | Validación del pedido en el servidor |
| RF13 | Registro del pedido y envío por WhatsApp |

## Criterios de aceptación

### Formulario del pedido

- **CA01 (RF13)** · Mientras el carrito tenga ítems, el sistema debe mostrar en `/carrito.html`, debajo del resumen, el campo “Tu nombre (obligatorio)”, el botón principal “Enviar pedido por WhatsApp” y el mensaje de información “El pago y la entrega se coordinan por WhatsApp.”.
- **CA02 (RF12)** · Si el cliente envía el pedido con un nombre de menos de 2 o más de 60 caracteres, entonces el sistema debe mostrar debajo del campo el error “Escribí tu nombre (entre 2 y 60 caracteres).” y no enviar nada a Supabase.
- **CA03 (RF13)** · Mientras se envía el pedido, el sistema debe mostrar el botón con el texto “Enviando…” y deshabilitado, para evitar envíos dobles.

### Validación en Supabase

- **CA04 (RF12)** · El sistema debe enviar a la función `crear_pedido` solo el nombre y la lista de variantes con sus cantidades, sin precios ni totales.
- **CA05 (RF12)** · Cuando `crear_pedido` recibe un pedido, el sistema debe leer de la base el precio y el stock de cada variante y calcular los subtotales y el total con esos precios.
- **CA06 (RF12)** · Si el pedido llega con campos de más, como un precio o un total, entonces el sistema debe ignorarlos y calcular igual con los precios de la base.
- **CA07 (RF12)** · Si alguna variante no está a la venta o no tiene stock suficiente, entonces el sistema debe no registrar el pedido, mostrar el mensaje “Revisá los productos marcados en tu carrito.” y, junto a cada ítem con problema, el aviso que devuelve `crear_pedido`.
- **CA08 (RF12)** · El sistema debe usar en los avisos de `crear_pedido` los mismos textos que el carrito: “Uno de los productos ya no está disponible.”, “Este talle se agotó. Probá con otro color o talle.”, “Solo quedan N unidades de este talle.” y, con 1, “Solo queda 1 unidad de este talle.”.
- **CA09 (RF12)** · Si el carrito tiene más de 20 productos distintos, entonces el sistema debe mostrar el error “Tu carrito tiene demasiados productos distintos.” y no registrar el pedido.
- **CA10 (RF12)** · Si no se puede enviar el pedido por un error inesperado, entonces el sistema debe mostrar el mensaje de error “Algo salió mal. Probá de nuevo en un momento.”, sin mostrar el error interno de Supabase, y conservar el carrito.

### Registro y WhatsApp

- **CA11 (RF13)** · Cuando el pedido es válido, el sistema debe guardarlo en la base con estado `pendiente` y un código único con el formato `US-000001`.
- **CA12 (RF13)** · El sistema debe armar el mensaje de WhatsApp con los datos que devuelve `crear_pedido` y este formato: una línea por ítem con la cantidad, el nombre, el talle, el color, el precio unitario y el subtotal, y el total como suma de todas las líneas.

  ```text
  Hola, quiero hacer este pedido en Urban Style:
  Pedido US-000001
  - 2 × Remera Demo Oversize (L, Negro) a $ 10.000: $ 20.000
  - 1 × Buzo Demo Canguro (M, Gris) a $ 20.000: $ 20.000
  Total: $ 40.000
  Nombre: <nombre del cliente>
  ```
- **CA13 (RF13)** · Cuando el cliente toca “Abrir WhatsApp”, el sistema debe abrir en otra pestaña `https://wa.me/<número de js/config/sitio.js>` con el mensaje ya escrito, codificado con `encodeURIComponent`. WhatsApp no se abre solo, porque los navegadores bloquean las ventanas emergentes.
- **CA14 (RF13)** · Cuando el pedido se registra, el sistema debe vaciar el carrito, poner el contador del encabezado en 0 y mostrar la confirmación “¡Listo! Tu pedido US-000001 está armado. Envialo por WhatsApp para confirmarlo.”, con el código real del pedido, y el botón principal “Abrir WhatsApp”.

## Fuera de alcance

- Confirmar, entregar o cancelar pedidos, y descontar el stock al confirmar: lo hace el negocio desde el panel web de Supabase hasta que exista el panel propio (RF21, segunda etapa).
- Cobrar o calcular envíos: el sitio no cobra ni promete plazos ([01-CONTEXTO.md](../../docs/01-CONTEXTO.md)).
- Pedir teléfono, dirección u otros datos del cliente: solo se guarda el nombre ([10-SEGURIDAD.md](../../docs/10-SEGURIDAD.md)).
- Limitar la cantidad de pedidos por visitante: es una limitación conocida de [10-SEGURIDAD.md](../../docs/10-SEGURIDAD.md).
