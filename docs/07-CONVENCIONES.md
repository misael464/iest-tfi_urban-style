# 07 · Convenciones

> **Pregunta que responde este archivo:** ¿cómo escribimos el código?

Estas reglas valen para las personas y para la IA. La estructura de carpetas
está en [04-ARQUITECTURA.md](04-ARQUITECTURA.md).

## Idioma

| Qué | Idioma | Ejemplo |
| --- | --- | --- |
| Interfaz (todo lo que lee el usuario) | Español, tratando de vos | “Agregar al carrito” |
| Nombres de archivos, funciones, variables y clases CSS | Español, sin tildes ni ñ | `tarjetaProducto.js`, `calcularTotal`, `.tarjeta-producto` |
| Tablas, campos y funciones de la base de datos | Español, sin tildes ni ñ | `pedido_detalles`, `crear_pedido` |
| Comentarios y mensajes de commit | Español | `agrega filtro por talle` |
| Archivos con nombre fijo | Tal como los piden las herramientas | `index.html`, `404.html`, `robots.txt`, `package.json` |

## Nombres

| Elemento | Convención | Ejemplo correcto | Ejemplo incorrecto |
| --- | --- | --- | --- |
| Páginas HTML | minúsculas con guiones | `talles-colores.html` | `TallesColores.html` |
| Archivos CSS | minúsculas con guiones, igual que el componente o la página | `tarjeta-producto.css` | `estilos2.css` |
| Clases CSS | minúsculas con guiones, empiezan con el nombre del componente | `.tarjeta-producto`, `.tarjeta-producto-precio` | `.tp`, `.precioRojo` |
| Archivos de componentes JS | camelCase, igual que el componente | `selectorVariante.js` | `selector_variante.js` |
| Archivos de `js/lib/` | minúsculas, un sustantivo | `pedidos.js`, `formato.js` | `LogicaPedidos.js` |
| Archivos de tests | Mismo nombre que el módulo + `.test.js` | `validaciones.test.js` | `prueba1.js` |
| Variables y funciones JS | camelCase | `stockDisponible`, `agregarAlCarrito()` | `StockDisponible`, `agregar_al_carrito()` |
| Funciones que arman un componente | Empiezan con `crear` | `crearTarjetaProducto()` | `tarjeta()` |
| Valores verdadero o falso | Empiezan con `es`, `tiene` o `hay` | `hayStock`, `esDestacado` | `stock`, `flag` |
| Constantes fijas | MAYUSCULAS_CON_GUION_BAJO | `CANTIDAD_MAXIMA` | `cantMax` |
| `id` y atributos `data-` en el HTML | minúsculas con guiones | `id="grilla-productos"`, `data-variante-id` | `id="grillaProductos"` |
| Tablas y columnas SQL | snake_case | `producto_imagenes` | `ProductoImagenes` |
| Funciones RPC | snake_case, verbo + sustantivo | `crear_pedido`, `buscar_productos` | `pedidoNuevo` |
| Parámetros y variables de funciones SQL | Prefijo `p_` (parámetro) o `v_` (variable) | `p_items`, `v_total` | `items`, `total` |
| Variables CSS | Guiones, con prefijo de tipo | `--color-acento` | `--beige1` |
| Imágenes de productos | `slug-color.webp` | `remera-demo-oversize-negro.webp` | `IMG_0042.JPG` |

## Direcciones

- Cada página es un archivo `.html` en la raíz: `/catalogo.html`,
  `/carrito.html`, `/contacto.html`. El inicio es `/`.
- El detalle usa el `slug` del producto como parámetro:
  `/producto.html?slug=remera-demo-oversize`.
- Los filtros y la búsqueda viajan como parámetros:
  `/catalogo.html?buscar=buzo&categoria=remeras&talle=M&color=negro&disponible=1`.
- Si se eligen varios talles o colores, el parámetro se repite:
  `talle=M&talle=L`.
- Todo lo del panel está dentro de `/admin/`: `/admin/pedidos.html`,
  `/admin/pedido.html?id=12`.
- Los enlaces internos y las rutas a CSS, JS e imágenes empiezan con `/`
  (desde la raíz), para que funcionen igual desde `admin/`.

## HTML, CSS y JS en archivos separados

Cada lenguaje va en su propio archivo. En un `.html` **no** se escribe:

| No va en el HTML | Dónde va |
| --- | --- |
| `<style>` o el atributo `style="..."` | En el `.css` del componente o de la página |
| `<script>` con código adentro | En el `.js` de la página, en `js/paginas/` |
| Atributos de eventos (`onclick`, `onsubmit`, `onchange`…) | En el JS, con `addEventListener` |

