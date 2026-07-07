import { describe, expect, it } from "vitest";

import { contarPorEstado } from "./pipeline";

describe("contarPorEstado", () => {
  it("cuenta cada estado y deja en 0 los que no tienen ninguna vacante", () => {
    const conteo = contarPorEstado([
      { estado: "guardada" },
      { estado: "guardada" },
      { estado: "aplicada" },
    ]);

    expect(conteo).toEqual({
      guardada: 2,
      aplicada: 1,
      respuesta: 0,
      entrevista: 0,
      oferta: 0,
      rechazada: 0,
      cerrada: 0,
    });
  });

  it("devuelve todo en 0 con una lista vacía", () => {
    const conteo = contarPorEstado([]);
    expect(Object.values(conteo).every((n) => n === 0)).toBe(true);
  });
});
