# Clarificación · Catálogo, búsqueda y filtros

> **Pregunta que responde este archivo:** ¿qué dudas tenía la spec y cómo se resolvieron?

Las preguntas salieron de la revisión con `verificar-criterios` y de las dudas
que dejó `/spec`. El autor trajo las respuestas juntas, sin preguntas de a una
(02/11/2026).

| N.º | Pregunta | Respuesta | Qué cambió en la spec |
| --- | --- | --- | --- |
| 1 | ¿Con qué texto se muestra la cantidad de productos encontrados? | “1 producto” o “N productos” | CA07 reescrito |
| 2 | ¿Cómo se escribe el precio: miles, espacio y decimales? | Signo `$`, un espacio, punto de miles y sin decimales si son cero: “$ 10.000” | CA09 reescrito |
| 3 | Con talle y color elegidos, ¿tiene que existir una variante que cumpla los dos? ¿Y “Solo con stock” se aplica a esa misma variante? | Sí: la misma variante tiene que cumplir todos los filtros, como hace `buscar_productos` en [05-DATOS.md](../../docs/05-DATOS.md) | CA20 y CA21 reescritos |
| 4 | ¿Cuándo se aplica la búsqueda: al escribir o al confirmar? | Al apretar Enter o tocar el botón “Buscar” | CA16 reescrito |
| 5 | ¿“Limpiar filtros” también borra la búsqueda? | Sí | Sin cambios: CA24 ya lo decía |
| 6 | ¿Qué texto muestra el catálogo si no se pueden cargar los productos? | El texto genérico de [10-SEGURIDAD.md](../../docs/10-SEGURIDAD.md): “Algo salió mal. Probá de nuevo en un momento.” | Sin cambios: CA15 ya lo decía |
| 7 | ¿Qué muestra la tarjeta si el producto no tiene foto? (lo agregó el autor) | Un recuadro con el texto “Sin foto” en lugar de la imagen | CA28 nuevo |
