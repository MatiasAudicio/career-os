import type { SupabaseClient } from "@supabase/supabase-js";

export type Nivel = "basico" | "intermedio" | "avanzado";

export type DatosBasicos = {
  nombre?: string;
  ubicacion?: string;
  objetivo?: string;
  resumen?: string;
  idiomas?: string[];
};

export type DatosExperiencia = {
  titulo: string;
  organizacion?: string;
  desde?: string; // YYYY-MM-DD
  hasta?: string; // ausente/null = actual
  descripcion?: string;
};

export type DatosSkill = {
  nombre: string;
  nivel?: Nivel;
  categoria?: string;
};

export type DatosProyecto = {
  nombre: string;
  descripcion?: string;
  url?: string;
  tecnologias?: string[];
};

export type Resultado = { error: string | null };

// Todas las escrituras filtran por el user_id de la sesión autenticada (nunca
// por un id crudo recibido del cliente sin validar), como refuerzo del lado
// de la app además de las políticas RLS ya activas en cada tabla. Este módulo
// es la única fuente de verdad: lo llaman tanto las tools del chat de
// onboarding como los server actions de los formularios manuales de /perfil.

function mensajeError(contexto: string): string {
  return `No se pudo ${contexto}. Probá de nuevo en unos segundos.`;
}

export async function actualizarDatosBasicos(
  supabase: SupabaseClient,
  userId: string,
  datos: DatosBasicos,
): Promise<Resultado> {
  const { error } = await supabase.from("profiles").update(datos).eq("id", userId);
  return { error: error ? mensajeError("guardar tus datos básicos") : null };
}

export async function agregarExperiencia(
  supabase: SupabaseClient,
  userId: string,
  datos: DatosExperiencia,
): Promise<Resultado> {
  const { error } = await supabase
    .from("experiences")
    .insert({ ...datos, user_id: userId });
  return { error: error ? mensajeError("guardar esa experiencia") : null };
}

export async function actualizarExperiencia(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  datos: Partial<DatosExperiencia>,
): Promise<Resultado> {
  const { error } = await supabase
    .from("experiences")
    .update(datos)
    .eq("id", id)
    .eq("user_id", userId);
  return { error: error ? mensajeError("actualizar esa experiencia") : null };
}

export async function eliminarExperiencia(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<Resultado> {
  const { error } = await supabase
    .from("experiences")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  return { error: error ? mensajeError("borrar esa experiencia") : null };
}

export async function agregarSkill(
  supabase: SupabaseClient,
  userId: string,
  datos: DatosSkill,
): Promise<Resultado> {
  const { error } = await supabase.from("skills").insert({ ...datos, user_id: userId });
  return { error: error ? mensajeError("guardar esa skill") : null };
}

export async function actualizarSkill(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  datos: Partial<DatosSkill>,
): Promise<Resultado> {
  const { error } = await supabase
    .from("skills")
    .update(datos)
    .eq("id", id)
    .eq("user_id", userId);
  return { error: error ? mensajeError("actualizar esa skill") : null };
}

export async function eliminarSkill(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<Resultado> {
  const { error } = await supabase
    .from("skills")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  return { error: error ? mensajeError("borrar esa skill") : null };
}

export async function agregarProyecto(
  supabase: SupabaseClient,
  userId: string,
  datos: DatosProyecto,
): Promise<Resultado> {
  const { error } = await supabase
    .from("projects")
    .insert({ ...datos, user_id: userId });
  return { error: error ? mensajeError("guardar ese proyecto") : null };
}

export async function actualizarProyecto(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  datos: Partial<DatosProyecto>,
): Promise<Resultado> {
  const { error } = await supabase
    .from("projects")
    .update(datos)
    .eq("id", id)
    .eq("user_id", userId);
  return { error: error ? mensajeError("actualizar ese proyecto") : null };
}

export async function eliminarProyecto(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<Resultado> {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  return { error: error ? mensajeError("borrar ese proyecto") : null };
}
