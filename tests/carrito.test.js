// tests/carrito.test.js
import { describe, it, expect } from "vitest";

import {
  agregarAlCarrito,
  calcularSubtotal,
  calcularTotal,
  cambiarCantidad,
  contarUnidades,
  leerCarritoGuardado,
  quitarDelCarrito,
} from "../js/lib/carrito.js";

describe("agregarAlCarrito", () => {
  it("suma una variante nueva con su cantidad", () => {
    const { carrito, resultado } = agregarAlCarrito([], 1, 2, 5);
    expect(carrito).toEqual([{ varianteId: 1, cantidad: 2 }]);
    expect(resultado).toBe("agregado");
  });

  it("suma la cantidad si la variante ya estaba", () => {
    const { carrito } = agregarAlCarrito([{ varianteId: 1, cantidad: 2 }], 1, 1, 5);
    expect(carrito).toEqual([{ varianteId: 1, cantidad: 3 }]);
  });

  it("no pasa del máximo al sumar", () => {
    const { carrito, resultado } = agregarAlCarrito([{ varianteId: 1, cantidad: 4 }], 1, 3, 5);
    expect(carrito).toEqual([{ varianteId: 1, cantidad: 5 }]);
    expect(resultado).toBe("agregado");
  });

  it("si ya tenía el máximo, no suma y avisa que está completo", () => {
    const carritoInicial = [{ varianteId: 1, cantidad: 5 }];
    const { carrito, resultado } = agregarAlCarrito(carritoInicial, 1, 1, 5);
    expect(carrito).toEqual(carritoInicial);
    expect(resultado).toBe("completo");
  });

  it("no cambia el carrito que recibe", () => {
    const carritoInicial = [{ varianteId: 1, cantidad: 2 }];
    agregarAlCarrito(carritoInicial, 1, 1, 5);
    expect(carritoInicial).toEqual([{ varianteId: 1, cantidad: 2 }]);
  });
});

describe("cambiarCantidad y quitarDelCarrito", () => {
  const carrito = [
    { varianteId: 1, cantidad: 2 },
    { varianteId: 4, cantidad: 1 },
  ];

  it("cambia solo la cantidad de la variante indicada", () => {
    expect(cambiarCantidad(carrito, 4, 3)).toEqual([
      { varianteId: 1, cantidad: 2 },
      { varianteId: 4, cantidad: 3 },
    ]);
  });

  it("quita solo la variante indicada", () => {
    expect(quitarDelCarrito(carrito, 1)).toEqual([{ varianteId: 4, cantidad: 1 }]);
  });
});

describe("calcularSubtotal y calcularTotal", () => {
  it("el subtotal es precio por cantidad", () => {
    expect(calcularSubtotal(10000, 2)).toBe(20000);
    expect(calcularSubtotal(0.1, 3)).toBe(0.3);
  });

  it("el total suma los subtotales de los ítems a la venta", () => {
    const items = [
      { precio: 10000, cantidad: 2, estaDisponible: true },
      { precio: 20000, cantidad: 1, estaDisponible: true },
      { precio: 15000, cantidad: 1, estaDisponible: false },
    ];
    expect(calcularTotal(items)).toBe(40000);
  });

  it("sin ítems, el total es 0", () => {
    expect(calcularTotal([])).toBe(0);
  });
});

describe("contarUnidades", () => {
  it("suma las unidades, no los ítems distintos", () => {
    expect(
      contarUnidades([
        { varianteId: 1, cantidad: 2 },
        { varianteId: 4, cantidad: 1 },
      ])
    ).toBe(3);
  });

  it("con el carrito vacío da 0", () => {
    expect(contarUnidades([])).toBe(0);
  });
});

describe("leerCarritoGuardado", () => {
  it("lee un carrito guardado bien", () => {
    expect(leerCarritoGuardado('[{"varianteId":1,"cantidad":2}]')).toEqual([
      { varianteId: 1, cantidad: 2 },
    ]);
  });

  it("sin nada guardado devuelve el carrito vacío", () => {
    expect(leerCarritoGuardado(null)).toEqual([]);
    expect(leerCarritoGuardado("")).toEqual([]);
  });

  it("con un texto roto empieza con el carrito vacío", () => {
    expect(leerCarritoGuardado("{no es json")).toEqual([]);
    expect(leerCarritoGuardado('{"varianteId":1}')).toEqual([]);
  });

  it("con datos alterados empieza con el carrito vacío", () => {
    expect(leerCarritoGuardado('[{"varianteId":"1","cantidad":2}]')).toEqual([]);
    expect(leerCarritoGuardado('[{"varianteId":1,"cantidad":-3}]')).toEqual([]);
  });

  it("descarta campos de más, como un precio guardado a mano", () => {
    expect(leerCarritoGuardado('[{"varianteId":1,"cantidad":2,"precio":1}]')).toEqual([
      { varianteId: 1, cantidad: 2 },
    ]);
  });
});
