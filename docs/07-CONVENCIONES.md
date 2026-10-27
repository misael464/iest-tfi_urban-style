# 07 · Convenciones

> **Pregunta que responde este archivo:** ¿cómo escribimos el código?

Estas reglas valen para las personas y para la IA. La estructura de carpetas
está en [04-ARQUITECTURA.md](04-ARQUITECTURA.md).

## Idioma

| Qué | Idioma | Ejemplo |
| --- | --- | --- |
| Interfaz (todo lo que lee el usuario) | Español, tratando de vos | “Agregar al carrito” |
| Nombres de componentes, funciones y variables | Español, sin tildes ni ñ | `TarjetaProducto`, `calcularTotal` |
| Tablas y campos de la base de datos | Español, sin tildes ni ñ | `pedido_detalles`, `precio_unitario` |
| Comentarios y mensajes de commit | Español | `agrega filtro por talle` |
| Archivos que exige Next.js | Inglés, tal como los pide el framework | `page.js`, `layout.js`, `route.js` |

## Nombres

| Elemento | Convención | Ejemplo correcto | Ejemplo incorrecto |
| --- | --- | --- | --- |
| Componente React y su archivo | PascalCase | `SelectorVariante.js` | `selector_variante.js` |
| Estilos de un componente | Mismo nombre + `.module.css` | `SelectorVariante.module.css` | `estilos2.css` |
| Variables y funciones | camelCase | `stockDisponible`, `agregarAlCarrito()` | `StockDisponible`, `agregar_al_carrito()` |
| Valores verdadero o falso | Empiezan con `es`, `tiene` o `hay` | `hayStock`, `esDestacado` | `stock`, `flag` |
| Constantes fijas | MAYUSCULAS_CON_GUION_BAJO | `CANTIDAD_MAXIMA` | `cantMax` |
| Archivos de `lib/` | minúsculas, sustantivo en plural | `pedidos.js` | `LogicaPedidos.js` |
| Carpetas de rutas | minúsculas con guiones | `talles-colores/` | `TallesColores/` |
| Tablas y columnas SQL | snake_case | `producto_imagenes` | `ProductoImagenes` |
| Variables CSS | Guiones, con prefijo de tipo | `--color-acento` | `--beige1` |
| Imágenes de productos | `slug-color.webp` | `remera-demo-oversize-negro.webp` | `IMG_0042.JPG` |

## Rutas

- Las direcciones van en español, en minúsculas y sin tildes: `/catalogo`, `/carrito`, `/contacto`.
- El detalle usa el `slug` del producto: `/catalogo/remera-demo-oversize`.
- Los filtros viajan como parámetros: `/catalogo?categoria=remeras&talle=M&color=negro&disponible=1`.
- Las rutas de API nombran el recurso en plural: `/api/pedidos`, `/api/consultas`.
- Todo lo del panel empieza con `/admin` (páginas) o `/api/admin` (servidor).

| Operación | Método | Ejemplo |
| --- | --- | --- |
| Leer | `GET` | `GET /api/admin/productos` |
| Crear | `POST` | `POST /api/pedidos` |
| Modificar | `PUT` | `PUT /api/admin/productos/12` |
| Dar de baja (lógica) | `DELETE` | `DELETE /api/admin/productos/12` |

Las rutas de API responden siempre en JSON con la misma forma:

```json
{ "ok": false, "mensaje": "Solo quedan 2 unidades de este talle.", "errores": [] }
```

## Módulos y organización

- Un componente por archivo. El archivo se llama igual que el componente.
- Las importaciones usan el alias `@/` en lugar de rutas largas con `../`.
- Orden de las importaciones: primero React y Next.js, después `lib/`, después
  componentes y, al final, estilos.
- Las consultas SQL se escriben **solo** en `lib/`. Las páginas y los
  componentes nunca escriben SQL.
- Un componente lleva `"use client"` únicamente si necesita interacción
  (carrito, filtros, formularios).
- Los textos de la interfaz no se repiten: lo que se usa en varios lugares va
  en un componente o en `config/sitio.js`.

```javascript
// components/TarjetaProducto.js
import Image from "next/image";
import Link from "next/link";

import { formatearPrecio } from "@/lib/formato";
import EtiquetaDisponibilidad from "@/components/EtiquetaDisponibilidad";
import estilos from "./TarjetaProducto.module.css";

export default function TarjetaProducto({ producto }) {
  return (
    <Link href={`/catalogo/${producto.slug}`} className={estilos.tarjeta}>
      <Image
        src={producto.imagen}
        alt={producto.textoAlternativo}
        width={400}
        height={500}
      />
      <EtiquetaDisponibilidad stock={producto.stockTotal} />
      <h3 className={estilos.nombre}>{producto.nombre}</h3>
      <p className={estilos.precio}>{formatearPrecio(producto.precio)}</p>
    </Link>
  );
}
```

## Código legible y mantenible

1. **Nombres que explican.** `calcularSubtotal(item)` en lugar de `calc(i)`.
2. **Funciones cortas, con una sola tarea.** Si una función valida, calcula y
   guarda, se divide en tres.
3. **`const` por defecto;** `let` solo si el valor cambia. No se usa `var`.
4. **Sin números sueltos.** Los límites tienen nombre.
5. **Los comentarios explican el porqué,** no lo que ya dice el código.
6. **Sin código muerto:** no se dejan bloques comentados ni `console.log` de prueba.
7. **Los errores se manejan,** no se ocultan con un `catch` vacío.
8. **Colores y fuentes siempre con variables CSS,** nunca escritos a mano.
9. **Formato uniforme:** 2 espacios de sangría, comillas dobles y punto y coma.

```javascript
// lib/validaciones.js
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
| `datos` | Esquema y scripts de base de datos |
| `estilos` | CSS e identidad visual |
| `docs` | Especificaciones |

```text
catalogo: agrega filtro por talle y color
carrito: valida el stock en el servidor antes de registrar el pedido
admin: corrige la baja logica de productos
docs: actualiza los requerimientos del carrito
```

Ejemplos incorrectos: `cambios`, `arreglos varios`, `ahora si funciona`.

Reglas:

- Un commit, un cambio. No se mezclan arreglos con funciones nuevas.
- Nunca se sube `.env.local` ni ningún archivo con contraseñas
  (ver [10-SEGURIDAD.md](10-SEGURIDAD.md)).
- Al terminar una tarea se tilda su casilla en [08-TAREAS.md](08-TAREAS.md)
  dentro del mismo commit.
