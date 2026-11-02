# Spec · Catálogo, búsqueda y filtros

> **Pregunta que responde este archivo:** ¿qué tiene que hacer esta funcionalidad?

## Objetivo

El cliente entra al inicio, ve el eslogan, los productos destacados y las
categorías, y llega al catálogo. En el catálogo ve todas las prendas a la
venta con foto, nombre, precio y disponibilidad, y puede buscarlas por nombre
y filtrarlas por categoría, talle, color y disponibilidad. La búsqueda y los
filtros quedan en la dirección de la página, para poder compartirla.

## Requerimientos que cubre

| ID | Requerimiento |
| --- | --- |
| RF01 | Página de inicio con banner, productos destacados y accesos a categorías |
| RF02 | Catálogo en grilla con foto, nombre, precio y disponibilidad |
| RF03 | Búsqueda de productos por nombre |
| RF04 | Filtros por categoría, talle, color y disponibilidad |
| RF05 | Mensaje cuando no hay resultados |

## Criterios de aceptación

### Inicio

- **CA01 (RF01)** · El sistema debe mostrar en el inicio un banner con el título “Tu estilo, tus reglas”, la línea “Encontrá tu próximo look y combiná las prendas a tu manera.” y el botón “Ver catálogo”.
- **CA02 (RF01)** · Cuando el cliente toca “Ver catálogo” en el banner, el sistema debe abrir `/catalogo.html`.
- **CA03 (RF01)** · El sistema debe mostrar en el inicio, bajo el título “Destacados”, hasta 8 productos activos marcados como destacados, con la misma tarjeta que el catálogo.
- **CA04 (RF01)** · Si no hay ningún producto activo marcado como destacado, entonces el sistema debe ocultar la sección “Destacados”.
- **CA05 (RF01)** · El sistema debe mostrar en el inicio un acceso por cada categoría activa, con su nombre.
- **CA06 (RF01)** · Cuando el cliente toca el acceso de una categoría, el sistema debe abrir `/catalogo.html?categoria=<slug de la categoría>` con ese filtro ya aplicado.

### Catálogo

- **CA07 (RF02)** · El sistema debe mostrar en `/catalogo.html` el título “Catálogo de ropa urbana” y, debajo, la cantidad de productos encontrados con el texto “1 producto” o “N productos”.
- **CA08 (RF02)** · El sistema debe mostrar en el catálogo solo los productos activos de categorías activas.
- **CA09 (RF02)** · El sistema debe mostrar en cada tarjeta la foto, el nombre, el precio con el signo `$`, un espacio y los miles separados con punto, sin decimales si son cero (por ejemplo, “$ 10.000”), y la etiqueta de disponibilidad.
- **CA10 (RF02)** · El sistema debe mostrar la etiqueta según el stock total del producto: “Sin stock” con 0 unidades, “Últimas unidades” con 1 a 3 y “Disponible” con 4 o más.
- **CA11 (RF02)** · Cuando el cliente toca una tarjeta, el sistema debe abrir `/producto.html?slug=<slug del producto>`.
- **CA12 (RF02)** · Mientras el ancho de la pantalla sea menor a 768 px, el sistema debe mostrar la grilla en 2 columnas.
- **CA13 (RF02)** · Mientras el ancho de la pantalla esté entre 768 y 1023 px, el sistema debe mostrar la grilla en 3 columnas.
- **CA14 (RF02)** · Mientras el ancho de la pantalla sea de 1024 px o más, el sistema debe mostrar la grilla en 4 columnas.
- **CA15 (RF02)** · Si no se pueden cargar los productos, entonces el sistema debe mostrar el mensaje de error “Algo salió mal. Probá de nuevo en un momento.”, sin mostrar el error interno de Supabase.
- **CA28 (RF02)** · Si un producto no tiene foto, entonces el sistema debe mostrar en su tarjeta un recuadro con el texto “Sin foto” en lugar de la imagen.

### Búsqueda

- **CA16 (RF03)** · Cuando el cliente aprieta Enter en el buscador o toca el botón “Buscar”, el sistema debe mostrar los productos cuyo nombre contiene el texto escrito, sin distinguir mayúsculas ni tildes. Por ejemplo, “pantalon” encuentra “Pantalón Demo Cargo”.
- **CA17 (RF03)** · Cuando el cliente busca un texto con filtros elegidos, el sistema debe mostrar solo los productos que cumplen la búsqueda y todos los filtros.
- **CA18 (RF03)** · Cuando el cliente busca un texto, el sistema debe guardarlo en la dirección con el parámetro `buscar`, por ejemplo `/catalogo.html?buscar=buzo`.

### Filtros

- **CA19 (RF04)** · El sistema debe ofrecer cuatro filtros: categoría (una sola a la vez), talle (uno o varios), color (uno o varios, con la muestra del color y su nombre) y la casilla “Solo con stock”.
- **CA20 (RF04)** · Cuando el cliente elige filtros de distintos tipos, el sistema debe mostrar solo los productos que tienen al menos una variante activa que cumple todos los filtros a la vez, donde alcanza con uno de los talles elegidos y uno de los colores elegidos.
- **CA21 (RF04)** · Cuando el cliente marca “Solo con stock”, el sistema debe mostrar solo los productos que tienen al menos una variante con stock que también cumple los demás filtros elegidos.
- **CA22 (RF04)** · Cuando el cliente cambia un filtro, el sistema debe guardarlo en la dirección con los parámetros `categoria`, `talle`, `color` y `disponible=1`, repitiendo `talle` o `color` si hay más de uno.
- **CA23 (RF04)** · Cuando alguien abre una dirección del catálogo con búsqueda o filtros, el sistema debe mostrar el catálogo con esa búsqueda y esos filtros ya aplicados y marcados.
- **CA24 (RF04)** · Cuando el cliente toca “Limpiar filtros”, el sistema debe quitar la búsqueda y todos los filtros, de la pantalla y de la dirección, y mostrar todos los productos del catálogo.
- **CA25 (RF04)** · Mientras el ancho de la pantalla sea menor a 1024 px, el sistema debe mostrar los filtros solo después de que el cliente toque el botón “Filtrar”.
- **CA26 (RF04)** · Mientras el ancho de la pantalla sea de 1024 px o más, el sistema debe mostrar los filtros en una columna a la izquierda de la grilla.

### Sin resultados

- **CA27 (RF05)** · Si la búsqueda o los filtros no devuelven productos, entonces el sistema debe mostrar el texto “No encontramos prendas con esos filtros.” y el botón “Limpiar filtros”.

## Fuera de alcance

- El detalle del producto (`producto.html`), la selección de talle y color y el selector de cantidad: RF06 a RF08, en `specs/002-detalle-carrito/`.
- El carrito y el contador del encabezado: RF09 a RF11, en `specs/002-detalle-carrito/`.
- La franja de cierre del inicio (“¿Dudas con el talle? Escribinos”), que abre WhatsApp: necesita el número del negocio, que está PENDIENTE en `js/config/sitio.js`.
- Ordenar los productos de otra forma que no sea por nombre, y dividir el catálogo en páginas: no están en los requerimientos.
- Los títulos y descripciones por categoría que arma el JS para buscadores: se tratan en la Etapa 12, con [09-SEO.md](../../docs/09-SEO.md).
