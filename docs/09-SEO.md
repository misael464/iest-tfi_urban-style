# 09 · SEO

> **Pregunta que responde este archivo:** ¿cómo nos encuentran en Google?

El SEO es el conjunto de buenas prácticas para que los buscadores entiendan
el sitio y lo muestren a quien busca ropa urbana.

> **Aclaración:** estas prácticas mejoran las posibilidades de aparecer en los
> resultados, pero **no garantizan ninguna posición**. Tampoco se incluyen
> datos de ubicación ni comerciales que el negocio todavía no definió.

## Título y descripción de cada página

El título tiene 60 caracteres como máximo y la descripción, 155. Cada página
tiene los suyos, **escritos directamente en su archivo HTML**: no se repiten.

| Página | Dirección | Título | Descripción |
| --- | --- | --- | --- |
| Inicio | `/` | Urban Style \| Ropa urbana online | Remeras, buzos, pantalones y camperas para combinar a tu manera. Elegí talle y color y hacé tu pedido por WhatsApp. |
| Catálogo | `/catalogo.html` | Catálogo de ropa urbana \| Urban Style | Explorá el catálogo de Urban Style: filtrá por categoría, talle, color y disponibilidad y encontrá tu próximo look. |
| Catálogo filtrado por categoría | `/catalogo.html?categoria=...` | *Categoría* \| Urban Style | *Categoría* de Urban Style con talles, colores y stock a la vista. Elegí talle y color y pedí por WhatsApp. |
| Detalle de producto | `/producto.html?slug=...` | *Nombre del producto* \| Urban Style | Los primeros 155 caracteres de la descripción del producto. |
| Contacto (segunda etapa) | `/contacto.html` | Contacto \| Urban Style | Escribinos por el formulario o por WhatsApp. Consultá talles, colores, disponibilidad y horarios de atención. |
| Carrito | `/carrito.html` | Tu carrito \| Urban Style | No se indexa. |
| Panel (segunda etapa) | `/admin/...` | Administración \| Urban Style | No se indexa. |

