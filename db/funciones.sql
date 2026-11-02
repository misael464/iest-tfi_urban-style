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
        'mensaje', CASE
          WHEN v_item.stock = 1 THEN 'Solo queda 1 unidad de este talle.'
          ELSE format('Solo quedan %s unidades de este talle.', v_item.stock)
        END);
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

-- Supabase les da EXECUTE a anon de forma explícita en cada función nueva:
-- el REVOKE FROM PUBLIC no alcanza para sacárselo en las funciones del panel.
REVOKE EXECUTE ON FUNCTION confirmar_pedido(INTEGER) FROM anon;
REVOKE EXECUTE ON FUNCTION entregar_pedido(INTEGER)  FROM anon;
REVOKE EXECUTE ON FUNCTION cancelar_pedido(INTEGER)  FROM anon;

GRANT EXECUTE ON FUNCTION buscar_productos(TEXT, TEXT, TEXT[], TEXT[], BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION crear_pedido(TEXT, JSONB)                            TO anon, authenticated;
GRANT EXECUTE ON FUNCTION crear_consulta(TEXT, TEXT, TEXT, TEXT)               TO anon, authenticated;
GRANT EXECUTE ON FUNCTION confirmar_pedido(INTEGER)                            TO authenticated;
GRANT EXECUTE ON FUNCTION entregar_pedido(INTEGER)                             TO authenticated;
GRANT EXECUTE ON FUNCTION cancelar_pedido(INTEGER)                             TO authenticated;
