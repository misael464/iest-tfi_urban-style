# 05 · Datos

> **Pregunta que responde este archivo:** ¿qué información guarda Urban Style?

La base de datos es PostgreSQL, alojada en Supabase (ver
[03-TECNOLOGIAS.md](03-TECNOLOGIAS.md)). Las secciones de SQL de este archivo
son el contenido previsto de los archivos de `db/` y deben coincidir siempre
con ellos:

| Sección | Archivo |
| --- | --- |
| [Esquema SQL](#esquema-sql) | `db/esquema.sql` |
| [Políticas de acceso (RLS)](#políticas-de-acceso-rls) | `db/politicas.sql` |
| [Funciones RPC](#funciones-rpc) | `db/funciones.sql` |
| [Datos de demostración](#datos-de-demostración) | `db/datos-demo.sql` |

Se ejecutan en ese orden, en el editor SQL de Supabase.

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
| `administradores` | Qué usuarios de Supabase Auth pueden entrar al panel | `auth.users` |

Son 10 tablas propias. El correo, la contraseña y las sesiones de los
administradores los guarda **Supabase Auth** en su tabla `auth.users`: no hay
tabla de sesiones ni campo de contraseña en el esquema del proyecto.

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

auth.users 1 ──── 1 administradores        consultas (sin relaciones)
(Supabase Auth)
```

El inventario no es una tabla aparte: el stock es un campo de `variantes`,
porque cada combinación de talle y color tiene su propia cantidad.

## Campos de cada tabla

En todas las tablas, salvo `administradores`, `id` es la clave primaria
(`SERIAL PRIMARY KEY`).

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
| `slug` | `VARCHAR(140)` | Obligatorio, único | Texto para la dirección del detalle (`producto.html?slug=...`) |
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
| `ruta` | `VARCHAR(255)` | Obligatorio, empieza con `/img/productos/` | Ruta del archivo dentro de `img/productos/` |
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
| `nombre_cliente` | `VARCHAR(60)` | Obligatorio, de 2 a 60 caracteres | Nombre que escribe el cliente |
| `estado` | `VARCHAR(12)` | Obligatorio, por defecto `pendiente`; solo `pendiente`, `confirmado`, `entregado` o `cancelado` | Estado del pedido |
| `total` | `NUMERIC(12,2)` | Obligatorio, `total >= 0` | Total calculado por la función `crear_pedido` |
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
| `nombre` | `VARCHAR(60)` | Obligatorio, de 2 a 60 caracteres | Nombre de quien consulta |
| `email` | `VARCHAR(120)` | Obligatorio, formato de correo | Correo para responder |
| `mensaje` | `VARCHAR(1000)` | Obligatorio, de 10 a 1000 caracteres | Texto de la consulta |
| `respondida` | `BOOLEAN` | Obligatorio, por defecto `FALSE` | Si ya fue atendida |
| `creado_en` | `TIMESTAMPTZ` | Obligatorio, por defecto `now()` | Fecha de recepción |

### administradores

| Campo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `UUID` | Clave primaria, clave foránea a `auth.users(id)` | El mismo identificador del usuario en Supabase Auth |
| `nombre` | `VARCHAR(60)` | Obligatorio | Nombre |
| `activo` | `BOOLEAN` | Obligatorio, por defecto `TRUE` | Permite deshabilitar una cuenta sin borrarla |
| `creado_en` | `TIMESTAMPTZ` | Obligatorio, por defecto `now()` | Fecha de alta |

Tener usuario en Supabase Auth **no alcanza** para entrar al panel: además
tiene que estar en esta tabla y activo. El alta se explica en
[10-SEGURIDAD.md](10-SEGURIDAD.md).

## Esquema SQL

```sql
-- db/esquema.sql · Urban Style
CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA extensions;  -- búsqueda sin distinguir tildes

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
  ruta              VARCHAR(255) NOT NULL CHECK (ruta LIKE '/img/productos/%'),
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
  nombre_cliente VARCHAR(60)   NOT NULL
                 CHECK (char_length(btrim(nombre_cliente)) BETWEEN 2 AND 60),
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
  nombre     VARCHAR(60)   NOT NULL CHECK (char_length(btrim(nombre)) BETWEEN 2 AND 60),
  email      VARCHAR(120)  NOT NULL CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  mensaje    VARCHAR(1000) NOT NULL CHECK (char_length(btrim(mensaje)) BETWEEN 10 AND 1000),
  respondida BOOLEAN       NOT NULL DEFAULT FALSE,
  creado_en  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE administradores (
  id        UUID        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  nombre    VARCHAR(60) NOT NULL,
  activo    BOOLEAN     NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Las restricciones `CHECK` son la validación que no se puede saltear: aunque
alguien arme una solicitud a mano, la base rechaza un precio negativo, un
stock negativo, una cantidad fuera de rango o un nombre vacío.

## Políticas de acceso (RLS)

Con **Row Level Security** (RLS), cada tabla decide qué filas puede leer o
modificar cada usuario. Si una tabla tiene RLS activado y no hay una política
que permita una operación, la operación se rechaza.

Hay dos tipos de usuario:

| Rol de Supabase | Quién es | Qué puede hacer |
| --- | --- | --- |
| `anon` | Cualquier visitante, con la clave anon | Leer el catálogo activo. Crear pedidos y consultas **solo** mediante las funciones RPC. Nada más |
| `authenticated` + `es_admin()` | Un usuario con sesión que figura activo en `administradores` | Leer y modificar el catálogo; leer pedidos y consultas; cambiar el estado de los pedidos mediante las funciones RPC |

Un usuario `authenticated` que **no** está en `administradores` tiene los
mismos permisos que un visitante.

| Tabla | Visitantes (`anon`) | Administradores |
| --- | --- | --- |
| `categorias` | Leen las activas | Todo |
| `productos` | Leen los activos de categorías activas | Todo |
| `producto_imagenes` | Leen las de productos activos | Todo |
| `talles` y `colores` | Leen todos | Todo |
| `variantes` | Leen las activas de productos activos | Todo |
| `pedidos` y `pedido_detalles` | Nada (crean pedidos solo con `crear_pedido`) | Leen; cambian el estado solo con las funciones RPC |
| `consultas` | Nada (crean consultas solo con `crear_consulta`) | Leen y marcan como respondidas |
| `administradores` | Nada | Leen |

```sql
-- db/politicas.sql · Urban Style

-- Devuelve TRUE si quien hace la solicitud es un administrador activo.
-- SECURITY DEFINER permite leer administradores sin depender de su propia RLS.
CREATE OR REPLACE FUNCTION es_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM administradores
    WHERE id = auth.uid() AND activo
  );
$$;

ALTER TABLE categorias        ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto_imagenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE talles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE colores           ENABLE ROW LEVEL SECURITY;
ALTER TABLE variantes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_detalles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas         ENABLE ROW LEVEL SECURITY;
ALTER TABLE administradores   ENABLE ROW LEVEL SECURITY;

-- Catálogo: lectura pública de lo activo
CREATE POLICY catalogo_lee_categorias ON categorias
  FOR SELECT TO anon, authenticated
  USING (activa);

CREATE POLICY catalogo_lee_productos ON productos
  FOR SELECT TO anon, authenticated
  USING (activo AND EXISTS (
    SELECT 1 FROM categorias k WHERE k.id = categoria_id AND k.activa
  ));

CREATE POLICY catalogo_lee_imagenes ON producto_imagenes
  FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM productos p WHERE p.id = producto_id AND p.activo
  ));

CREATE POLICY catalogo_lee_talles ON talles
  FOR SELECT TO anon, authenticated
  USING (TRUE);

CREATE POLICY catalogo_lee_colores ON colores
  FOR SELECT TO anon, authenticated
  USING (TRUE);

CREATE POLICY catalogo_lee_variantes ON variantes
  FOR SELECT TO anon, authenticated
  USING (activa AND EXISTS (
    SELECT 1 FROM productos p WHERE p.id = producto_id AND p.activo
  ));

-- Catálogo: el administrador puede todo
CREATE POLICY admin_gestiona_categorias ON categorias
  FOR ALL TO authenticated USING (es_admin()) WITH CHECK (es_admin());

CREATE POLICY admin_gestiona_productos ON productos
  FOR ALL TO authenticated USING (es_admin()) WITH CHECK (es_admin());

CREATE POLICY admin_gestiona_imagenes ON producto_imagenes
  FOR ALL TO authenticated USING (es_admin()) WITH CHECK (es_admin());

CREATE POLICY admin_gestiona_talles ON talles
  FOR ALL TO authenticated USING (es_admin()) WITH CHECK (es_admin());

CREATE POLICY admin_gestiona_colores ON colores
  FOR ALL TO authenticated USING (es_admin()) WITH CHECK (es_admin());

CREATE POLICY admin_gestiona_variantes ON variantes
  FOR ALL TO authenticated USING (es_admin()) WITH CHECK (es_admin());

-- Pedidos: solo lectura para el administrador.
-- Se crean con crear_pedido y cambian de estado con las funciones RPC.
CREATE POLICY admin_lee_pedidos ON pedidos
  FOR SELECT TO authenticated USING (es_admin());

CREATE POLICY admin_lee_detalles ON pedido_detalles
  FOR SELECT TO authenticated USING (es_admin());

-- Consultas: se crean con crear_consulta; el administrador las lee y las marca
CREATE POLICY admin_lee_consultas ON consultas
  FOR SELECT TO authenticated USING (es_admin());

CREATE POLICY admin_responde_consultas ON consultas
  FOR UPDATE TO authenticated USING (es_admin()) WITH CHECK (es_admin());

-- Administradores: solo los administradores ven la lista
CREATE POLICY admin_lee_administradores ON administradores
  FOR SELECT TO authenticated USING (es_admin());
```

No hay políticas de `INSERT`, `UPDATE` ni `DELETE` para `anon` en ninguna
tabla: un visitante no puede modificar nada directamente.

## Funciones RPC

Una función RPC es una función de PostgreSQL que el navegador llama con
`supabase.rpc("nombre", { parametros })`. Se ejecuta en el servidor de
Supabase, con los datos de la base, y todo lo que hace dentro de una llamada
se guarda o se descarta junto: funciona como una transacción.

| Función | Quién la llama | Qué hace | Permisos |
| --- | --- | --- | --- |
| `buscar_productos` | Catálogo | Busca por nombre sin distinguir tildes y aplica los filtros | Se ejecuta con los permisos de quien la llama: respeta la RLS |
| `crear_pedido` | Carrito | Valida el pedido, calcula el total con los precios de la base y lo registra | `SECURITY DEFINER`: puede escribir en `pedidos` aunque el visitante no |
| `crear_consulta` | Contacto | Guarda una consulta y descarta los envíos automáticos | `SECURITY DEFINER` |
| `confirmar_pedido` | Panel | Pasa el pedido a `confirmado` y descuenta el stock | `SECURITY DEFINER` y comprueba `es_admin()` |
| `entregar_pedido` | Panel | Pasa un pedido confirmado a `entregado` | `SECURITY DEFINER` y comprueba `es_admin()` |
| `cancelar_pedido` | Panel | Cancela el pedido y, si estaba confirmado, devuelve el stock | `SECURITY DEFINER` y comprueba `es_admin()` |

Todas responden con la misma forma, que el JS lee sin adivinar:

```json
{ "ok": false, "mensaje": "Revisá los productos marcados en tu carrito.", "errores": [] }
```

```sql
-- db/funciones.sql · Urban Style

-- ---------------------------------------------------------------------------
-- Catálogo: búsqueda y filtros
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION buscar_productos(
  p_texto          TEXT    DEFAULT NULL,
  p_categoria      TEXT    DEFAULT NULL,
  p_talles         TEXT[]  DEFAULT NULL,
  p_colores        TEXT[]  DEFAULT NULL,
  p_solo_con_stock BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  id                INTEGER,
  nombre            VARCHAR,
  slug              VARCHAR,
  precio            NUMERIC,
  stock_total       BIGINT,
  imagen            VARCHAR,
  texto_alternativo VARCHAR
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, extensions
AS $$
  SELECT p.id, p.nombre, p.slug, p.precio,
         (SELECT coalesce(sum(v.stock), 0)
            FROM variantes v
           WHERE v.producto_id = p.id AND v.activa) AS stock_total,
         i.ruta, i.texto_alternativo
  FROM productos p
  JOIN categorias k ON k.id = p.categoria_id
  LEFT JOIN LATERAL (
    SELECT ruta, texto_alternativo
    FROM producto_imagenes
    WHERE producto_id = p.id
    ORDER BY orden
    LIMIT 1
  ) i ON TRUE
  WHERE p.activo AND k.activa
    AND (p_texto IS NULL OR unaccent(p.nombre) ILIKE '%' || unaccent(p_texto) || '%')
    AND (p_categoria IS NULL OR k.slug = p_categoria)
    AND EXISTS (
      SELECT 1
      FROM variantes v
      JOIN talles t  ON t.id = v.talle_id
      JOIN colores c ON c.id = v.color_id
      WHERE v.producto_id = p.id AND v.activa
        AND (p_talles  IS NULL OR t.nombre = ANY (p_talles))
        AND (p_colores IS NULL OR lower(c.nombre) = ANY (p_colores))
        AND (NOT p_solo_con_stock OR v.stock > 0)
    )
  ORDER BY p.nombre;
$$;

-- ---------------------------------------------------------------------------
-- Pedidos: crear (lo llama el carrito)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION crear_pedido(p_nombre_cliente TEXT, p_items JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nombre    TEXT  := btrim(coalesce(p_nombre_cliente, ''));
  v_errores   JSONB := '[]'::jsonb;
  v_item      RECORD;
  v_pedido_id INTEGER;
  v_total     NUMERIC(12,2);
BEGIN
  -- 1. Formato de los datos
  IF char_length(v_nombre) NOT BETWEEN 2 AND 60 THEN
    RETURN jsonb_build_object('ok', FALSE, 'errores', '[]'::jsonb,
      'mensaje', 'Escribí tu nombre (entre 2 y 60 caracteres).');
  END IF;

  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RETURN jsonb_build_object('ok', FALSE, 'errores', '[]'::jsonb,
      'mensaje', 'Tu carrito está vacío. Mirá el catálogo y armá tu look.');
  END IF;

  IF jsonb_array_length(p_items) > 20 THEN
    RETURN jsonb_build_object('ok', FALSE, 'errores', '[]'::jsonb,
      'mensaje', 'Tu carrito tiene demasiados productos distintos.');
  END IF;

  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(p_items) e
    WHERE coalesce(e ->> 'varianteId', '') !~ '^[1-9][0-9]{0,8}$'
       OR coalesce(e ->> 'cantidad', '')   !~ '^([1-9]|10)$'
  ) OR (
    SELECT count(DISTINCT e ->> 'varianteId') FROM jsonb_array_elements(p_items) e
  ) <> jsonb_array_length(p_items) THEN
    RETURN jsonb_build_object('ok', FALSE, 'errores', '[]'::jsonb,
      'mensaje', 'Revisá las cantidades de tu carrito: van de 1 a 10 por producto.');
  END IF;

  -- 2 y 3. Cada variante existe, está a la venta y tiene stock
  FOR v_item IN
    SELECT i."varianteId" AS variante_id, i.cantidad, d.stock
    FROM jsonb_to_recordset(p_items) AS i ("varianteId" INTEGER, cantidad INTEGER)
    LEFT JOIN (
      SELECT v.id, v.stock
      FROM variantes v
      JOIN productos p  ON p.id = v.producto_id
      JOIN categorias k ON k.id = p.categoria_id
      WHERE v.activa AND p.activo AND k.activa
    ) d ON d.id = i."varianteId"
  LOOP
    IF v_item.stock IS NULL THEN
      v_errores := v_errores || jsonb_build_object('varianteId', v_item.variante_id,
        'mensaje', 'Uno de los productos ya no está disponible.');
    ELSIF v_item.stock = 0 THEN
      v_errores := v_errores || jsonb_build_object('varianteId', v_item.variante_id,
        'stock', 0, 'mensaje', 'Este talle se agotó. Probá con otro color o talle.');
    ELSIF v_item.cantidad > v_item.stock THEN
      v_errores := v_errores || jsonb_build_object('varianteId', v_item.variante_id,
        'stock', v_item.stock,
        'mensaje', format('Solo quedan %s unidades de este talle.', v_item.stock));
    END IF;
  END LOOP;

  IF jsonb_array_length(v_errores) > 0 THEN
    RETURN jsonb_build_object('ok', FALSE, 'errores', v_errores,
      'mensaje', 'Revisá los productos marcados en tu carrito.');
  END IF;

  -- 4 y 5. Calcular con los precios de la base y guardar
  INSERT INTO pedidos (nombre_cliente, total)
  VALUES (v_nombre, 0)
  RETURNING id INTO v_pedido_id;

  INSERT INTO pedido_detalles
    (pedido_id, variante_id, nombre_producto, talle, color, cantidad, precio_unitario, subtotal)
  SELECT v_pedido_id, v.id, p.nombre, t.nombre, c.nombre,
         i.cantidad, p.precio, i.cantidad * p.precio
  FROM jsonb_to_recordset(p_items) AS i ("varianteId" INTEGER, cantidad INTEGER)
  JOIN variantes v ON v.id = i."varianteId"
  JOIN productos p ON p.id = v.producto_id
  JOIN talles t    ON t.id = v.talle_id
  JOIN colores c   ON c.id = v.color_id;

  SELECT sum(subtotal) INTO v_total
  FROM pedido_detalles
  WHERE pedido_id = v_pedido_id;

  UPDATE pedidos SET total = v_total WHERE id = v_pedido_id;

  RETURN jsonb_build_object(
    'ok', TRUE,
    'codigo', 'US-' || lpad(v_pedido_id::TEXT, 6, '0'),
    'total', v_total,
    'items', (
      SELECT jsonb_agg(jsonb_build_object(
        'nombre', nombre_producto, 'talle', talle, 'color', color,
        'cantidad', cantidad, 'precioUnitario', precio_unitario, 'subtotal', subtotal)
        ORDER BY id)
      FROM pedido_detalles
      WHERE pedido_id = v_pedido_id
    )
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- Consultas: crear (lo llama el formulario de contacto)
-- ---------------------------------------------------------------------------
-- p_trampa es el campo oculto del formulario: si llega completo, el envío es
-- automático y se descarta sin avisar.
CREATE OR REPLACE FUNCTION crear_consulta(
  p_nombre  TEXT,
  p_email   TEXT,
  p_mensaje TEXT,
  p_trampa  TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF coalesce(p_trampa, '') <> '' THEN
    RETURN jsonb_build_object('ok', TRUE);
  END IF;

  INSERT INTO consultas (nombre, email, mensaje)
  VALUES (btrim(p_nombre), btrim(p_email), btrim(p_mensaje));

  RETURN jsonb_build_object('ok', TRUE);
EXCEPTION
  WHEN check_violation OR not_null_violation OR string_data_right_truncation THEN
    RETURN jsonb_build_object('ok', FALSE, 'errores', '[]'::jsonb,
      'mensaje', 'Revisá los datos del formulario.');
END;
$$;

-- ---------------------------------------------------------------------------
-- Pedidos: cambios de estado (los llama el panel)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION confirmar_pedido(p_pedido_id INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT es_admin() THEN
    RETURN jsonb_build_object('ok', FALSE, 'mensaje', 'No autorizado.');
  END IF;

  UPDATE pedidos
  SET estado = 'confirmado', actualizado_en = now()
  WHERE id = p_pedido_id AND estado = 'pendiente';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', FALSE,
      'mensaje', 'Solo se puede confirmar un pedido pendiente.');
  END IF;

  UPDATE variantes v
  SET stock = v.stock - d.cantidad
  FROM pedido_detalles d
  WHERE d.pedido_id = p_pedido_id AND d.variante_id = v.id;

  RETURN jsonb_build_object('ok', TRUE);
EXCEPTION
  -- Si alguna variante quedaría con stock negativo, se deshace todo
  WHEN check_violation THEN
    RETURN jsonb_build_object('ok', FALSE,
      'mensaje', 'No hay stock suficiente para confirmar este pedido.');
END;
$$;

CREATE OR REPLACE FUNCTION entregar_pedido(p_pedido_id INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT es_admin() THEN
    RETURN jsonb_build_object('ok', FALSE, 'mensaje', 'No autorizado.');
  END IF;

  UPDATE pedidos
  SET estado = 'entregado', actualizado_en = now()
  WHERE id = p_pedido_id AND estado = 'confirmado';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', FALSE,
      'mensaje', 'Solo se puede entregar un pedido confirmado.');
  END IF;

  RETURN jsonb_build_object('ok', TRUE);
END;
$$;

CREATE OR REPLACE FUNCTION cancelar_pedido(p_pedido_id INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_estado_anterior VARCHAR(12);
BEGIN
  IF NOT es_admin() THEN
    RETURN jsonb_build_object('ok', FALSE, 'mensaje', 'No autorizado.');
  END IF;

  SELECT estado INTO v_estado_anterior
  FROM pedidos
  WHERE id = p_pedido_id
  FOR UPDATE;

  IF v_estado_anterior IS NULL OR v_estado_anterior NOT IN ('pendiente', 'confirmado') THEN
    RETURN jsonb_build_object('ok', FALSE,
      'mensaje', 'Solo se puede cancelar un pedido pendiente o confirmado.');
  END IF;

  -- Si el stock ya se había descontado, se devuelve
  IF v_estado_anterior = 'confirmado' THEN
    UPDATE variantes v
    SET stock = v.stock + d.cantidad
    FROM pedido_detalles d
    WHERE d.pedido_id = p_pedido_id AND d.variante_id = v.id;
  END IF;

  UPDATE pedidos
  SET estado = 'cancelado', actualizado_en = now()
  WHERE id = p_pedido_id;

  RETURN jsonb_build_object('ok', TRUE);
END;
$$;

-- ---------------------------------------------------------------------------
-- Quién puede llamar a cada función
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION buscar_productos(TEXT, TEXT, TEXT[], TEXT[], BOOLEAN) FROM PUBLIC;
REVOKE ALL ON FUNCTION crear_pedido(TEXT, JSONB)                            FROM PUBLIC;
REVOKE ALL ON FUNCTION crear_consulta(TEXT, TEXT, TEXT, TEXT)               FROM PUBLIC;
REVOKE ALL ON FUNCTION confirmar_pedido(INTEGER)                            FROM PUBLIC;
REVOKE ALL ON FUNCTION entregar_pedido(INTEGER)                             FROM PUBLIC;
REVOKE ALL ON FUNCTION cancelar_pedido(INTEGER)                             FROM PUBLIC;

GRANT EXECUTE ON FUNCTION buscar_productos(TEXT, TEXT, TEXT[], TEXT[], BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION crear_pedido(TEXT, JSONB)                            TO anon, authenticated;
GRANT EXECUTE ON FUNCTION crear_consulta(TEXT, TEXT, TEXT, TEXT)               TO anon, authenticated;
GRANT EXECUTE ON FUNCTION confirmar_pedido(INTEGER)                            TO authenticated;
GRANT EXECUTE ON FUNCTION entregar_pedido(INTEGER)                             TO authenticated;
GRANT EXECUTE ON FUNCTION cancelar_pedido(INTEGER)                             TO authenticated;
```

## Datos de demostración

> **Datos ficticios.** Los productos de esta sección son ejemplos para probar
> el sitio, y cada uno lo dice en su descripción («Producto de demostración»).
> Sus precios son **de ejemplo**, no precios reales del negocio: sirven para
> probar subtotales, totales y el mensaje de WhatsApp. Se reemplazan cuando el
> negocio defina su catálogo.

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

-- Precios de ejemplo: no son precios reales del negocio.
INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio, destacado) VALUES
  (1, 'Remera Demo Oversize', 'remera-demo-oversize',
      'Producto de demostración. Remera de algodón de corte holgado.', 10000, TRUE),
  (2, 'Buzo Demo Canguro',    'buzo-demo-canguro',
      'Producto de demostración. Buzo con capucha y bolsillo delantero.', 20000, TRUE),
  (3, 'Pantalón Demo Cargo',  'pantalon-demo-cargo',
      'Producto de demostración. Pantalón con bolsillos laterales.', 15000, FALSE);

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

Los administradores no forman parte de los datos de demostración: se crean a
mano (ver [10-SEGURIDAD.md](10-SEGURIDAD.md)).

## Supabase decide el total y la disponibilidad

El navegador se puede manipular: cualquier persona puede cambiar lo que envía.
Por eso **no se confía** en precios, totales ni stock que lleguen desde el
carrito. Quien decide es la función `crear_pedido`, que corre en Supabase.

Lo único que recibe es esto:

```javascript
// js/lib/pedidos.js
const { data, error } = await supabase.rpc("crear_pedido", {
  p_nombre_cliente: "Nombre de ejemplo",
  p_items: [
    { varianteId: 1, cantidad: 2 },
    { varianteId: 4, cantidad: 1 },
  ],
});
```

Reglas que aplica la función:

1. Si una variante no existe o no está a la venta (variante, producto o
   categoría inactivos), el pedido se rechaza.
2. Si `cantidad` es mayor que `stock`, el pedido se rechaza y se informa
   cuántas unidades quedan.
3. `subtotal = cantidad × precio` y `total = suma de subtotales`, siempre con
   el precio leído de la base.
4. Si el navegador envía campos de más (por ejemplo `precio` o `total`), se
   ignoran: la función solo lee `varianteId` y `cantidad`.
5. El pedido y sus detalles se guardan en la misma llamada: si algo falla, no
   se guarda nada.

El mensaje de WhatsApp se arma con lo que devuelve la función (código, ítems y
total), no con lo que calculó el navegador.

### Descuento de stock al confirmar

Cuando el administrador confirma el pedido, `confirmar_pedido` cambia el
estado y descuenta el stock en la misma llamada. Si alguna variante quedara
con stock negativo, la restricción `CHECK (stock >= 0)` hace fallar la
operación, se deshace todo y el pedido sigue `pendiente`. La base de datos es
la última barrera: aunque el código tuviera un error, el stock nunca puede
quedar por debajo de cero.

Si un pedido `confirmado` se cancela, `cancelar_pedido` devuelve las unidades
al stock.

| Estado actual | Puede pasar a | Función | Efecto en el stock |
| --- | --- | --- | --- |
| `pendiente` | `confirmado` | `confirmar_pedido` | Se descuenta |
| `pendiente` | `cancelado` | `cancelar_pedido` | Ninguno |
| `confirmado` | `entregado` | `entregar_pedido` | Ninguno |
| `confirmado` | `cancelado` | `cancelar_pedido` | Se devuelve |

## Datos personales

Se guarda lo mínimo: el nombre que escribe el cliente en el pedido, y el
nombre, el correo y el mensaje de las consultas. No se guardan teléfonos,
direcciones ni datos de pago. El correo y la contraseña de los
administradores los guarda Supabase Auth. El detalle está en
[10-SEGURIDAD.md](10-SEGURIDAD.md).
