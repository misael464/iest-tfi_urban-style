// js/componentes/etiquetaDisponibilidad.js
// La disponibilidad se comunica con texto, no solo con color (06-DISENO-UI.md).
import { obtenerDisponibilidad } from "../lib/formato.js";

export function crearEtiquetaDisponibilidad(stockTotal) {
  const { estado, texto } = obtenerDisponibilidad(stockTotal);

  const etiqueta = document.createElement("span");
  etiqueta.className = `etiqueta-disponibilidad etiqueta-disponibilidad-${estado}`;
  etiqueta.textContent = texto;
  return etiqueta;
}
