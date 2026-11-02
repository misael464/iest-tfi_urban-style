// tests/filtros.test.js
import { describe, it, expect } from "vitest";

import { armarParametros, crearFiltrosVacios, leerFiltros } from "../js/lib/filtros.js";

describe("leerFiltros", () => {
  it("lee la búsqueda y todos los filtros de la dirección", () => {
    const parametros = new URLSearchParams(
      "buscar=buzo&categoria=remeras&talle=M&talle=L&color=Negro&disponible=1"
    );

    expect(leerFiltros(parametros)).toEqual({
      buscar: "buzo",
      categoria: "remeras",
      talles: ["M", "L"],
      colores: ["negro"],
      soloConStock: true,
    });
  });

  it("sin parámetros devuelve los filtros vacíos", () => {
    expect(leerFiltros(new URLSearchParams(""))).toEqual(crearFiltrosVacios());
  });

  it("quita los espacios de los costados de la búsqueda", () => {
    expect(leerFiltros(new URLSearchParams("buscar=%20remera%20")).buscar).toBe("remera");
  });
});

describe("armarParametros", () => {
  it("escribe la búsqueda y repite talle y color si hay varios", () => {
    const parametros = armarParametros({
      buscar: "buzo",
      categoria: "remeras",
      talles: ["M", "L"],
      colores: ["negro", "gris"],
      soloConStock: true,
    });

    expect(parametros.toString()).toBe(
      "buscar=buzo&categoria=remeras&talle=M&talle=L&color=negro&color=gris&disponible=1"
    );
  });

  it("con los filtros vacíos deja la dirección sin parámetros", () => {
    expect(armarParametros(crearFiltrosVacios()).toString()).toBe("");
  });

  it("lo que escribe se vuelve a leer igual", () => {
    const filtros = {
      buscar: "pantalón",
      categoria: "pantalones",
      talles: ["L"],
      colores: ["negro"],
      soloConStock: false,
    };

    expect(leerFiltros(armarParametros(filtros))).toEqual(filtros);
  });
});
