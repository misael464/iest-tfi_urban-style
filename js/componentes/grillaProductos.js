// js/componentes/grillaProductos.js
import { crearTarjetaProducto } from "./tarjetaProducto.js";

export function crearGrillaProductos(productos) {
  const lista = document.createElement("ul");
  lista.className = "grilla-productos";

  productos.forEach((producto) => {
    const item = document.createElement("li");
    item.append(crearTarjetaProducto(producto));
    lista.append(item);
  });

  return lista;
}
