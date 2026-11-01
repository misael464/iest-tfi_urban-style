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