Cada página carga, en este orden: `css/globales.css`, los CSS de los
componentes que usa, su propio CSS de `css/paginas/` y **un solo** script de
`js/paginas/`, de tipo módulo.

```html
<!-- catalogo.html -->
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Catálogo de ropa urbana | Urban Style</title>
    <meta
      name="description"
      content="Explorá el catálogo de Urban Style: filtrá por categoría, talle, color y disponibilidad y encontrá tu próximo look."
    />
    <link rel="icon" href="/img/marca/isotipo.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/css/globales.css" />
    <link rel="stylesheet" href="/css/componentes/encabezado.css" />
    <link rel="stylesheet" href="/css/componentes/tarjeta-producto.css" />
    <link rel="stylesheet" href="/css/paginas/catalogo.css" />
    <script type="module" src="/js/paginas/catalogo.js"></script>
  </head>
  <body>
    <header class="encabezado">…</header>
    <main>
      <h1>Catálogo de ropa urbana</h1>
      <p id="cantidad-resultados" role="status"></p>
      <div id="grilla-productos" class="grilla-productos"></div>
    </main>
    <footer class="pie-de-pagina">…</footer>
  </body>
</html>
```

## CSS

- Colores, fuentes, bordes y espacios se usan **siempre** con las variables
  de `css/globales.css`. Ningún valor HEX fuera de ese archivo.
- Mobile first: los estilos base son para celular y se amplían con
  `@media (min-width: 768px)` y `@media (min-width: 1024px)`, los cortes de
  [06-DISENO-UI.md](06-DISENO-UI.md).
- Las clases describen qué es el elemento, no cómo se ve: `.boton-principal`,
  no `.fondo-beige`.
- El JS no busca elementos por clase CSS: usa `id` o atributos `data-`. Así
  se puede cambiar un estilo sin romper el código.

## JavaScript

### Módulos

- Todo el JS usa módulos ES (`import` y `export`). No hay variables globales.
- Las importaciones usan rutas relativas con la extensión `.js`, porque el
  navegador las necesita completas: `import { formatearPrecio } from "../lib/formato.js";`.
- Orden de las importaciones: primero `config/`, después `lib/` y al final
  `componentes/`.
- **Solo** `js/lib/supabase.js` importa `supabase-js`. El resto de los
  archivos que necesitan datos importan funciones de `js/lib/`.
- `carrito.js`, `validaciones.js`, `whatsapp.js` y `formato.js` no importan
  Supabase ni tocan el DOM: reciben datos y devuelven datos. En `carrito.js`,
  lo que lee o escribe `localStorage` va en funciones aparte
  (`leerCarrito`, `guardarCarrito`), para que el resto se pueda probar.
- Los textos de la interfaz no se repiten: lo que se usa en varios lugares va
  en un componente o en `js/config/sitio.js`.

### Contenido dinámico

- Los elementos se arman con `document.createElement` y el texto se pone con
  `textContent`, o se clona un `<template>` escrito en el HTML.
- **No** se usan `innerHTML`, `outerHTML`, `insertAdjacentHTML` ni
  `document.write`. Así un dato de la base nunca se interpreta como HTML.
- Los atributos se asignan con propiedades (`imagen.src`, `imagen.alt`,
  `enlace.href`), nunca armando texto HTML.

```javascript
// js/componentes/tarjetaProducto.js
import { formatearPrecio } from "../lib/formato.js";
import { crearEtiquetaDisponibilidad } from "./etiquetaDisponibilidad.js";

export function crearTarjetaProducto(producto) {
  const tarjeta = document.createElement("a");
  tarjeta.className = "tarjeta-producto";
  tarjeta.href = `/producto.html?slug=${encodeURIComponent(producto.slug)}`;

  const imagen = document.createElement("img");
  imagen.className = "tarjeta-producto-imagen";
  imagen.src = producto.imagen;
  imagen.alt = producto.textoAlternativo;
  imagen.width = 400;
  imagen.height = 500;
  imagen.loading = "lazy";

  const nombre = document.createElement("h3");
  nombre.className = "tarjeta-producto-nombre";
  nombre.textContent = producto.nombre;

  const precio = document.createElement("p");
  precio.className = "tarjeta-producto-precio";
  precio.textContent = formatearPrecio(producto.precio);

  tarjeta.append(imagen, crearEtiquetaDisponibilidad(producto.stockTotal), nombre, precio);
  return tarjeta;
}
```

### Código legible y mantenible

1. **Nombres que explican.** `calcularSubtotal(item)` en lugar de `calc(i)`.
2. **Funciones cortas, con una sola tarea.** Si una función valida, calcula y
   guarda, se divide en tres.
