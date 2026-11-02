# Plan · Catálogo, búsqueda y filtros

> **Pregunta que responde este archivo:** ¿cómo se construye esta funcionalidad?

## Datos de Supabase (solo desde `js/lib/productos.js`, P4)

| Función de `productos.js` | Qué usa | Para |
| --- | --- | --- |
| `buscarProductos(filtros)` | `rpc("buscar_productos")` | Catálogo, búsqueda y filtros |
| `obtenerDestacados()` | `from("productos")` con `destacado = true`, sus imágenes y variantes, hasta 8 | Inicio |
| `obtenerCategorias()` | `from("categorias")` ordenadas por `orden` | Inicio y filtro de categoría |
| `obtenerTallesYColores()` | `from("talles")` y `from("colores")` | Filtros de talle y color |

La RLS ya deja ver solo lo activo. Toda llamada revisa `error` y, si falla,
muestra el texto de CA15, nunca `error.message`.

## Filtros en la dirección

`js/lib/filtros.js` (lógica pura, con tests) traduce entre la dirección y un objeto:

    /catalogo.html?buscar=buzo&categoria=remeras&talle=M&talle=L&color=negro&disponible=1
    ⇄ { buscar: "buzo", categoria: "remeras", talles: ["M", "L"], colores: ["negro"], soloConStock: true }

Cada cambio actualiza la dirección con `history.replaceState` y vuelve a llamar
a `buscarProductos`. Al cargar, se leen los parámetros y se marcan los controles.

## Archivos

| Archivo | Qué hace | CA |
| --- | --- | --- |
| `js/lib/formato.js` + `tests/formato.test.js` | `formatearPrecio` (“$ 10.000”), `obtenerDisponibilidad`, `textoCantidadProductos` | CA07, CA09, CA10 |
| `js/lib/filtros.js` + `tests/filtros.test.js` | `leerFiltros`, `armarParametros` y `crearFiltrosVacios` | CA18, CA22, CA23, CA24 |
| `js/lib/productos.js` | Las cuatro funciones de arriba | CA03, CA05, CA08, CA16, CA17, CA20, CA21 |
| `js/componentes/etiquetaDisponibilidad.js` | Etiqueta con texto | CA10 |
| `js/componentes/tarjetaProducto.js` | Tarjeta con enlace al detalle y “Sin foto” | CA09, CA11, CA28 |
| `js/componentes/grillaProductos.js` | Lista de tarjetas | CA03, CA08 |
| `js/componentes/filtrosCatalogo.js` | Controles de los filtros y botón “Limpiar filtros” | CA19, CA24 |
| `js/componentes/estadoVacio.js` | Texto y botón del estado vacío | CA27 |
| `css/componentes/tarjeta-producto.css` | Tarjeta y grilla de 2, 3 y 4 columnas | CA12, CA13, CA14 |
| `css/componentes/filtros-catalogo.css` | Filtros, botón “Filtrar” y columna lateral | CA25, CA26 |
| `index.html`, `css/paginas/inicio.css`, `js/paginas/inicio.js` | Banner, destacados y categorías | CA01 a CA06 |
| `catalogo.html`, `css/paginas/catalogo.css`, `js/paginas/catalogo.js` | Título, cantidad, buscador, filtros, grilla, error y sin resultados | CA07, CA08, CA15 a CA27 |

## Decisiones

- `js/lib/filtros.js` no estaba en [04-ARQUITECTURA.md](../../docs/04-ARQUITECTURA.md): se suma al árbol porque es lógica pura que conviene probar.
- Los destacados se leen directo de `productos`, porque `buscar_productos` no filtra por `destacado`. El JS calcula el stock total y elige la primera foto.
- La dirección se actualiza con `replaceState`: “Atrás” no recorre cada filtro intermedio.

## Cómo se respeta la constitución

- **P2:** cada página con su `.html`, su `.css` y su `.js`; el buscador es un
  `<form role="search">`, así Enter y “Buscar” disparan el mismo `submit` (CA16).
- **P3:** colores y fuentes solo con variables; la muestra de color usa el `hex` de la base.
- **P4:** `createElement` y `textContent`; nada de `innerHTML`; solo la clave anon.
- **P6:** `formato.js` y `filtros.js` no importan Supabase ni tocan el DOM, y tienen tests.
