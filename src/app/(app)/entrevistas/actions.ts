"use server";

import { revalidatePath } from "next/cache";

import type { TipoEntrevista } from "@/lib/entrevistas/tipos";
import { createClient } from "@/lib/supabase/server";

type Resultado = { error: string | null };

export type DatosEntrevista = {
  tipo: TipoEntrevista;
  fecha: string;
  applicationId?: string;
  resultado?: string;
  lecciones?: string;
};

export async function agregarEntrevistaAction(datos: DatosEntrevista): Promise<Resultado> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tenés que iniciar sesión." };

  const { error } = await supabase.from("interviews").insert({
    user_id: user.id,
    tipo: datos.tipo,
    fecha: datos.fecha,
    application_id: datos.applicationId || null,
    resultado: datos.resultado || null,
    lecciones: datos.lecciones || null,
  });

  if (error) return { error: "No se pudo guardar la entrevista. Probá de nuevo." };
  revalidatePath("/entrevistas");
  return { error: null };
}

export async function actualizarEntrevistaAction(
  id: string,
  datos: Partial<DatosEntrevista>,
): Promise<Resultado> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tenés que iniciar sesión." };

  const cambios: Record<string, unknown> = {};
  if (datos.tipo !== undefined) cambios.tipo = datos.tipo;
  if (datos.fecha !== undefined) cambios.fecha = datos.fecha;
  if (datos.applicationId !== undefined) cambios.application_id = datos.applicationId || null;
  if (datos.resultado !== undefined) cambios.resultado = datos.resultado || null;
  if (datos.lecciones !== undefined) cambios.lecciones = datos.lecciones || null;

  const { error } = await supabase
    .from("interviews")
    .update(cambios)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "No se pudo actualizar la entrevista. Probá de nuevo." };
  revalidatePath("/entrevistas");
  return { error: null };
}

export async function eliminarEntrevistaAction(id: string): Promise<Resultado> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tenés que iniciar sesión." };

  const { error } = await supabase.from("interviews").delete().eq("id", id).eq("user_id", user.id);

  if (error) return { error: "No se pudo borrar la entrevista. Probá de nuevo." };
  revalidatePath("/entrevistas");
  return { error: null };
}
