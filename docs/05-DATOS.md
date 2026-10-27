# 05 · Datos

> **Pregunta que responde este archivo:** ¿qué información guarda Urban Style?

La base de datos es PostgreSQL (ver [03-TECNOLOGIAS.md](03-TECNOLOGIAS.md)).
El esquema de este archivo es el contenido previsto para `db/esquema.sql` y
debe coincidir siempre con él.

## Entidades

| Tabla | Qué guarda | Se relaciona con |
| --- | --- | --- |
| `categorias` | Remeras, buzos, pantalones, camperas y zapatillas | `productos` |
| `productos` | Cada prenda con su nombre, descripción y precio | `categorias`, `producto_imagenes`, `variantes` |
| `producto_imagenes` | Fotos de cada producto y su texto alternativo | `productos` |
| `talles` | Lista de talles disponibles en la tienda | `variantes` |
| `colores` | Lista de colores de las prendas | `variantes` |
| `variantes` | Combinación de producto, talle y color, con su **stock** | `productos`, `talles`, `colores` |
| `pedidos` | Cada pedido registrado y su estado | `pedido_detalles` |
| `pedido_detalles` | Los ítems de cada pedido | `pedidos`, `variantes` |
| `consultas` | Mensajes del formulario de contacto | — |
| `administradores` | Usuarios que pueden entrar al panel | `sesiones` |
| `sesiones` | Sesiones iniciadas en el panel | `administradores` |

```text
categorias 1 ──── N productos 1 ──── N producto_imagenes
                      │ 1
                      │
                      N
talles 1 ──── N   variantes   N ──── 1 colores
                      │ 1
                      │
                      N
pedidos 1 ──── N pedido_detalles

administradores 1 ──── N sesiones          consultas (sin relaciones)
```

El inventario no es una tabla aparte: el stock es un campo de `variantes`,
porque cada combinación de talle y color tiene su propia cantidad.

## Campos de cada tabla

En todas las tablas `id` es la clave primaria (`SERIAL PRIMARY KEY`).

### categorias

| Campo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `SERIAL` | Clave primaria | Identificador |
| `nombre` | `VARCHAR(40)` | Obligatorio, único | Nombre visible |
| `slug` | `VARCHAR(40)` | Obligatorio, único | Texto para la dirección, por ejemplo `remeras` |
| `orden` | `INTEGER` | Obligatorio, por defecto 0 | Posición en el menú |
| `activa` | `BOOLEAN` | Obligatorio, por defecto `TRUE` | Si se muestra en la tienda |

### productos

| Campo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `SERIAL` | Clave primaria | Identificador |
| `categoria_id` | `INTEGER` | Obligatorio, clave foránea a `categorias(id)` | Categoría del producto |
| `nombre` | `VARCHAR(120)` | Obligatorio | Nombre de la prenda |
| `slug` | `VARCHAR(140)` | Obligatorio, único | Texto para la dirección del detalle |
| `descripcion` | `TEXT` | Obligatorio, por defecto vacío | Descripción |
| `precio` | `NUMERIC(12,2)` | Obligatorio, por defecto 0, `precio >= 0` | Precio unitario |
| `destacado` | `BOOLEAN` | Obligatorio, por defecto `FALSE` | Si aparece en el inicio |
| `activo` | `BOOLEAN` | Obligatorio, por defecto `TRUE` | Baja lógica: `FALSE` lo oculta sin borrarlo |
| `creado_en` | `TIMESTAMPTZ` | Obligatorio, por defecto `now()` | Fecha de alta |
| `actualizado_en` | `TIMESTAMPTZ` | Obligatorio, por defecto `now()` | Última modificación |

### producto_imagenes

| Campo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `SERIAL` | Clave primaria | Identificador |
| `producto_id` | `INTEGER` | Obligatorio, clave foránea a `productos(id)` | Producto al que pertenece |
| `ruta` | `VARCHAR(255)` | Obligatorio | Ruta del archivo dentro de `public/` |
| `texto_alternativo` | `VARCHAR(160)` | Obligatorio | Descripción de la foto para lectores de pantalla |
| `orden` | `INTEGER` | Obligatorio, por defecto 0 | Posición en la galería |

