// js/componentes/resumenCarrito.js
// Subtotal y total del pedido; el total va en 24 px (CA31, CA33).
import { formatearPrecio } from "../lib/formato.js";

function crearFila(texto, importe, clase) {
  const fila = document.createElement("p");
  fila.className = `resumen-carrito-fila ${clase}`;

  const etiqueta = document.createElement("span");
  etiqueta.textContent = texto;

  const valor = document.createElement("span");
  valor.textContent = formatearPrecio(importe);

  fila.append(etiqueta, valor);
  return fila;
}

// Sin envío ni descuentos, el subtotal y el total son iguales.
export function crearResumenCarrito(total) {
  const resumen = document.createElement("div");
  resumen.className = "resumen-carrito";
  resumen.append(
    crearFila("Subtotal", total, "resumen-carrito-subtotal"),
    crearFila("Total", total, "resumen-carrito-total")
  );
  return resumen;
}
