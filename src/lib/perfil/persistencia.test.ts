import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  actualizarDatosBasicos,
  actualizarExperiencia,
  actualizarProyecto,
  actualizarSkill,
  agregarExperiencia,
  agregarProyecto,
  agregarSkill,
  eliminarExperiencia,
  eliminarProyecto,
  eliminarSkill,
} from "./persistencia";

type Llamada = {
  tabla: string;
  metodo: "insert" | "update" | "delete";
  payload?: unknown;
  filtros: [string, unknown][];
};

// Stub mínimo del query builder de Supabase: registra tabla/método/payload/
// filtros de cada llamada y resuelve con el error configurado, sin tocar
// ninguna base de datos real.
function crearSupabaseFalso(errorSimulado: { message: string } | null = null) {
  const llamadas: Llamada[] = [];

  function from(tabla: string) {
    function crearEncadenable(metodo: Llamada["metodo"], payload?: unknown) {
      const filtros: [string, unknown][] = [];
      llamadas.push({ tabla, metodo, payload, filtros });

      const encadenable = {
        eq(columna: string, valor: unknown) {
          filtros.push([columna, valor]);
          return encadenable;
        },
        then(onFulfilled: (v: { error: unknown }) => unknown) {
          return Promise.resolve({ error: errorSimulado }).then(onFulfilled);
        },
      };
      return encadenable;
    }

    return {
      insert: (payload: unknown) => crearEncadenable("insert", payload),
      update: (payload: unknown) => crearEncadenable("update", payload),
      delete: () => crearEncadenable("delete"),
    };
  }

  return { supabase: { from } as unknown as SupabaseClient, llamadas };
}

describe("persistencia de perfil", () => {
  it("actualizarDatosBasicos guarda solo los campos dados y filtra por el id del usuario", async () => {
    const { supabase, llamadas } = crearSupabaseFalso();

    const resultado = await actualizarDatosBasicos(supabase, "user-1", {
      nombre: "Matias",
      objetivo: "QA junior",
    });

    expect(resultado.error).toBeNull();
    expect(llamadas).toEqual([
      {
        tabla: "profiles",
        metodo: "update",
        payload: { nombre: "Matias", objetivo: "QA junior" },
        filtros: [["id", "user-1"]],
      },
    ]);
  });

  it("agregarExperiencia inserta con el user_id de la sesión, no uno externo", async () => {
    const { supabase, llamadas } = crearSupabaseFalso();

    await agregarExperiencia(supabase, "user-1", {
      titulo: "Soporte técnico",
      organizacion: "Acme",
    });

    expect(llamadas[0]).toEqual({
      tabla: "experiences",
      metodo: "insert",
      payload: { titulo: "Soporte técnico", organizacion: "Acme", user_id: "user-1" },
      filtros: [],
    });
  });

  it("actualizarExperiencia filtra por id Y por user_id (no confía en un id crudo del cliente)", async () => {
    const { supabase, llamadas } = crearSupabaseFalso();

    await actualizarExperiencia(supabase, "user-1", "exp-9", { hasta: "2026-01-01" });

    expect(llamadas[0].filtros).toEqual([
      ["id", "exp-9"],
      ["user_id", "user-1"],
    ]);
  });

  it("eliminarExperiencia filtra por id y user_id", async () => {
    const { supabase, llamadas } = crearSupabaseFalso();

    await eliminarExperiencia(supabase, "user-1", "exp-9");

    expect(llamadas[0]).toMatchObject({
      tabla: "experiences",
      metodo: "delete",
      filtros: [
        ["id", "exp-9"],
        ["user_id", "user-1"],
      ],
    });
  });

  it("agregarSkill / actualizarSkill / eliminarSkill operan sobre la tabla skills", async () => {
    const { supabase, llamadas } = crearSupabaseFalso();

    await agregarSkill(supabase, "user-1", { nombre: "SQL", nivel: "intermedio" });
    await actualizarSkill(supabase, "user-1", "skill-1", { nivel: "avanzado" });
    await eliminarSkill(supabase, "user-1", "skill-1");

    expect(llamadas.map((l) => `${l.tabla}:${l.metodo}`)).toEqual([
      "skills:insert",
      "skills:update",
      "skills:delete",
    ]);
    expect(llamadas[1].filtros).toEqual([
      ["id", "skill-1"],
      ["user_id", "user-1"],
    ]);
  });

  it("agregarProyecto / actualizarProyecto / eliminarProyecto operan sobre la tabla projects", async () => {
    const { supabase, llamadas } = crearSupabaseFalso();

    await agregarProyecto(supabase, "user-1", { nombre: "ERP", tecnologias: ["React"] });
    await actualizarProyecto(supabase, "user-1", "proj-1", { descripcion: "actualizado" });
    await eliminarProyecto(supabase, "user-1", "proj-1");

    expect(llamadas.map((l) => `${l.tabla}:${l.metodo}`)).toEqual([
      "projects:insert",
      "projects:update",
      "projects:delete",
    ]);
  });

  it("devuelve un mensaje de error legible cuando Supabase falla", async () => {
    const { supabase } = crearSupabaseFalso({ message: "boom" });

    const resultado = await agregarSkill(supabase, "user-1", { nombre: "SQL" });

    expect(resultado.error).toBe("No se pudo guardar esa skill. Probá de nuevo en unos segundos.");
  });
});
