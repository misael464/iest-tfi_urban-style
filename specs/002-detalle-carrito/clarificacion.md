# Clarificación · Detalle del producto y carrito

> **Pregunta que responde este archivo:** ¿qué dudas tenía la spec y cómo se resolvieron?

El autor trajo las respuestas juntas, sin preguntas de a una (02/11/2026).

| N.º | Pregunta | Respuesta | Qué cambió en la spec |
| --- | --- | --- | --- |
| 1 | ¿Cómo es la galería de fotos del detalle? | Foto principal grande y, si hay más de una, miniaturas debajo que la cambian. Con una sola foto, sin miniaturas | CA02 reescrito; CA34 nuevo |
| 2 | ¿Con qué talle y color arranca el detalle? | Sin talle ni color elegidos. Si el producto tiene un solo color, viene elegido | CA35 y CA36 nuevos |
| 3 | ¿El contador del encabezado cuenta unidades o productos distintos? | El total de unidades del carrito | CA37 nuevo |
| 4 | ¿Qué pasa si al agregar ya está el máximo en el carrito? | No suma y muestra el error “Ya tenés en tu carrito todas las unidades disponibles de este talle.” | CA38 nuevo |
| 5 | ¿Dónde y cómo se guarda el carrito, y qué pasa si lo guardado está roto? | En `localStorage`, con la clave `urban-style-carrito`; si lo guardado está roto, se empieza con el carrito vacío | CA20 reescrito; CA39 nuevo |
| 6 | ¿El carrito tiene un botón para volver a comprar? (lo agregó el autor) | Sí: botón secundario “Seguir comprando”, debajo del resumen, que abre `/catalogo.html` | CA40 nuevo |

## Quedan como estaban en la spec

Estas dudas de `/spec` no se respondieron por separado, así que siguen las
propuestas que ya tenía la spec:

- **CA18:** la confirmación es “¡Listo! Sumaste <nombre del producto> a tu carrito.”, generalizada del ejemplo de [06-DISENO-UI.md](../../docs/06-DISENO-UI.md).
- **CA12:** el stock se muestra como “Quedan N unidades”, también con 1 unidad.
- **CA17:** un valor inválido en la cantidad vuelve a la última cantidad válida, sin mensaje.
- **Fuera de alcance:** el aviso de “cambió de precio” no se hace, porque el carrito no guarda precios ([04-ARQUITECTURA.md](../../docs/04-ARQUITECTURA.md)).
