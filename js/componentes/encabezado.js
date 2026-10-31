// js/componentes/encabezado.js
// Agrega comportamiento al encabezado escrito en el HTML: el menú del
// celular y la marca de la página actual. El contador del carrito se
// conecta en la Etapa 6.

const SUFIJO_INICIO = "index.html";

export function iniciarEncabezado() {
  iniciarMenu();
  marcarPaginaActual();
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
