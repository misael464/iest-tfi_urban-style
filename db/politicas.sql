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
