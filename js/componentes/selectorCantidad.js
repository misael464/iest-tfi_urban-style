// js/componentes/selectorCantidad.js
// "−", campo y "+". La cantidad va de 1 al máximo (el stock o 10) (CA14 a CA17).
import { CANTIDAD_MINIMA, esCantidadValida } from "../lib/validaciones.js";

// Cada selector necesita un id propio para unir la etiqueta con el campo.
let siguienteId = 1;

// Solo dígitos: así "1.5", "-2" o "abc" no pasan.
const SOLO_DIGITOS = /^\d+$/;

function crearBoton(texto, etiquetaAccesible) {
  const boton = document.createElement("button");
  boton.className = "boton boton-secundario selector-cantidad-boton";
  boton.type = "button";
  boton.textContent = texto;
  boton.setAttribute("aria-label", etiquetaAccesible);
  return boton;
}

export function crearSelectorCantidad({ cantidad, maximo, alCambiar }) {
  const idCampo = `cantidad-${siguienteId}`;
  siguienteId += 1;
  let cantidadActual = cantidad;

  const selector = document.createElement("div");
  selector.className = "selector-cantidad";

  const etiqueta = document.createElement("label");
  etiqueta.className = "formulario-etiqueta";
  etiqueta.htmlFor = idCampo;
  etiqueta.textContent = "Cantidad";

  const menos = crearBoton("−", "Restar una unidad");
  const mas = crearBoton("+", "Sumar una unidad");

  const campo = document.createElement("input");
  campo.className = "formulario-campo selector-cantidad-campo";
  campo.id = idCampo;
  campo.type = "text";
  campo.inputMode = "numeric";
  campo.autocomplete = "off";

  function mostrar() {
    campo.value = String(cantidadActual);
    menos.disabled = cantidadActual <= CANTIDAD_MINIMA;
    mas.disabled = cantidadActual >= maximo;
  }

  function cambiarA(cantidadNueva) {
    cantidadActual = cantidadNueva;
    mostrar();
    if (alCambiar) {
      alCambiar(cantidadActual);
    }
  }

  menos.addEventListener("click", () => cambiarA(cantidadActual - 1));
  mas.addEventListener("click", () => cambiarA(cantidadActual + 1));

  // Un valor inválido vuelve a la última cantidad válida (CA17).
  campo.addEventListener("change", () => {
    const texto = campo.value.trim();
    const numero = Number(texto);
    if (SOLO_DIGITOS.test(texto) && esCantidadValida(numero, maximo)) {
      cambiarA(numero);
    } else {
      mostrar();
    }
  });

  const fila = document.createElement("div");
  fila.className = "selector-cantidad-fila";
  fila.append(menos, campo, mas);
  selector.append(etiqueta, fila);

  mostrar();
  return { elemento: selector, obtenerCantidad: () => cantidadActual };
}
