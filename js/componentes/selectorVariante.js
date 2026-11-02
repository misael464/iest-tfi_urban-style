// js/componentes/selectorVariante.js
// Color y talle del detalle. Las opciones sin stock para lo ya elegido se
// tachan y se deshabilitan (CA10, CA11).

function crearOpcion({ nombre, valor, texto, colorDePrenda }) {
  const etiqueta = document.createElement("label");
  etiqueta.className = "selector-variante-opcion";

  const control = document.createElement("input");
  control.className = "selector-variante-control visualmente-oculto";
  control.type = "radio";
  control.name = nombre;
  control.value = valor;

  const contenido = document.createElement("span");
  contenido.className = "selector-variante-texto";

  // El color del círculo es un dato del catálogo, no de la paleta (P3).
  if (colorDePrenda) {
    const muestra = document.createElement("span");
    muestra.className = "selector-variante-muestra";
    muestra.setAttribute("aria-hidden", "true");
    muestra.style.backgroundColor = colorDePrenda;
    contenido.append(muestra);
  }
  contenido.append(texto);

  etiqueta.append(control, contenido);
  return etiqueta;
}

function crearGrupo(leyenda, opciones) {
  const grupo = document.createElement("fieldset");
  grupo.className = "selector-variante-grupo";

  const titulo = document.createElement("legend");
  titulo.className = "selector-variante-leyenda";
  titulo.textContent = leyenda;

  const lista = document.createElement("div");
  lista.className = "selector-variante-opciones";
  lista.append(...opciones);

  grupo.append(titulo, lista);
  return grupo;
}

// ¿Hay alguna variante con stock para este talle y este color? (null = cualquiera)
function hayStock(variantes, talle, color) {
  return variantes.some(
    (variante) =>
      (talle === null || variante.talle === talle) &&
      (color === null || variante.color === color) &&
      variante.stock > 0
  );
}

function obtenerColores(variantes) {
  const colores = new Map();
  variantes.forEach((variante) => colores.set(variante.color, variante.hex));
  return [...colores]
    .map(([nombre, hex]) => ({ nombre, hex }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

function obtenerTalles(variantes) {
  const talles = new Map();
  variantes.forEach((variante) => talles.set(variante.talle, variante.ordenTalle));
  return [...talles].sort((a, b) => a[1] - b[1]).map(([nombre]) => nombre);
}

// alCambiar recibe { talle, color, variante }; variante es null si la
// combinación elegida no existe o falta elegir algo.
export function crearSelectorVariante(variantes, alCambiar) {
  const colores = obtenerColores(variantes);
  const talles = obtenerTalles(variantes);

  // Sin nada elegido al abrir; con un solo color, ese viene elegido (CA35, CA36).
  const elegido = {
    talle: null,
    color: colores.length === 1 ? colores[0].nombre : null,
  };

  const selector = document.createElement("div");
  selector.className = "selector-variante";
  selector.append(
    crearGrupo(
      "Color",
      colores.map((color) =>
        crearOpcion({ nombre: "color", valor: color.nombre, texto: color.nombre, colorDePrenda: color.hex })
      )
    ),
    crearGrupo(
      "Talle",
      talles.map((talle) => crearOpcion({ nombre: "talle", valor: talle, texto: talle }))
    )
  );

  function obtenerEleccion() {
    const variante =
      variantes.find((v) => v.talle === elegido.talle && v.color === elegido.color) ?? null;
    return { talle: elegido.talle, color: elegido.color, variante };
  }

  function actualizarOpciones() {
    selector.querySelectorAll('input[name="color"]').forEach((control) => {
      control.checked = control.value === elegido.color;
      control.disabled = !hayStock(variantes, elegido.talle, control.value);
    });
    selector.querySelectorAll('input[name="talle"]').forEach((control) => {
      control.checked = control.value === elegido.talle;
      control.disabled = !hayStock(variantes, control.value, elegido.color);
    });
  }

  selector.addEventListener("change", (evento) => {
    elegido[evento.target.name] = evento.target.value;
    actualizarOpciones();
    alCambiar(obtenerEleccion());
  });

  actualizarOpciones();
  return { elemento: selector, obtenerEleccion };
}
