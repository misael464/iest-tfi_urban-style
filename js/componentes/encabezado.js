// js/componentes/encabezado.js
// Agrega comportamiento al encabezado escrito en el HTML: el menú del
// celular, la marca de la página actual y el contador del carrito.
import { contarUnidades, leerCarrito } from "../lib/carrito.js";

const SUFIJO_INICIO = "index.html";

export function iniciarEncabezado() {
  iniciarMenu();
  marcarPaginaActual();
  actualizarContadorCarrito();
  // Si el carrito cambia en otra pestaña, el contador se pone al día.
  window.addEventListener("storage", actualizarContadorCarrito);
}

// El contador muestra el total de unidades guardadas (CA21, CA37).
export function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    contador.textContent = String(contarUnidades(leerCarrito()));
  }
}

function iniciarMenu() {
  const boton = document.querySelector("[data-boton-menu]");
  if (!boton) {
    return;
  }

  // El botón empieza oculto en el HTML: sin JS, los enlaces se ven siempre.
  boton.hidden = false;

  boton.addEventListener("click", () => {
    const esMenuAbierto = boton.getAttribute("aria-expanded") === "true";
    boton.setAttribute("aria-expanded", String(!esMenuAbierto));
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && boton.getAttribute("aria-expanded") === "true") {
      boton.setAttribute("aria-expanded", "false");
      boton.focus();
    }
  });
}

function marcarPaginaActual() {
  const rutaActual = normalizarRuta(window.location.pathname);
  const enlaces = document.querySelectorAll("[data-navegacion] a");

  enlaces.forEach((enlace) => {
    if (normalizarRuta(new URL(enlace.href).pathname) === rutaActual) {
      enlace.setAttribute("aria-current", "page");
    }
  });
}

// "/" y "/index.html" son la misma página.
function normalizarRuta(ruta) {
  return ruta.endsWith(SUFIJO_INICIO) ? ruta.slice(0, -SUFIJO_INICIO.length) : ruta;
}