### talles y colores

| Tabla | Campo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- | --- |
| `talles` | `id` | `SERIAL` | Clave primaria | Identificador |
| `talles` | `nombre` | `VARCHAR(10)` | Obligatorio, único | Por ejemplo `M` o `42` |
| `talles` | `orden` | `INTEGER` | Obligatorio, por defecto 0 | Para mostrar S antes que M |
| `colores` | `id` | `SERIAL` | Clave primaria | Identificador |
| `colores` | `nombre` | `VARCHAR(30)` | Obligatorio, único | Nombre del color de la prenda |
| `colores` | `hex` | `CHAR(7)` | Obligatorio, formato `#RRGGBB` | Muestra de color del selector |

> El campo `hex` describe el color de una **prenda**. No tiene relación con la
> paleta de la marca de [IDENTIDAD-MARCA.md](IDENTIDAD-MARCA.md).

### variantes

| Campo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `SERIAL` | Clave primaria | Identificador |
| `producto_id` | `INTEGER` | Obligatorio, clave foránea a `productos(id)` | Producto |
| `talle_id` | `INTEGER` | Obligatorio, clave foránea a `talles(id)` | Talle |
| `color_id` | `INTEGER` | Obligatorio, clave foránea a `colores(id)` | Color |
| `stock` | `INTEGER` | Obligatorio, por defecto 0, `stock >= 0` | Unidades disponibles |
| `activa` | `BOOLEAN` | Obligatorio, por defecto `TRUE` | Si se ofrece en la tienda |
| — | — | Única la combinación `(producto_id, talle_id, color_id)` | No se repite una variante |

### pedidos

| Campo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `SERIAL` | Clave primaria | Con él se forma el código `US-000001` |
| `nombre_cliente` | `VARCHAR(60)` | Obligatorio | Nombre que escribe el cliente |
| `estado` | `VARCHAR(12)` | Obligatorio, por defecto `pendiente`; solo `pendiente`, `confirmado`, `entregado` o `cancelado` | Estado del pedido |
| `total` | `NUMERIC(12,2)` | Obligatorio, `total >= 0` | Total calculado por el servidor |
| `creado_en` | `TIMESTAMPTZ` | Obligatorio, por defecto `now()` | Fecha del pedido |
| `actualizado_en` | `TIMESTAMPTZ` | Obligatorio, por defecto `now()` | Último cambio de estado |

### pedido_detalles

| Campo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `SERIAL` | Clave primaria | Identificador |
| `pedido_id` | `INTEGER` | Obligatorio, clave foránea a `pedidos(id)` | Pedido al que pertenece |
| `variante_id` | `INTEGER` | Obligatorio, clave foránea a `variantes(id)` | Variante pedida |
| `nombre_producto` | `VARCHAR(120)` | Obligatorio | Copia del nombre al momento del pedido |
| `talle` | `VARCHAR(10)` | Obligatorio | Copia del talle |
| `color` | `VARCHAR(30)` | Obligatorio | Copia del color |
| `cantidad` | `INTEGER` | Obligatorio, entre 1 y 10 | Unidades pedidas |
| `precio_unitario` | `NUMERIC(12,2)` | Obligatorio, `>= 0` | Copia del precio al momento del pedido |
| `subtotal` | `NUMERIC(12,2)` | Obligatorio, `>= 0` | `cantidad × precio_unitario` |

Se copian nombre, talle, color y precio para que el pedido no cambie si
después se edita o se da de baja el producto.

### consultas

| Campo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `SERIAL` | Clave primaria | Identificador |
| `nombre` | `VARCHAR(60)` | Obligatorio | Nombre de quien consulta |
| `email` | `VARCHAR(120)` | Obligatorio | Correo para responder |
| `mensaje` | `VARCHAR(1000)` | Obligatorio | Texto de la consulta |
| `respondida` | `BOOLEAN` | Obligatorio, por defecto `FALSE` | Si ya fue atendida |
| `creado_en` | `TIMESTAMPTZ` | Obligatorio, por defecto `now()` | Fecha de recepción |

