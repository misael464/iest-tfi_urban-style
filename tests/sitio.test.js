// tests/sitio.test.js
import { describe, it, expect } from "vitest";

import { sitio } from "../js/config/sitio.js";

describe("sitio", () => {
  it("tiene el nombre de la marca", () => {
    expect(sitio.nombre).toBe("Urban Style");
  });
});
