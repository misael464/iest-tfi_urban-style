// js/lib/filtros.js
// Traduce entre los parámetros de la dirección del catálogo y un objeto de
// filtros. No importa Supabase ni toca el DOM (P6).
//
// /catalogo.html?buscar=buzo&categoria=remeras&talle=M&talle=L&color=negro&disponible=1

export function crearFiltrosVacios() {
  return {
    buscar: "",
    categoria: "",
    talles: [],
    colores: [],
    soloConStock: false,
  };
}

// Recibe un URLSearchParams y devuelve el objeto de filtros.
export function leerFiltros(parametros) {
  return {
    buscar: (parametros.get("buscar") ?? "").trim(),
    categoria: parametros.get("categoria") ?? "",
    talles: parametros.getAll("talle"),
    // buscar_productos compara los colores en minúscula.
    colores: parametros.getAll("color").map((color) => color.toLowerCase()),
    soloConStock: parametros.get("disponible") === "1",
  };
}

// Recibe el objeto de filtros y devuelve los parámetros de la dirección.
// Los filtros vacíos no se escriben, para que la dirección quede corta.
export function armarParametros(filtros) {
  const parametros = new URLSearchParams();

  if (filtros.buscar) {
    parametros.set("buscar", filtros.buscar);
  }
  if (filtros.categoria) {
    parametros.set("categoria", filtros.categoria);
  }
  filtros.talles.forEach((talle) => parametros.append("talle", talle));
  filtros.colores.forEach((color) => parametros.append("color", color));
  if (filtros.soloConStock) {
    parametros.set("disponible", "1");
  }

  return parametros;
}
