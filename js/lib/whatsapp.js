// js/lib/whatsapp.js
// Arma el mensaje del pedido y el enlace de WhatsApp. No importa Supabase ni
// toca el DOM (P6). Usa los datos que devuelve crear_pedido, no los que
// calculó el navegador (04-ARQUITECTURA.md).
import { formatearPrecio } from "./formato.js";

const ENCABEZADO = "Hola, quiero hacer este pedido en Urban Style:";

// "- 2 × Remera Demo Oversize (L, Negro) a $ 10.000: $ 20.000" (CA12)
function armarLinea(item) {
  return (
    `- ${item.cantidad} × ${item.nombre} (${item.talle}, ${item.color}) ` +
    `a ${formatearPrecio(item.precioUnitario)}: ${formatearPrecio(item.subtotal)}`
  );
}

// pedido: { codigo, items: [{ nombre, talle, color, cantidad, precioUnitario, subtotal }], total }
export function armarMensajePedido(pedido, nombreCliente) {
  return [
    ENCABEZADO,
    `Pedido ${pedido.codigo}`,
    ...pedido.items.map(armarLinea),
    `Total: ${formatearPrecio(pedido.total)}`,
    `Nombre: ${nombreCliente.trim()}`,
  ].join("\n");
}

// El texto se codifica para que tildes, saltos de línea y símbolos lleguen bien (CA13).
export function armarEnlaceWhatsapp(numero, mensaje) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
