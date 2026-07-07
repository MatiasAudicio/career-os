import { describe, expect, it } from "vitest";

import { contarPorEstado, diasDesdeUltimaAplicacion } from "./pipeline";

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

describe("diasDesdeUltimaAplicacion", () => {
  it("devuelve null si nunca aplicó", () => {
    expect(diasDesdeUltimaAplicacion(null)).toBeNull();
  });

  it("devuelve 0 si aplicó hoy", () => {
    const hoy = new Date("2026-07-07T15:00:00Z");
    expect(diasDesdeUltimaAplicacion("2026-07-07", hoy)).toBe(0);
  });

  it("cuenta los días completos transcurridos", () => {
    const hoy = new Date("2026-07-07T15:00:00Z");
    expect(diasDesdeUltimaAplicacion("2026-07-01", hoy)).toBe(6);
  });
});
