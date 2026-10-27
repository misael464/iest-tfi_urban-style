# 09 · SEO

> **Pregunta que responde este archivo:** ¿cómo nos encuentran en Google?

El SEO es el conjunto de buenas prácticas para que los buscadores entiendan
el sitio y lo muestren a quien busca ropa urbana.

> **Aclaración:** estas prácticas mejoran las posibilidades de aparecer en los
> resultados, pero **no garantizan ninguna posición**. Tampoco se incluyen
> datos de ubicación ni comerciales que el negocio todavía no definió.

## Título y descripción de cada página

El título tiene 60 caracteres como máximo y la descripción, 155. Cada página
tiene los suyos: no se repiten.

| Página | Dirección | Título | Descripción |
| --- | --- | --- | --- |
| Inicio | `/` | Urban Style \| Ropa urbana online | Remeras, buzos, pantalones y camperas para combinar a tu manera. Elegí talle y color y hacé tu pedido por WhatsApp. |
| Catálogo | `/catalogo` | Catálogo de ropa urbana \| Urban Style | Explorá el catálogo de Urban Style: filtrá por categoría, talle, color y disponibilidad y encontrá tu próximo look. |
| Catálogo filtrado por categoría | `/catalogo?categoria=...` | *Categoría* \| Urban Style | *Categoría* de Urban Style con talles, colores y stock a la vista. Elegí talle y color y pedí por WhatsApp. |
| Detalle de producto | `/catalogo/[slug]` | *Nombre del producto* \| Urban Style | Los primeros 155 caracteres de la descripción del producto. |
| Contacto | `/contacto` | Contacto \| Urban Style | Escribinos por el formulario o por WhatsApp. Consultá talles, colores, disponibilidad y horarios de atención. |
| Carrito | `/carrito` | Tu carrito \| Urban Style | No se indexa. |
| Panel | `/admin/...` | Administración \| Urban Style | No se indexa. |

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

Los metadatos generales se definen una vez en `app/layout.js`. Cada página
agrega los propios.

```javascript
// app/layout.js
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Urban Style | Ropa urbana online",
    template: "%s | Urban Style",
  },
  description:
    "Remeras, buzos, pantalones y camperas para combinar a tu manera. " +
    "Elegí talle y color y hacé tu pedido por WhatsApp.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Urban Style",
    images: ["/img/compartir.jpg"],
  },
};
```

```javascript
// app/catalogo/[slug]/page.js
import { obtenerProductoPorSlug } from "@/lib/productos";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const producto = await obtenerProductoPorSlug(slug);

  if (!producto) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: producto.nombre,
    description: producto.descripcion.slice(0, 155),
    alternates: { canonical: `/catalogo/${producto.slug}` },
    openGraph: { images: [producto.imagen] },
  };
}
```

Las páginas privadas o sin valor para un buscador se excluyen:

```javascript
// app/carrito/page.js y páginas del panel
export const metadata = {
  title: "Tu carrito",
  robots: { index: false, follow: false },
};
```

Además:

- `app/sitemap.js` lista el inicio, el catálogo, el contacto y cada producto activo.
- `app/robots.js` permite recorrer el sitio y excluye `/admin`, `/api` y `/carrito`.
- El idioma se declara en la etiqueta raíz: `<html lang="es">`.

## Estructura de encabezados

Cada página tiene **un solo** `<h1>` y los niveles no se saltean.

| Página | `<h1>` | `<h2>` | `<h3>` |
| --- | --- | --- | --- |
| Inicio | Tu estilo, tus reglas | Destacados · Categorías | Nombre de cada producto |
| Catálogo | Catálogo de ropa urbana | Filtros · Resultados | Nombre de cada producto |
| Detalle | Nombre del producto | Descripción · Elegí tu talle y color | — |
| Carrito | Tu carrito | Resumen del pedido | Nombre de cada ítem |
| Contacto | Contacto | Horarios · Escribinos | — |

Se usan etiquetas semánticas (`header`, `nav`, `main`, `section`, `footer`)
para que el buscador entienda cada parte.

## Texto alternativo de las imágenes

El texto alternativo describe la foto para quien no puede verla y para los
buscadores. Se guarda en el campo `texto_alternativo` de
[05-DATOS.md](05-DATOS.md), que es obligatorio.

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

- En minúsculas, en español, sin tildes y con guiones: `/catalogo/buzo-demo-canguro`.
- La dirección del detalle usa el `slug` del producto, no un número.
- Cada producto tiene una sola dirección. Las variantes de talle y color no
  generan direcciones nuevas.
- Las páginas con filtros declaran como dirección canónica la del catálogo o
  la de su categoría, para no competir entre sí.
- Si un producto se da de baja, su dirección muestra la página “No encontrado”.

## Imágenes optimizadas

- [ ] Usar el componente `<Image>` de Next.js, que entrega tamaños adaptados y formatos modernos.
- [ ] Guardar las fotos originales en WebP, con 1200 px de lado mayor y menos de 200 KB.
- [ ] Mantener la misma proporción (4:5) en todas las fotos del catálogo.
- [ ] Indicar siempre `width` y `height` para que la página no salte al cargar.
- [ ] Cargar con prioridad solo la imagen principal de cada página; el resto, a medida que se necesitan.
- [ ] Nombrar los archivos de forma descriptiva: `remera-demo-oversize-negro.webp`.

## Enlaces internos

- El encabezado y el pie enlazan a Inicio, Catálogo y Contacto desde todas las páginas.
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
| `og:image` | `/img/compartir.jpg` o la foto del producto | 1200 × 630 px, con el logo sobre Marfil |
| `og:type` | `website` | — |
| `og:locale` | `es_AR` | — |
| `og:site_name` | Urban Style | — |
| `twitter:card` | `summary_large_image` | Para mostrar la imagen grande |

La imagen general para compartir respeta la identidad de
[IDENTIDAD-MARCA.md](IDENTIDAD-MARCA.md): fondo Marfil, logo principal y
eslogan.

## Lista de control

- [ ] Cada página tiene título y descripción propios.
- [ ] Hay un solo `<h1>` por página.
- [ ] Todas las imágenes tienen texto alternativo.
- [ ] El carrito y el panel no se indexan.
- [ ] Existen `sitemap.js` y `robots.js`.
- [ ] `NEXT_PUBLIC_SITE_URL` tiene el dominio definitivo.
- [ ] Lighthouse da 90 puntos o más en SEO.
