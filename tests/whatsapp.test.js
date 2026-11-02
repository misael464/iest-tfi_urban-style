// tests/whatsapp.test.js
import { describe, it, expect } from "vitest";

import { armarEnlaceWhatsapp, armarMensajePedido } from "../js/lib/whatsapp.js";

const pedido = {
  codigo: "US-000001",
  items: [
    { nombre: "Remera Demo Oversize", talle: "L", color: "Negro", cantidad: 2, precioUnitario: 10000, subtotal: 20000 },
    { nombre: "Buzo Demo Canguro", talle: "M", color: "Gris", cantidad: 1, precioUnitario: 20000, subtotal: 20000 },
  ],
  total: 40000,
};

describe("armarMensajePedido", () => {
  it("arma el mensaje con el formato de CA12", () => {
    expect(armarMensajePedido(pedido, "Ana")).toBe(
      [
        "Hola, quiero hacer este pedido en Urban Style:",
        "Pedido US-000001",
        "- 2 × Remera Demo Oversize (L, Negro) a $ 10.000: $ 20.000",
        "- 1 × Buzo Demo Canguro (M, Gris) a $ 20.000: $ 20.000",
        "Total: $ 40.000",
        "Nombre: Ana",
      ].join("\n")
    );
  });

  it("quita los espacios de los costados del nombre", () => {
    expect(armarMensajePedido(pedido, "  Ana  ").endsWith("Nombre: Ana")).toBe(true);
  });
});

describe("armarEnlaceWhatsapp", () => {
  it("arma el enlace de wa.me con el número", () => {
    expect(armarEnlaceWhatsapp("5490000000000", "Hola")).toBe("https://wa.me/5490000000000?text=Hola");
  });

  it("codifica tildes, espacios y saltos de línea", () => {
    const enlace = armarEnlaceWhatsapp("5490000000000", "Pantalón\nTotal: $ 1");
    expect(enlace).toBe("https://wa.me/5490000000000?text=Pantal%C3%B3n%0ATotal%3A%20%24%201");
  });
});
