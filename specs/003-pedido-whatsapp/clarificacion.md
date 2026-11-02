# Clarificación · Pedido por WhatsApp

> **Pregunta que responde este archivo:** ¿qué dudas tenía la spec y cómo se resolvieron?

El autor trajo las respuestas juntas, sin preguntas de a una (02/11/2026).

| N.º | Pregunta | Respuesta | Qué cambió en la spec |
| --- | --- | --- | --- |
| 1 | ¿A qué número va el pedido? | El autor define el número de la tienda en `js/config/sitio.js`; ya no está pendiente | Sin cambios: CA13 ya lo lee de `js/config/sitio.js`. Se actualizaron 01-CONTEXTO y `memory.md` |
| 2 | ¿Cómo se escribe el mensaje de WhatsApp? | “Hola, quiero hacer este pedido en Urban Style:”, el código, una línea por ítem con cantidad, nombre, talle, color e importe, el total y el nombre del cliente | CA12 reescrito. El primer formato no incluía el precio unitario, que RF13 exige: el autor eligió sumarlo a cada línea (“2 × … (L, Negro) a $ 10.000: $ 20.000”). El total es la suma de todas las líneas |
| 3 | ¿WhatsApp se abre solo después de registrar el pedido? | No: se vacía el carrito, el contador queda en 0 y aparece la confirmación con el código y el botón principal “Abrir WhatsApp”, que abre `wa.me` en otra pestaña. Los navegadores bloquean las ventanas emergentes | CA13 y CA14 reescritos |
| 4 | ¿`crear_pedido` dice “Solo quedan 1 unidades” con stock 1? | No: dice “Solo queda 1 unidad de este talle.”. Se corrigió primero en [05-DATOS.md](../../docs/05-DATOS.md) y después en `db/funciones.sql` | Sin cambios: CA08 ya lo pedía |
| 5 | ¿Dónde va la lógica del nombre y del mensaje? | La validación del nombre en `js/lib/validaciones.js` y el mensaje y el enlace en `js/lib/whatsapp.js`, los dos con tests (P6) | Sin cambios en los CA: va en `plan.md` |
