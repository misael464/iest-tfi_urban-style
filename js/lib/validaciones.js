// js/lib/validaciones.js
// Reglas de los formularios. No importa Supabase ni toca el DOM (P6).

export const CANTIDAD_MINIMA = 1;
export const CANTIDAD_MAXIMA = 10;

// Devuelve true si la cantidad es un entero entre 1 y el máximo (por defecto, 10).
export function esCantidadValida(cantidad, maximo = CANTIDAD_MAXIMA) {
  return (
    Number.isInteger(cantidad) &&
    cantidad >= CANTIDAD_MINIMA &&
    cantidad <= maximo
  );
}

// El máximo que se puede pedir de una variante: su stock, con un tope de 10 (RF08).
export function obtenerCantidadMaxima(stock) {
  return Math.max(0, Math.min(stock, CANTIDAD_MAXIMA));
}
