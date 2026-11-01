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
