"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

type Resultado = { error: string | null };

export async function actualizarDocumentoAction(id: string, contenido: string): Promise<Resultado> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tenés que iniciar sesión." };

  const { error } = await supabase
    .from("documents")
    .update({ contenido })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "No se pudo guardar el documento. Probá de nuevo." };
  revalidatePath("/documentos");
  return { error: null };
}

export async function eliminarDocumentoAction(id: string): Promise<Resultado> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tenés que iniciar sesión." };

  const { error } = await supabase.from("documents").delete().eq("id", id).eq("user_id", user.id);

  if (error) return { error: "No se pudo borrar el documento. Probá de nuevo." };
  revalidatePath("/documentos");
  return { error: null };
}
