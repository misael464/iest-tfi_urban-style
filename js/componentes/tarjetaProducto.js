// js/componentes/tarjetaProducto.js
import { formatearPrecio } from "../lib/formato.js";
import { crearEtiquetaDisponibilidad } from "./etiquetaDisponibilidad.js";

const ANCHO_FOTO = 400;
const ALTO_FOTO = 500;

function crearSinFoto() {
  const sinFoto = document.createElement("div");
  sinFoto.className = "tarjeta-producto-sin-foto";
  sinFoto.textContent = "Sin foto";
  return sinFoto;
}

// Si el producto no tiene foto, o la foto no carga, se muestra el recuadro
// "Sin foto" (CA28).
function crearFoto(producto) {
  if (!producto.imagen) {
    return crearSinFoto();
  }

  const imagen = document.createElement("img");
  imagen.className = "tarjeta-producto-imagen";
  imagen.src = producto.imagen;
  imagen.alt = producto.textoAlternativo;
  imagen.width = ANCHO_FOTO;
  imagen.height = ALTO_FOTO;
  imagen.loading = "lazy";
  imagen.addEventListener("error", () => imagen.replaceWith(crearSinFoto()), { once: true });
  return imagen;
}

export function crearTarjetaProducto(producto) {
  const tarjeta = document.createElement("a");
  tarjeta.className = "tarjeta-producto";
  if (producto.stockTotal <= 0) {
    tarjeta.classList.add("tarjeta-producto-agotada");
  }
  tarjeta.href = `/producto.html?slug=${encodeURIComponent(producto.slug)}`;

  const marco = document.createElement("div");
  marco.className = "tarjeta-producto-marco";
  marco.append(crearFoto(producto), crearEtiquetaDisponibilidad(producto.stockTotal));

  const nombre = document.createElement("h3");
  nombre.className = "tarjeta-producto-nombre";
  nombre.textContent = producto.nombre;

  const precio = document.createElement("p");
  precio.className = "tarjeta-producto-precio";
  precio.textContent = formatearPrecio(producto.precio);

  tarjeta.append(marco, nombre, precio);
  return tarjeta;
}
