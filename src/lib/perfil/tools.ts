import type { SupabaseClient } from "@supabase/supabase-js";
import { tool } from "ai";
import { z } from "zod";

import {
  actualizarDatosBasicos,
  agregarExperiencia,
  agregarProyecto,
  agregarSkill,
} from "./persistencia";

// Tools que el chat de onboarding usa para ir guardando el perfil apenas el
// usuario da cada dato — no esperan a que la conversación termine. Todas
// operan sobre el usuario autenticado de esta request (supabase + userId),
// nunca sobre un id que decida el modelo.
export function crearToolsOnboarding(supabase: SupabaseClient, userId: string) {
  return {
    guardar_datos_basicos: tool({
      description:
        "Guarda o actualiza nombre, ubicación, objetivo de búsqueda, resumen o idiomas del usuario. Llamala apenas el usuario dé alguno de estos datos, no esperes a tener todos juntos.",
      inputSchema: z.object({
        nombre: z.string().optional(),
        ubicacion: z.string().optional(),
        objetivo: z.string().optional(),
        resumen: z.string().optional(),
        idiomas: z.array(z.string()).optional(),
      }),
      execute: async (datos) => {
        const { error } = await actualizarDatosBasicos(supabase, userId, datos);
        return error ?? "Guardado.";
      },
    }),
    agregar_experiencia: tool({
      description:
        "Agrega una experiencia laboral o formativa al perfil. Llamala cada vez que el usuario cuente una experiencia concreta, no esperes a que termine de contar todas.",
      inputSchema: z.object({
        titulo: z.string(),
        organizacion: z.string().optional(),
        desde: z
          .string()
          .optional()
          .describe("Fecha aproximada de inicio en formato YYYY-MM-DD"),
        hasta: z
          .string()
          .optional()
          .describe("Fecha de fin en formato YYYY-MM-DD; omitir si es su experiencia actual"),
        descripcion: z.string().optional(),
      }),
      execute: async (datos) => {
        const { error } = await agregarExperiencia(supabase, userId, datos);
        return error ?? "Guardado.";
      },
    }),
    agregar_skill: tool({
      description:
        "Agrega una habilidad (técnica, blanda, idioma o herramienta) al perfil.",
      inputSchema: z.object({
        nombre: z.string(),
        nivel: z.enum(["basico", "intermedio", "avanzado"]).optional(),
        categoria: z.string().optional(),
      }),
      execute: async (datos) => {
        const { error } = await agregarSkill(supabase, userId, datos);
        return error ?? "Guardado.";
      },
    }),
    agregar_proyecto: tool({
      description: "Agrega un proyecto personal o de portfolio al perfil.",
      inputSchema: z.object({
        nombre: z.string(),
        descripcion: z.string().optional(),
        url: z.string().optional(),
        tecnologias: z.array(z.string()).optional(),
      }),
      execute: async (datos) => {
        const { error } = await agregarProyecto(supabase, userId, datos);
        return error ?? "Guardado.";
      },
    }),
  };
}
