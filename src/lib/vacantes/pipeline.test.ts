import { describe, expect, it } from "vitest";

import { contarPorEstado, diasDesdeUltimaAplicacion, varianteProbabilidad } from "./pipeline";

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

describe("varianteProbabilidad", () => {
  it("devuelve outline cuando no hay valor", () => {
    expect(varianteProbabilidad(null)).toBe("outline");
  });

  it("devuelve success a partir de 70", () => {
    expect(varianteProbabilidad(70)).toBe("success");
    expect(varianteProbabilidad(100)).toBe("success");
  });

  it("devuelve warning entre 40 y 69", () => {
    expect(varianteProbabilidad(40)).toBe("warning");
    expect(varianteProbabilidad(69)).toBe("warning");
  });

  it("devuelve destructive por debajo de 40", () => {
    expect(varianteProbabilidad(0)).toBe("destructive");
    expect(varianteProbabilidad(39)).toBe("destructive");
  });
});
