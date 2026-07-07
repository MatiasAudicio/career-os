import { describe, expect, it } from "vitest";

import { aplicacionesPorSemana, calcularEmbudo } from "./metricas";

describe("calcularEmbudo", () => {
  it("cuenta cumulativo hacia adelante entre las etapas activas", () => {
    const embudo = calcularEmbudo([
      { estado: "guardada" },
      { estado: "aplicada" },
      { estado: "aplicada" },
      { estado: "entrevista" },
    ]);

    // guardada: las 4 · aplicada: las 3 que no quedaron en guardada ·
    // respuesta: ninguna llegó ahí · entrevista: la 1 que sí · oferta: 0
    expect(embudo.map((e) => e.cantidad)).toEqual([4, 3, 1, 1, 0]);
  });

  it("excluye rechazada/cerrada de todas las etapas, incluida guardada", () => {
    const embudo = calcularEmbudo([{ estado: "rechazada" }, { estado: "cerrada" }]);
    expect(embudo.every((e) => e.cantidad === 0)).toBe(true);
  });

  it("devuelve las 5 etapas en orden aunque no haya vacantes", () => {
    const embudo = calcularEmbudo([]);
    expect(embudo.map((e) => e.estado)).toEqual([
      "guardada",
      "aplicada",
      "respuesta",
      "entrevista",
      "oferta",
    ]);
  });
});

describe("aplicacionesPorSemana", () => {
  it("arma 6 baldes por default, terminando hoy", () => {
    const hoy = new Date("2026-07-07T12:00:00Z");
    const semanas = aplicacionesPorSemana([], 6, hoy);
    expect(semanas).toHaveLength(6);
    expect(semanas[5].actual).toBe(true);
    expect(semanas.slice(0, 5).every((s) => s.actual === false)).toBe(true);
  });

  it("cuenta las fechas dentro de cada balde de 7 días", () => {
    const hoy = new Date("2026-07-07T12:00:00Z");
    const semanas = aplicacionesPorSemana(["2026-07-07", "2026-07-06", "2026-06-30"], 2, hoy);

    // balde anterior: 2026-06-24..2026-06-30 → 1 (2026-06-30)
    // balde actual: 2026-07-01..2026-07-07 → 2
    expect(semanas.map((s) => s.cantidad)).toEqual([1, 2]);
  });
});