El catálogo filtrado y el detalle usan el mismo archivo HTML para muchas
direcciones. Por eso su HTML tiene el título y la descripción generales del
catálogo, y el JS los reemplaza por los de la categoría o del producto cuando
termina de cargar los datos (ver [Limitación conocida](#limitación-conocida)).

## Palabras clave

Se usan de forma natural en títulos, encabezados, descripciones y textos
alternativos. No se repiten de manera forzada.

| Tipo | Palabras clave |
| --- | --- |
| Principales | ropa urbana, tienda de ropa urbana, ropa urbana online |
| Por categoría | remeras oversize, buzos canguro, pantalones cargo, camperas urbanas |
| De intención | comprar ropa urbana, ropa urbana por WhatsApp, talles de ropa urbana |
| De marca | Urban Style, Urban Style ropa |

No se usa la etiqueta `<meta name="keywords">`: Google no la tiene en cuenta
para ordenar los resultados.

## Metadatos

Cada archivo HTML lleva sus metadatos en el `<head>`. No se generan con
JavaScript, salvo en el detalle y en el catálogo filtrado.

```html
<!-- index.html -->
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Urban Style | Ropa urbana online</title>
    <meta
      name="description"
      content="Remeras, buzos, pantalones y camperas para combinar a tu manera. Elegí talle y color y hacé tu pedido por WhatsApp."
    />
    <link rel="canonical" href="https://DOMINIO-PENDIENTE/" />

    <meta property="og:type" content="website" />
    <meta property="og:locale" content="es_AR" />
    <meta property="og:site_name" content="Urban Style" />
    <meta property="og:title" content="Urban Style | Ropa urbana online" />
    <meta
      property="og:description"
      content="Remeras, buzos, pantalones y camperas para combinar a tu manera. Elegí talle y color y hacé tu pedido por WhatsApp."
    />
    <meta property="og:image" content="https://DOMINIO-PENDIENTE/img/compartir.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    …
  </head>
</html>
```

- `DOMINIO-PENDIENTE` se reemplaza por el dominio definitivo cuando el negocio
  lo defina (ver [01-CONTEXTO.md](01-CONTEXTO.md)). La dirección canónica y la
  imagen para redes necesitan la dirección completa.
- En el detalle, el JS actualiza el título, la descripción y la dirección
  canónica con los datos del producto:

```javascript
// js/paginas/producto.js
function actualizarMetadatos(producto) {
  document.title = `${producto.nombre} | Urban Style`;
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", producto.descripcion.slice(0, 155));
  document
    .querySelector('link[rel="canonical"]')
    .setAttribute("href", `https://DOMINIO-PENDIENTE/producto.html?slug=${encodeURIComponent(producto.slug)}`);
}
```

Las páginas privadas o sin valor para un buscador llevan en su `<head>`:

```html
<!-- carrito.html y páginas de admin/ -->
<meta name="robots" content="noindex, nofollow" />
```

Además:

- `sitemap.xml` es un archivo estático que lista el inicio, el catálogo y la
  dirección de cada producto activo. Se actualiza a mano cuando se agrega o se
  da de baja un producto. El contacto se suma cuando exista.
- `robots.txt` permite recorrer el sitio, excluye `/admin/` y `/carrito.html`,
  e indica dónde está el mapa del sitio.
- El idioma se declara en la etiqueta raíz de cada HTML: `<html lang="es">`.

```xml
<!-- sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://DOMINIO-PENDIENTE/</loc></url>
  <url><loc>https://DOMINIO-PENDIENTE/catalogo.html</loc></url>
  <url><loc>https://DOMINIO-PENDIENTE/producto.html?slug=remera-demo-oversize</loc></url>
  <url><loc>https://DOMINIO-PENDIENTE/producto.html?slug=buzo-demo-canguro</loc></url>
  <url><loc>https://DOMINIO-PENDIENTE/producto.html?slug=pantalon-demo-cargo</loc></url>
</urlset>
```

```text
# robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /carrito.html

Sitemap: https://DOMINIO-PENDIENTE/sitemap.xml
```

Los productos del `sitemap.xml` de ejemplo son los de demostración. Se
reemplazan por los reales en la etapa de publicación.

## Estructura de encabezados

Cada página tiene **un solo** `<h1>`, escrito en su archivo HTML, y los
niveles no se saltean.

| Página | `<h1>` | `<h2>` | `<h3>` |
| --- | --- | --- | --- |
| Inicio | Tu estilo, tus reglas | Destacados · Categorías | Nombre de cada producto |
| Catálogo | Catálogo de ropa urbana | Filtros · Resultados | Nombre de cada producto |
| Detalle | Nombre del producto | Descripción · Elegí tu talle y color | — |
| Carrito | Tu carrito | Resumen del pedido | Nombre de cada ítem |
| Contacto (segunda etapa) | Contacto | Horarios · Escribinos | — |

En el detalle, el `<h1>` existe en el HTML y el JS le pone el nombre del
producto con `textContent`.

Se usan etiquetas semánticas (`header`, `nav`, `main`, `section`, `footer`)
para que el buscador entienda cada parte.

## Texto alternativo de las imágenes

El texto alternativo describe la foto para quien no puede verla y para los
buscadores. Se guarda en el campo `texto_alternativo` de
[05-DATOS.md](05-DATOS.md), que es obligatorio, y el JS lo asigna al atributo
`alt` de cada `<img>`.

Fórmula: **prenda + característica + color + “de Urban Style” + vista**.

| Imagen | Texto alternativo correcto | Incorrecto |
| --- | --- | --- |
| Foto principal de una remera | “Remera oversize negra de Urban Style, vista de frente” | “imagen1” o “foto” |
| Segunda foto del mismo producto | “Remera oversize negra de Urban Style, vista de espalda” | Repetir el mismo texto |
| Foto de un buzo | “Buzo canguro gris de Urban Style, vista de frente” | “buzo buzos buzo canguro comprar buzo” |
| Logo del encabezado | “Urban Style” | “logo” |
| Imagen decorativa | Vacío: `alt=""` | Describir un adorno |

Reglas: 125 caracteres como máximo, sin empezar con “imagen de” y sin
amontonar palabras clave.

## URLs claras

- En minúsculas, en español, sin tildes y con guiones: `/catalogo.html`,
  `/producto.html?slug=buzo-demo-canguro`.
- El detalle se identifica con el `slug` del producto, no con un número.
- Cada producto tiene una sola dirección. Las variantes de talle y color no
  generan direcciones nuevas.
- Las páginas con filtros declaran como dirección canónica la del catálogo
  (`/catalogo.html`), para no competir entre sí.
- Si un producto no existe o se da de baja, `producto.html` muestra el mensaje
  “No encontrado” y el JS agrega `<meta name="robots" content="noindex">`.

## Imágenes optimizadas

- [ ] Usar `<img>` con `width` y `height` siempre indicados, para que la página no salte al cargar.
- [ ] Guardar las fotos en WebP, con 1200 px de lado mayor y menos de 200 KB.
- [ ] Mantener la misma proporción (4:5) en todas las fotos del catálogo.
- [ ] Cargar la imagen principal de cada página con `fetchpriority="high"` y el resto con `loading="lazy"`.
- [ ] Nombrar los archivos de forma descriptiva: `remera-demo-oversize-negro.webp`.

## Enlaces internos

- El encabezado y el pie, escritos en cada HTML, enlazan a Inicio y Catálogo
  desde todas las páginas, y a Contacto cuando exista.
- El inicio enlaza a cada categoría y a los productos destacados.
- Cada tarjeta enlaza al detalle; el detalle enlaza de vuelta a su categoría.
- El detalle muestra el recorrido: Inicio › Catálogo › Categoría › Producto.
- El carrito vacío y la página “No encontrado” enlazan al catálogo.
- El texto de cada enlace dice a dónde lleva (“Ver remeras”), no “clic acá”.

## Metadatos para redes sociales

Cuando alguien comparte un enlace por WhatsApp o redes, se muestra una vista
previa con título, descripción e imagen.

| Metadato | Valor | Observación |
| --- | --- | --- |
| `og:title` | El título de la página | Sin repetir palabras clave |
| `og:description` | La descripción de la página | La misma del buscador |
| `og:image` | `/img/compartir.jpg`, con la dirección completa | 1200 × 630 px, con el logo sobre Marfil |
| `og:type` | `website` | — |
| `og:locale` | `es_AR` | — |
| `og:site_name` | Urban Style | — |
| `twitter:card` | `summary_large_image` | Para mostrar la imagen grande |

La imagen general para compartir respeta la identidad de
[IDENTIDAD-MARCA.md](IDENTIDAD-MARCA.md): fondo Marfil, logo principal y
eslogan.

## Limitación conocida

El detalle del producto (`producto.html`) y el catálogo filtrado se arman con
JavaScript a partir de los parámetros de la dirección. Esto tiene tres
consecuencias que se aceptan para este trabajo:

1. Los buscadores leen primero el título, la descripción y el `<h1>`
   generales del HTML. El nombre, la descripción y las fotos de cada prenda
   aparecen solo si el buscador ejecuta el JavaScript.
2. WhatsApp y las redes sociales no ejecutan JavaScript: al compartir un
   producto se ve la vista previa general del sitio, no la de la prenda.
3. Si el producto no existe, la página muestra “No encontrado”, pero el
   servidor responde igual con el código 200.

## Lista de control

- [ ] Cada HTML tiene su `<title>`, su `meta description` y su `<h1>` escritos en el archivo.
- [ ] Hay un solo `<h1>` por página.
- [ ] Todas las imágenes tienen texto alternativo.
- [ ] El carrito y el panel llevan `noindex`.
- [ ] Existen `sitemap.xml` y `robots.txt`, con los productos activos.
- [ ] `DOMINIO-PENDIENTE` está reemplazado por el dominio definitivo en los HTML, `sitemap.xml` y `robots.txt`.
- [ ] Lighthouse da 80 puntos o más en SEO (RNF03).
