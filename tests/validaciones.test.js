// tests/validaciones.test.js
import { describe, it, expect } from "vitest";

import {
  esCantidadValida,
  esNombreValido,
  obtenerCantidadMaxima,
} from "../js/lib/validaciones.js";

describe("esCantidadValida", () => {
  it("acepta cantidades enteras de 1 a 10", () => {
    expect(esCantidadValida(1)).toBe(true);
    expect(esCantidadValida(10)).toBe(true);
  });

  it("rechaza cero, negativos, decimales y más de 10", () => {
    expect(esCantidadValida(0)).toBe(false);
    expect(esCantidadValida(-1)).toBe(false);
    expect(esCantidadValida(1.5)).toBe(false);
    expect(esCantidadValida(11)).toBe(false);
  });

  it("rechaza lo que no es un número", () => {
    expect(esCantidadValida("2")).toBe(false);
    expect(esCantidadValida(Number.NaN)).toBe(false);
  });

  it("respeta un máximo menor, como el stock", () => {
    expect(esCantidadValida(3, 3)).toBe(true);
    expect(esCantidadValida(4, 3)).toBe(false);
  });
});

describe("esNombreValido", () => {
  it("acepta nombres de 2 a 60 caracteres", () => {
    expect(esNombreValido("Al")).toBe(true);
    expect(esNombreValido("A".repeat(60))).toBe(true);
  });

  it("rechaza nombres de menos de 2 o más de 60 caracteres", () => {
    expect(esNombreValido("")).toBe(false);
    expect(esNombreValido("A")).toBe(false);
    expect(esNombreValido("A".repeat(61))).toBe(false);
  });

  it("no cuenta los espacios de los costados", () => {
    expect(esNombreValido("  A  ")).toBe(false);
    expect(esNombreValido("  Ana  ")).toBe(true);
  });

  it("rechaza lo que no es texto", () => {
    expect(esNombreValido(null)).toBe(false);
    expect(esNombreValido(42)).toBe(false);
  });
});

describe("obtenerCantidadMaxima", () => {
  it("es el stock si es 10 o menos", () => {
    expect(obtenerCantidadMaxima(2)).toBe(2);
    expect(obtenerCantidadMaxima(10)).toBe(10);
  });

  it("tiene un tope de 10", () => {
    expect(obtenerCantidadMaxima(25)).toBe(10);
  });

  it("sin stock es 0", () => {
    expect(obtenerCantidadMaxima(0)).toBe(0);
    expect(obtenerCantidadMaxima(-2)).toBe(0);
  });
});
