// tests/formato.test.js
import { describe, it, expect } from "vitest";

import {
  formatearPrecio,
  obtenerDisponibilidad,
  textoCantidadProductos,
  textoStock,
} from "../js/lib/formato.js";

describe("formatearPrecio", () => {
  it("escribe el signo, un espacio y los miles con punto", () => {
    expect(formatearPrecio(10000)).toBe("$ 10.000");
    expect(formatearPrecio(1500)).toBe("$ 1.500");
    expect(formatearPrecio(1234567)).toBe("$ 1.234.567");
  });

  it("no muestra decimales si son cero", () => {
    expect(formatearPrecio(20000.0)).toBe("$ 20.000");
    expect(formatearPrecio(0)).toBe("$ 0");
    expect(formatearPrecio(999)).toBe("$ 999");
  });

  it("muestra los centavos con coma si los hay", () => {
    expect(formatearPrecio(10000.5)).toBe("$ 10.000,50");
  });

  it("acepta el precio como texto, como puede llegar de la base", () => {
    expect(formatearPrecio("15000.00")).toBe("$ 15.000");
  });

  it("rechaza un valor que no es un número", () => {
    expect(() => formatearPrecio("abc")).toThrow();
  });
});

describe("obtenerDisponibilidad", () => {
  it("con 0 unidades dice Sin stock", () => {
    expect(obtenerDisponibilidad(0)).toEqual({ estado: "agotado", texto: "Sin stock" });
  });

  it("de 1 a 3 unidades dice Últimas unidades", () => {
    expect(obtenerDisponibilidad(1).texto).toBe("Últimas unidades");
    expect(obtenerDisponibilidad(3)).toEqual({ estado: "pocas", texto: "Últimas unidades" });
  });

  it("con 4 o más unidades dice Disponible", () => {
    expect(obtenerDisponibilidad(4)).toEqual({ estado: "disponible", texto: "Disponible" });
    expect(obtenerDisponibilidad(50).texto).toBe("Disponible");
  });
});

describe("textoStock", () => {
  it("con 1 unidad usa el singular", () => {
    expect(textoStock(1)).toBe("Queda 1 unidad");
  });

  it("con más de 1 usa el plural", () => {
    expect(textoStock(2)).toBe("Quedan 2 unidades");
  });

  it("sin stock lo dice", () => {
    expect(textoStock(0)).toBe("Sin stock en esta combinación");
  });
});

describe("textoCantidadProductos", () => {
  it("usa el singular con 1", () => {
    expect(textoCantidadProductos(1)).toBe("1 producto");
  });

  it("usa el plural con 0 y con más de 1", () => {
    expect(textoCantidadProductos(0)).toBe("0 productos");
    expect(textoCantidadProductos(3)).toBe("3 productos");
  });
});
