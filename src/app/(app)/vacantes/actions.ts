"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { Estado } from "@/lib/vacantes/pipeline";

type Resultado = { error: string | null };

export async function cambiarEstadoAction(
  id: string,
  estado: Estado,
  fechaAplicacion?: string,
): Promise<Resultado> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tenés que iniciar sesión." };

  const datos: { estado: Estado; fecha_aplicacion?: string } = { estado };
  if (fechaAplicacion) datos.fecha_aplicacion = fechaAplicacion;

  const { error } = await supabase
    .from("applications")
    .update(datos)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "No se pudo actualizar el estado. Probá de nuevo." };

  // La vacante afecta tanto al tracker acá como al contador real de /hoy.
  revalidatePath("/vacantes");
  revalidatePath("/hoy");
  return { error: null };
}