3. **`const` por defecto;** `let` solo si el valor cambia. No se usa `var`.
4. **Sin números sueltos.** Los límites tienen nombre.
5. **Los comentarios explican el porqué,** no lo que ya dice el código.
6. **Sin código muerto:** no se dejan bloques comentados ni `console.log` de prueba.
7. **Los errores se manejan,** no se ocultan con un `catch` vacío. Toda
   llamada a Supabase revisa `error` y muestra un mensaje claro.
8. **Colores y fuentes siempre con variables CSS,** nunca escritos a mano.
9. **Formato uniforme:** 2 espacios de sangría, comillas dobles y punto y coma.

```javascript
// js/lib/validaciones.js
export const CANTIDAD_MINIMA = 1;
export const CANTIDAD_MAXIMA = 10;

// Devuelve true si la cantidad es un entero dentro del rango permitido.
export function esCantidadValida(cantidad) {
  return (
    Number.isInteger(cantidad) &&
    cantidad >= CANTIDAD_MINIMA &&
    cantidad <= CANTIDAD_MAXIMA
  );
}
```

## SQL

- Todo el SQL vive en `db/`: tablas en `esquema.sql`, políticas en
  `politicas.sql` y funciones en `funciones.sql`. El JS nunca arma texto SQL.
- Las palabras de SQL van en mayúsculas (`SELECT`, `CREATE TABLE`) y los
  nombres en minúsculas.
- Cada función RPC responde con la misma forma:

```json
{ "ok": false, "mensaje": "Solo quedan 2 unidades de este talle.", "errores": [] }
```

## Tests

- Los tests se escriben con Vitest, en `tests/`, un archivo por cada módulo
  de `js/lib/` que no usa Supabase.
- Los nombres de `describe` y de `it` van en español y dicen qué se espera.
- Cada función nueva o modificada en esos módulos suma o actualiza sus tests.
- Antes de cada commit se ejecuta `npm test` y **todos** los tests pasan.

```javascript
// tests/validaciones.test.js
import { describe, it, expect } from "vitest";

import { esCantidadValida } from "../js/lib/validaciones.js";

describe("esCantidadValida", () => {
  it("acepta cantidades enteras de 1 a 10", () => {
    expect(esCantidadValida(1)).toBe(true);
    expect(esCantidadValida(10)).toBe(true);
  });

  it("rechaza cero, negativos, decimales y más de 10", () => {
    expect(esCantidadValida(0)).toBe(false);
    expect(esCantidadValida(-1)).toBe(false);
    expect(esCantidadValida(1.5)).toBe(false);
    expect(esCantidadValida(11)).toBe(false);
  });
});
```

## Git

### Ramas

| Rama | Uso |
| --- | --- |
| `main` | Código estable; es lo que se publica en Vercel |
| `funcion/nombre-corto` | Una función nueva, por ejemplo `funcion/filtros-catalogo` |
| `arreglo/nombre-corto` | Una corrección, por ejemplo `arreglo/total-carrito` |

Cada rama se integra a `main` con un Pull Request en GitHub, después de
revisar la vista previa que genera Vercel.

### Mensajes de commit

Formato: `area: verbo en presente + qué cambia`, en español, en minúsculas,
sin punto final y con 72 caracteres como máximo.

| Área | Se usa para |
| --- | --- |
| `catalogo` | Catálogo, búsqueda, filtros y detalle |
| `carrito` | Carrito y pedidos |
| `contacto` | Página y formulario de contacto |
| `admin` | Panel de administración |
| `datos` | Esquema, políticas, funciones y datos de demostración |
| `estilos` | CSS e identidad visual |
| `tests` | Tests de Vitest |
| `docs` | Especificaciones |
| `multimedia` | Imágenes, video, gráficos y fichas de IA |

```text
catalogo: agrega filtro por talle y color
carrito: valida el stock en crear_pedido antes de registrar el pedido
admin: corrige la baja logica de productos
tests: agrega casos de cantidad invalida
docs: actualiza los requerimientos del carrito
```

Ejemplos incorrectos: `cambios`, `arreglos varios`, `ahora si funciona`.

Reglas:

- Un commit, un cambio. No se mezclan arreglos con funciones nuevas.
- No se hace commit si `npm test` falla.
- Nunca se sube la clave `service_role` ni ningún archivo con contraseñas
  (ver [10-SEGURIDAD.md](10-SEGURIDAD.md)).
- Al terminar una tarea se tilda su casilla en el `tasks.md` de su spec y, si corresponde, en [08-TAREAS.md](08-TAREAS.md), dentro del mismo commit.