### administradores y sesiones

| Tabla | Campo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- | --- |
| `administradores` | `id` | `SERIAL` | Clave primaria | Identificador |
| `administradores` | `nombre` | `VARCHAR(60)` | Obligatorio | Nombre |
| `administradores` | `email` | `VARCHAR(120)` | Obligatorio, único | Usuario para ingresar |
| `administradores` | `password_hash` | `VARCHAR(100)` | Obligatorio | Hash de la contraseña, nunca el texto original |
| `administradores` | `activo` | `BOOLEAN` | Obligatorio, por defecto `TRUE` | Permite deshabilitar una cuenta |
| `administradores` | `intentos_fallidos` | `INTEGER` | Obligatorio, por defecto 0 | Contador para el bloqueo |
| `administradores` | `bloqueado_hasta` | `TIMESTAMPTZ` | Opcional | Fin del bloqueo temporal |
| `administradores` | `creado_en` | `TIMESTAMPTZ` | Obligatorio, por defecto `now()` | Fecha de alta |
| `sesiones` | `id` | `SERIAL` | Clave primaria | Identificador |
| `sesiones` | `administrador_id` | `INTEGER` | Obligatorio, clave foránea a `administradores(id)` | Dueño de la sesión |
| `sesiones` | `token_hash` | `CHAR(64)` | Obligatorio, único | Hash SHA-256 del identificador de sesión |
| `sesiones` | `expira_en` | `TIMESTAMPTZ` | Obligatorio | Vencimiento |
| `sesiones` | `creado_en` | `TIMESTAMPTZ` | Obligatorio, por defecto `now()` | Inicio de sesión |

## Esquema SQL

