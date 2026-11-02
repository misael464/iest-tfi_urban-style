// js/paginas/carrito.js
import {
  calcularTotal,
  cambiarCantidad,
  guardarCarrito,
  leerCarrito,
  quitarDelCarrito,
} from "../lib/carrito.js";
import { obtenerVariantesDelCarrito } from "../lib/productos.js";
import { actualizarContadorCarrito, iniciarEncabezado } from "../componentes/encabezado.js";
import { crearItemCarrito } from "../componentes/itemCarrito.js";
import { crearMensaje, TEXTO_ERROR_GENERICO } from "../componentes/mensaje.js";
import { crearResumenCarrito } from "../componentes/resumenCarrito.js";

const titulo = document.getElementById("titulo-carrito");
const avisos = document.getElementById("avisos-carrito");
const contenido = document.getElementById("carrito-contenido");
const lista = document.getElementById("items-carrito");
const resumen = document.getElementById("resumen-carrito");
const vacio = document.getElementById("carrito-vacio");

let carrito = leerCarrito();
// Datos actuales de cada variante, leídos de la base (CA23).
let datosPorVariante = new Map();

iniciarEncabezado();
cargarCarrito();

async function cargarCarrito() {
  if (carrito.length === 0) {
    mostrarVacio();
    return;
  }

  try {
    const variantes = await obtenerVariantesDelCarrito(carrito.map((item) => item.varianteId));
    datosPorVariante = new Map(variantes.map((variante) => [variante.varianteId, variante]));
    mostrarCarrito();
  } catch {
    avisos.replaceChildren(crearMensaje("error", TEXTO_ERROR_GENERICO));
  }
}

// Une lo guardado (variante y cantidad) con los datos actuales de la base.
function armarItems() {
  return carrito.map((item) => {
    const datos = datosPorVariante.get(item.varianteId);
    return datos
      ? { ...datos, cantidad: item.cantidad, estaDisponible: true }
      : { varianteId: item.varianteId, cantidad: item.cantidad, estaDisponible: false };
  });
}

function mostrarCarrito() {
  if (carrito.length === 0) {
    mostrarVacio();
    return;
  }

  const items = armarItems();
  lista.replaceChildren(
    ...items.map((item) => crearItemCarrito(item, { alCambiarCantidad, alQuitar }))
  );
  mostrarResumen(items);
  vacio.hidden = true;
  contenido.hidden = false;
}

function mostrarResumen(items) {
  resumen.replaceChildren(crearResumenCarrito(calcularTotal(items)));
}

// Cada cambio se guarda y actualiza el total sin recargar (CA24, CA32).
function alCambiarCantidad(varianteId, cantidad) {
  carrito = cambiarCantidad(carrito, varianteId, cantidad);
  guardarCarrito(carrito);
  actualizarContadorCarrito();
  mostrarResumen(armarItems());
}

function alQuitar(varianteId) {
  carrito = quitarDelCarrito(carrito, varianteId);
  guardarCarrito(carrito);
  actualizarContadorCarrito();
  mostrarCarrito();
  // El botón tocado desaparece: el foco vuelve al título de la página.
  titulo.focus();
}

// Saca los ítems y el resumen, y muestra el carrito vacío (CA25, CA28).
function mostrarVacio() {
  lista.replaceChildren();
  resumen.replaceChildren();
  contenido.hidden = true;
  vacio.hidden = false;
}
