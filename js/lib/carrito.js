// js/lib/carrito.js
// El carrito es una lista [{ varianteId, cantidad }]: nunca guarda precios (CA20).
// Las funciones de cálculo no tocan localStorage ni el DOM (P6).

// Suma la variante al carrito sin pasar del máximo (el stock o 10).
// Devuelve el carrito nuevo y el resultado: "agregado", o "completo" si ya
// tenía todas las unidades disponibles (CA19, CA38).
export function agregarAlCarrito(carrito, varianteId, cantidad, maximo) {
  const existente = carrito.find((item) => item.varianteId === varianteId);

  if (!existente) {
    return {
      carrito: [...carrito, { varianteId, cantidad: Math.min(cantidad, maximo) }],
      resultado: "agregado",
    };
  }

  if (existente.cantidad >= maximo) {
    return { carrito, resultado: "completo" };
  }

  const cantidadNueva = Math.min(existente.cantidad + cantidad, maximo);
  return {
    carrito: cambiarCantidad(carrito, varianteId, cantidadNueva),
    resultado: "agregado",
  };
}

export function cambiarCantidad(carrito, varianteId, cantidad) {
  return carrito.map((item) =>
    item.varianteId === varianteId ? { ...item, cantidad } : item
  );
}

export function quitarDelCarrito(carrito, varianteId) {
  return carrito.filter((item) => item.varianteId !== varianteId);
}

// Se redondea a centavos para evitar errores de los decimales de JS.
export function calcularSubtotal(precio, cantidad) {
  return Math.round(precio * cantidad * 100) / 100;
}

// Suma solo los ítems a la venta (CA31). Cada ítem: { precio, cantidad, estaDisponible }.
export function calcularTotal(items) {
  const total = items
    .filter((item) => item.estaDisponible)
    .reduce((suma, item) => suma + calcularSubtotal(item.precio, item.cantidad), 0);
  return Math.round(total * 100) / 100;
}

// El contador del encabezado muestra unidades, no ítems distintos (CA37).
export function contarUnidades(carrito) {
  return carrito.reduce((suma, item) => suma + item.cantidad, 0);
}

export const CLAVE_CARRITO = "urban-style-carrito";

function esItemValido(item) {
  return (
    Number.isInteger(item?.varianteId) &&
    item.varianteId > 0 &&
    Number.isInteger(item?.cantidad) &&
    item.cantidad > 0
  );
}

// Convierte el texto guardado en un carrito. Si está roto o fue alterado a
// mano, se empieza con el carrito vacío (CA39): por eso no se propaga el error.
export function leerCarritoGuardado(texto) {
  if (!texto) {
    return [];
  }

  let datos;
  try {
    datos = JSON.parse(texto);
  } catch {
    return [];
  }

  if (!Array.isArray(datos) || !datos.every(esItemValido)) {
    return [];
  }
  return datos.map(({ varianteId, cantidad }) => ({ varianteId, cantidad }));
}

// Únicas funciones que usan localStorage (P6).
export function leerCarrito() {
  return leerCarritoGuardado(window.localStorage.getItem(CLAVE_CARRITO));
}

export function guardarCarrito(carrito) {
  window.localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}
