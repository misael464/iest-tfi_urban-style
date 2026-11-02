// js/paginas/carrito.js
import { sitio } from "../config/sitio.js";
import {
  calcularTotal,
  cambiarCantidad,
  guardarCarrito,
  leerCarrito,
  quitarDelCarrito,
} from "../lib/carrito.js";
import { enviarPedido } from "../lib/pedidos.js";
import { obtenerVariantesDelCarrito } from "../lib/productos.js";
import { esNombreValido } from "../lib/validaciones.js";
import { armarEnlaceWhatsapp, armarMensajePedido } from "../lib/whatsapp.js";
import { actualizarContadorCarrito, iniciarEncabezado } from "../componentes/encabezado.js";
import { crearItemCarrito } from "../componentes/itemCarrito.js";
import { crearMensaje, TEXTO_ERROR_GENERICO } from "../componentes/mensaje.js";
import { crearResumenCarrito } from "../componentes/resumenCarrito.js";

const TEXTO_ERROR_NOMBRE = "Escribí tu nombre (entre 2 y 60 caracteres).";
const TEXTO_ENVIANDO = "Enviando…";

const titulo = document.getElementById("titulo-carrito");
const avisos = document.getElementById("avisos-carrito");
const contenido = document.getElementById("carrito-contenido");
const lista = document.getElementById("items-carrito");
const resumen = document.getElementById("resumen-carrito");
const vacio = document.getElementById("carrito-vacio");
const formulario = document.getElementById("formulario-pedido");
const campoNombre = document.getElementById("campo-nombre");
const errorNombre = document.getElementById("error-nombre");
const botonEnviar = document.getElementById("boton-enviar");
const textoBotonEnviar = botonEnviar.textContent.trim();
const confirmado = document.getElementById("pedido-confirmado");
const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");
const enlaceWhatsapp = document.getElementById("enlace-whatsapp");

let carrito = leerCarrito();
// Datos actuales de cada variante, leídos de la base (CA23).
let datosPorVariante = new Map();

iniciarEncabezado();
formulario.addEventListener("submit", alEnviarPedido);
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

// ---------------------------------------------------------------------------
// Pedido por WhatsApp (specs/003-pedido-whatsapp)
// ---------------------------------------------------------------------------

async function alEnviarPedido(evento) {
  evento.preventDefault();
  const nombre = campoNombre.value.trim();

  // Se valida en el navegador para avisar rápido; crear_pedido valida igual (CA02).
  if (!esNombreValido(nombre)) {
    mostrarErrorNombre();
    return;
  }
  limpiarErrorNombre();
  avisos.replaceChildren();
  ponerEnviando(true);

  try {
    const respuesta = await enviarPedido(nombre, carrito);
    if (respuesta.ok) {
      mostrarPedidoConfirmado(respuesta, nombre);
    } else {
      mostrarErroresDelPedido(respuesta);
    }
  } catch {
    // Error inesperado: texto genérico y el carrito queda como estaba (CA10).
    avisos.replaceChildren(crearMensaje("error", TEXTO_ERROR_GENERICO));
  } finally {
    ponerEnviando(false);
  }
}

// "Enviando…" y deshabilitado, para evitar envíos dobles (CA03).
function ponerEnviando(estaEnviando) {
  botonEnviar.disabled = estaEnviando;
  botonEnviar.textContent = estaEnviando ? TEXTO_ENVIANDO : textoBotonEnviar;
}

function mostrarErrorNombre() {
  campoNombre.setAttribute("aria-invalid", "true");
  errorNombre.replaceChildren(crearMensaje("error", TEXTO_ERROR_NOMBRE));
  campoNombre.focus();
}

function limpiarErrorNombre() {
  campoNombre.removeAttribute("aria-invalid");
  errorNombre.replaceChildren();
}

// El mensaje general arriba y, junto a cada ítem con problema, su aviso (CA07, CA09).
function mostrarErroresDelPedido(respuesta) {
  avisos.replaceChildren(crearMensaje("error", respuesta.mensaje));

  (respuesta.errores ?? []).forEach((error) => {
    const contenedor = lista.querySelector(
      `[data-variante-id="${error.varianteId}"] [data-avisos]`
    );
    if (contenedor) {
      contenedor.replaceChildren(crearMensaje("error", error.mensaje));
    }
  });
}

// Pedido registrado: carrito vacío, contador en 0, confirmación con el código
// y el botón "Abrir WhatsApp" (CA13, CA14). WhatsApp no se abre solo porque
// los navegadores bloquean las ventanas emergentes.
function mostrarPedidoConfirmado(pedido, nombre) {
  carrito = [];
  guardarCarrito(carrito);
  actualizarContadorCarrito();

  lista.replaceChildren();
  resumen.replaceChildren();
  contenido.hidden = true;

  mensajeConfirmacion.replaceChildren(
    crearMensaje(
      "confirmacion",
      `¡Listo! Tu pedido ${pedido.codigo} está armado. Envialo por WhatsApp para confirmarlo.`
    )
  );
  enlaceWhatsapp.href = armarEnlaceWhatsapp(sitio.whatsappNumero, armarMensajePedido(pedido, nombre));
  confirmado.hidden = false;
  enlaceWhatsapp.focus();
}

// Saca los ítems y el resumen, y muestra el carrito vacío (CA25, CA28).
function mostrarVacio() {
  lista.replaceChildren();
  resumen.replaceChildren();
  contenido.hidden = true;
  vacio.hidden = false;
}
