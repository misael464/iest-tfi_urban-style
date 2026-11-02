// js/lib/formato.js
// Formatos de la interfaz. No importa Supabase ni toca el DOM (P6).

// Separa los miles con punto: 10000 → "10.000".
function separarMiles(entero) {
  return entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// "$ 10.000"; si hay centavos, "$ 10.000,50".
export function formatearPrecio(precio) {
  const numero = Number(precio);
  if (!Number.isFinite(numero)) {
    throw new Error(`Precio inválido: ${precio}`);
  }

  const [entero, decimales] = numero.toFixed(2).split(".");
  const conMiles = separarMiles(entero);
  return decimales === "00" ? `$ ${conMiles}` : `$ ${conMiles},${decimales}`;
}

// Regla de 05-DATOS.md: 0 sin stock, de 1 a 3 últimas unidades, 4 o más disponible.
export const STOCK_ULTIMAS_UNIDADES = 3;

// Devuelve el estado (para el estilo) y el texto de la etiqueta de disponibilidad.
export function obtenerDisponibilidad(stockTotal) {
  if (stockTotal <= 0) {
    return { estado: "agotado", texto: "Sin stock" };
  }
  if (stockTotal <= STOCK_ULTIMAS_UNIDADES) {
    return { estado: "pocas", texto: "Últimas unidades" };
  }
  return { estado: "disponible", texto: "Disponible" };
}

// Stock de la combinación elegida en el detalle (CA12).
export function textoStock(stock) {
  if (stock <= 0) {
    return "Sin stock en esta combinación";
  }
  return stock === 1 ? "Queda 1 unidad" : `Quedan ${stock} unidades`;
}

// "1 producto" o "N productos".
export function textoCantidadProductos(cantidad) {
  return cantidad === 1 ? "1 producto" : `${cantidad} productos`;
}