```sql
-- db/esquema.sql · Urban Style
CREATE EXTENSION IF NOT EXISTS unaccent;  -- búsqueda sin distinguir tildes

CREATE TABLE categorias (
  id      SERIAL PRIMARY KEY,
  nombre  VARCHAR(40) NOT NULL UNIQUE,
  slug    VARCHAR(40) NOT NULL UNIQUE,
  orden   INTEGER     NOT NULL DEFAULT 0,
  activa  BOOLEAN     NOT NULL DEFAULT TRUE
);

CREATE TABLE productos (
  id             SERIAL PRIMARY KEY,
  categoria_id   INTEGER       NOT NULL REFERENCES categorias (id),
  nombre         VARCHAR(120)  NOT NULL,
  slug           VARCHAR(140)  NOT NULL UNIQUE,
  descripcion    TEXT          NOT NULL DEFAULT '',
  precio         NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (precio >= 0),
  destacado      BOOLEAN       NOT NULL DEFAULT FALSE,
  activo         BOOLEAN       NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE producto_imagenes (
  id                SERIAL PRIMARY KEY,
  producto_id       INTEGER      NOT NULL REFERENCES productos (id) ON DELETE CASCADE,
  ruta              VARCHAR(255) NOT NULL,
  texto_alternativo VARCHAR(160) NOT NULL,
  orden             INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE talles (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(10) NOT NULL UNIQUE,
  orden  INTEGER     NOT NULL DEFAULT 0
);

CREATE TABLE colores (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(30) NOT NULL UNIQUE,
  hex    CHAR(7)     NOT NULL CHECK (hex ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE TABLE variantes (
  id          SERIAL PRIMARY KEY,
  producto_id INTEGER NOT NULL REFERENCES productos (id),
  talle_id    INTEGER NOT NULL REFERENCES talles (id),
  color_id    INTEGER NOT NULL REFERENCES colores (id),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  activa      BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (producto_id, talle_id, color_id)
);

CREATE TABLE pedidos (
  id             SERIAL PRIMARY KEY,
  nombre_cliente VARCHAR(60)   NOT NULL,
  estado         VARCHAR(12)   NOT NULL DEFAULT 'pendiente'
                 CHECK (estado IN ('pendiente', 'confirmado', 'entregado', 'cancelado')),
  total          NUMERIC(12,2) NOT NULL CHECK (total >= 0),
  creado_en      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE pedido_detalles (
  id              SERIAL PRIMARY KEY,
  pedido_id       INTEGER       NOT NULL REFERENCES pedidos (id) ON DELETE CASCADE,
  variante_id     INTEGER       NOT NULL REFERENCES variantes (id),
  nombre_producto VARCHAR(120)  NOT NULL,
  talle           VARCHAR(10)   NOT NULL,
  color           VARCHAR(30)   NOT NULL,
  cantidad        INTEGER       NOT NULL CHECK (cantidad BETWEEN 1 AND 10),
  precio_unitario NUMERIC(12,2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal        NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0)
);

CREATE TABLE consultas (
  id         SERIAL PRIMARY KEY,
  nombre     VARCHAR(60)   NOT NULL,
  email      VARCHAR(120)  NOT NULL,
  mensaje    VARCHAR(1000) NOT NULL,
  respondida BOOLEAN       NOT NULL DEFAULT FALSE,
  creado_en  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE administradores (
  id                SERIAL PRIMARY KEY,
  nombre            VARCHAR(60)  NOT NULL,
  email             VARCHAR(120) NOT NULL UNIQUE,
  password_hash     VARCHAR(100) NOT NULL,
  activo            BOOLEAN      NOT NULL DEFAULT TRUE,
  intentos_fallidos INTEGER      NOT NULL DEFAULT 0,
  bloqueado_hasta   TIMESTAMPTZ,
  creado_en         TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE sesiones (
  id               SERIAL PRIMARY KEY,
  administrador_id INTEGER     NOT NULL REFERENCES administradores (id) ON DELETE CASCADE,
  token_hash       CHAR(64)    NOT NULL UNIQUE,
  expira_en        TIMESTAMPTZ NOT NULL,
  creado_en        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Datos de demostración

> **Datos ficticios.** Los productos de esta sección son ejemplos para probar
> el sitio. Los precios quedan en `0` como marcador: no se inventan precios
> reales. Se reemplazan desde el panel cuando el negocio defina su catálogo.

```sql
-- db/datos-demo.sql · DATOS DE DEMOSTRACIÓN (ficticios)
INSERT INTO categorias (nombre, slug, orden, activa) VALUES
  ('Remeras',    'remeras',    1, TRUE),
  ('Buzos',      'buzos',      2, TRUE),
  ('Pantalones', 'pantalones', 3, TRUE),
  ('Camperas',   'camperas',   4, TRUE),
  ('Zapatillas', 'zapatillas', 5, FALSE);  -- opcional: desactivada

INSERT INTO talles (nombre, orden) VALUES
  ('S', 1), ('M', 2), ('L', 3), ('XL', 4);

INSERT INTO colores (nombre, hex) VALUES
  ('Negro',  '#000000'),
  ('Blanco', '#FFFFFF'),
  ('Gris',   '#808080');

INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio, destacado) VALUES
  (1, 'Remera Demo Oversize', 'remera-demo-oversize',
      'Producto de demostración. Remera de algodón de corte holgado.', 0, TRUE),
  (2, 'Buzo Demo Canguro',    'buzo-demo-canguro',
      'Producto de demostración. Buzo con capucha y bolsillo delantero.', 0, TRUE),
  (3, 'Pantalón Demo Cargo',  'pantalon-demo-cargo',
      'Producto de demostración. Pantalón con bolsillos laterales.', 0, FALSE);

INSERT INTO producto_imagenes (producto_id, ruta, texto_alternativo, orden) VALUES
  (1, '/img/productos/remera-demo-oversize-negro.webp',
      'Remera oversize negra de Urban Style, vista de frente', 1),
  (2, '/img/productos/buzo-demo-canguro-gris.webp',
      'Buzo canguro gris de Urban Style, vista de frente', 1);

