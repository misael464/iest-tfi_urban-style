// js/componentes/estadoVacio.js
// Texto y botón para cuando no hay nada que mostrar (06-DISENO-UI.md).

export function crearEstadoVacio({ texto, textoBoton, alTocar }) {
  const estado = document.createElement("div");
  estado.className = "estado-vacio";

  const titulo = document.createElement("p");
  titulo.className = "estado-vacio-titulo";
  titulo.textContent = texto;

  const boton = document.createElement("button");
  boton.className = "boton boton-secundario";
  boton.type = "button";
  boton.textContent = textoBoton;
  boton.addEventListener("click", alTocar);

  estado.append(titulo, boton);
  return estado;
}
