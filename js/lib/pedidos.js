// js/lib/pedidos.js
// Envía el pedido a crear_pedido, que lo valida y calcula el total con los
// precios de la base (05-DATOS.md). El navegador manda solo variantes y
// cantidades: nunca precios ni totales (CA04).
import { supabase } from "./supabase.js";

// Devuelve la respuesta de crear_pedido: { ok, codigo, items, total } si se
// registró, o { ok: false, mensaje, errores } si hay algo que corregir.
// Si la llamada falla, no se propaga el mensaje de Supabase (P4).
export async function enviarPedido(nombreCliente, carrito) {
  const { data, error } = await supabase.rpc("crear_pedido", {
    p_nombre_cliente: nombreCliente,
    p_items: carrito.map(({ varianteId, cantidad }) => ({ varianteId, cantidad })),
  });

  if (error) {
    throw new Error("No se pudo enviar el pedido.");
  }
  return data;
}
