// js/componentes/itemCarrito.js
// Un ítem del carrito con su cantidad, su subtotal, sus avisos y "Quitar" (CA22, CA25 a CA27).
import { calcularSubtotal } from "../lib/carrito.js";
import { formatearPrecio } from "../lib/formato.js";
import { obtenerCantidadMaxima } from "../lib/validaciones.js";
import { crearMensaje } from "./mensaje.js";
import { crearSelectorCantidad } from "./selectorCantidad.js";

const ANCHO_FOTO = 96;
const ALTO_FOTO = 120;

// Mismos textos que devuelve crear_pedido (05-DATOS.md).
const TEXTO_NO_DISPONIBLE = "Uno de los productos ya no está disponible.";
const TEXTO_AGOTADO = "Este talle se agotó. Probá con otro color o talle.";

function textoAvisoStock(stock, cantidad) {
  if (stock <= 0) {
    return TEXTO_AGOTADO;
  }
  if (cantidad > stock) {
    return stock === 1
      ? "Solo queda 1 unidad de este talle."
      : `Solo quedan ${stock} unidades de este talle.`;
  }
  return null;
}

function crearSinFoto() {
  const sinFoto = document.createElement("div");
  sinFoto.className = "item-carrito-sin-foto";
  sinFoto.textContent = "Sin foto";
  return sinFoto;
}

function crearFoto(item) {
  if (!item.imagen) {
    return crearSinFoto();
  }

  const foto = document.createElement("img");
  foto.className = "item-carrito-foto";
  foto.src = item.imagen;
  foto.alt = item.textoAlternativo;
  foto.width = ANCHO_FOTO;
  foto.height = ALTO_FOTO;
  foto.addEventListener("error", () => foto.replaceWith(crearSinFoto()), { once: true });
  return foto;
}

function crearBotonQuitar(alTocar) {
  const boton = document.createElement("button");
  boton.className = "boton boton-texto item-carrito-quitar";
  boton.type = "button";
  boton.textContent = "Quitar";
  boton.addEventListener("click", alTocar);
  return boton;
}

function crearTexto(clase, texto) {
  const parrafo = document.createElement("p");
  parrafo.className = clase;
  parrafo.textContent = texto;
  return parrafo;
}

// item: { varianteId, cantidad, estaDisponible, nombre, slug, precio, stock,
//         imagen, textoAlternativo, talle, color }
export function crearItemCarrito(item, { alCambiarCantidad, alQuitar }) {
  const elemento = document.createElement("li");
  elemento.className = "item-carrito";
  // Con estos atributos, la página pone acá el aviso que devuelve crear_pedido.
  elemento.dataset.varianteId = String(item.varianteId);

  const avisos = document.createElement("div");
  avisos.className = "item-carrito-avisos";
  avisos.dataset.avisos = "";
  const quitar = crearBotonQuitar(() => alQuitar(item.varianteId));

  // La variante ya no está a la venta: no hay datos que mostrar (CA26).
  if (!item.estaDisponible) {
    elemento.classList.add("item-carrito-no-disponible");
    avisos.append(crearMensaje("error", TEXTO_NO_DISPONIBLE));
    elemento.append(avisos, quitar);
    return elemento;
  }

  const nombre = document.createElement("h3");
  nombre.className = "item-carrito-nombre";
  const enlace = document.createElement("a");
  enlace.href = `/producto.html?slug=${encodeURIComponent(item.slug)}`;
  enlace.textContent = item.nombre;
  nombre.append(enlace);

  const subtotal = crearTexto("item-carrito-subtotal", "");

  function mostrarSubtotalYAviso(cantidad) {
    subtotal.textContent = `Subtotal: ${formatearPrecio(calcularSubtotal(item.precio, cantidad))}`;
    const texto = textoAvisoStock(item.stock, cantidad);
    avisos.replaceChildren(...(texto ? [crearMensaje("error", texto)] : []));
  }

  const selector = crearSelectorCantidad({
    cantidad: item.cantidad,
    maximo: obtenerCantidadMaxima(item.stock),
    alCambiar: (cantidad) => {
      mostrarSubtotalYAviso(cantidad);
      alCambiarCantidad(item.varianteId, cantidad);
    },
  });

  const datos = document.createElement("div");
  datos.className = "item-carrito-datos";
  datos.append(
    nombre,
    crearTexto("item-carrito-detalle", `Talle ${item.talle} · Color ${item.color}`),
    crearTexto("item-carrito-detalle", `Precio unitario: ${formatearPrecio(item.precio)}`),
    selector.elemento,
    subtotal,
    avisos,
    quitar
  );

  elemento.append(crearFoto(item), datos);
  mostrarSubtotalYAviso(item.cantidad);
  return elemento;
}
