// js/componentes/mensaje.js
// Arma un mensaje de confirmación, error o información (06-DISENO-UI.md).
// El tipo se reconoce por el ícono y el texto, nunca solo por el color.

const TIPOS_DE_MENSAJE = {
  confirmacion: { icono: "✓", rol: "status" },
  error: { icono: "!", rol: "alert" },
  informacion: { icono: "i", rol: "status" },
};

const PREFIJO_ERROR = "Error:";

// Texto para cualquier error inesperado (10-SEGURIDAD.md).
export const TEXTO_ERROR_GENERICO = "Algo salió mal. Probá de nuevo en un momento.";

export function crearMensaje(tipo, texto) {
  const configuracion = TIPOS_DE_MENSAJE[tipo];
  if (!configuracion) {
    throw new Error(`Tipo de mensaje desconocido: ${tipo}`);
  }

  const mensaje = document.createElement("div");
  mensaje.className = `mensaje mensaje-${tipo}`;
  mensaje.setAttribute("role", configuracion.rol);

  // El ícono es decorativo: el lector de pantalla lee solo el texto.
  const icono = document.createElement("span");
  icono.className = "mensaje-icono";
  icono.setAttribute("aria-hidden", "true");
  icono.textContent = configuracion.icono;

  const parrafo = document.createElement("p");
  parrafo.className = "mensaje-texto";
  parrafo.textContent = tipo === "error" ? agregarPrefijoError(texto) : texto;

  mensaje.append(icono, parrafo);
  return mensaje;
}

// Si el texto ya empieza con "Error:", no se repite.
function agregarPrefijoError(texto) {
  return texto.startsWith(PREFIJO_ERROR) ? texto : `${PREFIJO_ERROR} ${texto}`;
}