INSERT INTO variantes (producto_id, talle_id, color_id, stock) VALUES
  (1, 2, 1, 5),   -- Remera Demo Oversize · M · Negro
  (1, 3, 1, 2),   -- Remera Demo Oversize · L · Negro
  (1, 2, 2, 0),   -- Remera Demo Oversize · M · Blanco (sin stock)
  (2, 2, 3, 4),   -- Buzo Demo Canguro · M · Gris
  (3, 3, 1, 3);   -- Pantalón Demo Cargo · L · Negro
```

Así queda la tabla `variantes` de demostración:

| id | Producto | Talle | Color | Stock | Disponibilidad que ve el cliente |
| --- | --- | --- | --- | --- | --- |
| 1 | Remera Demo Oversize | M | Negro | 5 | Disponible |
| 2 | Remera Demo Oversize | L | Negro | 2 | Últimas unidades |
| 3 | Remera Demo Oversize | M | Blanco | 0 | Sin stock |
| 4 | Buzo Demo Canguro | M | Gris | 4 | Disponible |
| 5 | Pantalón Demo Cargo | L | Negro | 3 | Últimas unidades |

Regla de disponibilidad: **Sin stock** con 0 unidades, **Últimas unidades**
con 1 a 3, y **Disponible** con 4 o más.

## El servidor decide el total y la disponibilidad

El navegador se puede manipular: cualquier persona puede cambiar lo que envía.
Por eso el servidor **no confía** en precios, totales ni stock que lleguen
desde el carrito.

Lo único que acepta `POST /api/pedidos` es esto:

```json
{
  "nombreCliente": "Nombre de ejemplo",
  "items": [
    { "varianteId": 1, "cantidad": 2 },
    { "varianteId": 4, "cantidad": 1 }
  ]
}
```

Con esos identificadores, el servidor lee los datos reales:

```sql
SELECT v.id, p.nombre, p.precio, t.nombre AS talle, c.nombre AS color, v.stock
FROM variantes v
JOIN productos p  ON p.id = v.producto_id
JOIN categorias k ON k.id = p.categoria_id
JOIN talles t     ON t.id = v.talle_id
JOIN colores c    ON c.id = v.color_id
WHERE v.id = ANY($1) AND v.activa AND p.activo AND k.activa;
```

Reglas que aplica el servidor:

1. Si una variante no aparece en el resultado, no existe o no está a la venta: el pedido se rechaza.
2. Si `cantidad` es mayor que `stock`, el pedido se rechaza y se informa cuántas unidades quedan.
3. `subtotal = cantidad × precio` y `total = suma de subtotales`, siempre con el precio leído de la base.
4. Si el navegador envía campos de más (por ejemplo `precio` o `total`), se ignoran.
5. El pedido y sus detalles se guardan en una **transacción**: o se guarda todo o no se guarda nada.

### Descuento de stock al confirmar

Cuando el administrador confirma el pedido, el stock se descuenta dentro de
una transacción:

```sql
BEGIN;

UPDATE variantes v
SET stock = v.stock - d.cantidad
FROM pedido_detalles d
WHERE d.pedido_id = $1 AND d.variante_id = v.id;

UPDATE pedidos
SET estado = 'confirmado', actualizado_en = now()
WHERE id = $1 AND estado = 'pendiente';

COMMIT;
```

Si alguna variante quedara con stock negativo, la restricción
`CHECK (stock >= 0)` hace fallar la operación, la transacción se deshace y el
pedido sigue `pendiente`. La base de datos es la última barrera: aunque el
código tuviera un error, el stock nunca puede quedar por debajo de cero.

Si un pedido `confirmado` se cancela, las unidades se devuelven al stock con
la operación inversa.

## Datos personales

Se guarda lo mínimo: el nombre que escribe el cliente en el pedido, y el
nombre, el correo y el mensaje de las consultas. No se guardan teléfonos,
direcciones ni datos de pago. El detalle está en
[10-SEGURIDAD.md](10-SEGURIDAD.md).
