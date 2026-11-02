// js/componentes/filtrosCatalogo.js
// Arma los controles de los filtros con los datos de la base y marca los que
// ya vienen elegidos. Cada cambio llama a alCambiar con lo elegido.

function crearOpcion({ tipo, nombre, valor, texto, estaMarcada, colorDePrenda }) {
  const etiqueta = document.createElement("label");
  etiqueta.className = "filtros-catalogo-opcion";

  const control = document.createElement("input");
  control.className = "filtros-catalogo-control visualmente-oculto";
  control.type = tipo;
  control.name = nombre;
  control.value = valor;
  control.checked = estaMarcada;

  const contenido = document.createElement("span");
  contenido.className = "filtros-catalogo-texto";

  // El color del círculo es un dato del catálogo, no de la paleta (P3).
  if (colorDePrenda) {
    const muestra = document.createElement("span");
    muestra.className = "filtros-catalogo-muestra";
    muestra.setAttribute("aria-hidden", "true");
    muestra.style.backgroundColor = colorDePrenda;
    contenido.append(muestra);
  }
  contenido.append(texto);

  etiqueta.append(control, contenido);
  return etiqueta;
}

function crearGrupo(leyenda, opciones, claseGrupo) {
  const grupo = document.createElement("fieldset");
  grupo.className = `filtros-catalogo-grupo ${claseGrupo}`;

  const titulo = document.createElement("legend");
  titulo.className = "filtros-catalogo-leyenda";
  titulo.textContent = leyenda;

  const lista = document.createElement("div");
  lista.className = "filtros-catalogo-opciones";
  lista.append(...opciones);

  grupo.append(titulo, lista);
  return grupo;
}

function crearGrupoCategorias(categorias, categoriaElegida) {
  const opciones = [{ nombre: "Todas", slug: "" }, ...categorias].map((categoria) =>
    crearOpcion({
      tipo: "radio",
      nombre: "categoria",
      valor: categoria.slug,
      texto: categoria.nombre,
      estaMarcada: categoria.slug === categoriaElegida,
    })
  );
  return crearGrupo("Categoría", opciones, "filtros-catalogo-categorias");
}

function crearGrupoTalles(talles, tallesElegidos) {
  const opciones = talles.map((talle) =>
    crearOpcion({
      tipo: "checkbox",
      nombre: "talle",
      valor: talle.nombre,
      texto: talle.nombre,
      estaMarcada: tallesElegidos.includes(talle.nombre),
    })
  );
  return crearGrupo("Talle", opciones, "filtros-catalogo-talles");
}

function crearGrupoColores(colores, coloresElegidos) {
  const opciones = colores.map((color) => {
    const valor = color.nombre.toLowerCase();
    return crearOpcion({
      tipo: "checkbox",
      nombre: "color",
      valor,
      texto: color.nombre,
      estaMarcada: coloresElegidos.includes(valor),
      colorDePrenda: color.hex,
    });
  });
  return crearGrupo("Color", opciones, "filtros-catalogo-colores");
}

function crearGrupoDisponibilidad(esSoloConStock) {
  const opcion = crearOpcion({
    tipo: "checkbox",
    nombre: "disponible",
    valor: "1",
    texto: "Solo con stock",
    estaMarcada: esSoloConStock,
  });
  return crearGrupo("Disponibilidad", [opcion], "filtros-catalogo-disponibilidad");
}

function crearBotonLimpiar(alLimpiar) {
  const boton = document.createElement("button");
  boton.className = "boton boton-secundario";
  boton.type = "button";
  boton.textContent = "Limpiar filtros";
  boton.dataset.botonLimpiar = "";
  boton.addEventListener("click", alLimpiar);
  return boton;
}

function leerFormulario(formulario) {
  const datos = new FormData(formulario);
  return {
    categoria: datos.get("categoria") ?? "",
    talles: datos.getAll("talle"),
    colores: datos.getAll("color"),
    soloConStock: datos.has("disponible"),
  };
}

export function crearFiltrosCatalogo({ categorias, talles, colores }, filtros, { alCambiar, alLimpiar }) {
  const formulario = document.createElement("form");
  formulario.className = "filtros-catalogo-formulario";

  formulario.append(
    crearGrupoCategorias(categorias, filtros.categoria),
    crearGrupoTalles(talles, filtros.talles),
    crearGrupoColores(colores, filtros.colores),
    crearGrupoDisponibilidad(filtros.soloConStock),
    crearBotonLimpiar(alLimpiar)
  );

  formulario.addEventListener("change", () => alCambiar(leerFormulario(formulario)));
  formulario.addEventListener("submit", (evento) => evento.preventDefault());
  return formulario;
}
