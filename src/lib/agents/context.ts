import { createClient } from "@/lib/supabase/server";

const SIN_PERFIL =
  "El usuario todavía no completó ningún dato de perfil. Si necesitás algo de su experiencia, skills o proyectos para responder bien, pedíselo directamente.";

// Arma el contexto real del usuario a partir de su propia base (respetando RLS,
// la sesión del route handler solo puede leer sus propias filas). Es la única
// fuente de verdad que reciben los agentes — nunca se completa con inventos.
export async function buildProfileContext(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return SIN_PERFIL;

  const [
    { data: profile },
    { data: experiences },
    { data: skills },
    { data: projects },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("experiences")
      .select("*")
      .order("orden", { ascending: true }),
    supabase.from("skills").select("*"),
    supabase.from("projects").select("*"),
  ]);

  const partes: string[] = [];

  if (profile?.nombre) partes.push(`Nombre: ${profile.nombre}`);
  if (profile?.ubicacion) partes.push(`Ubicación: ${profile.ubicacion}`);
  if (profile?.objetivo) partes.push(`Objetivo de búsqueda: ${profile.objetivo}`);
  if (profile?.resumen) partes.push(`Resumen en sus palabras: ${profile.resumen}`);

  if (experiences?.length) {
    const lista = experiences
      .map((e) => {
        const rango = `${e.desde ?? "?"} – ${e.hasta ?? "actual"}`;
        const org = e.organizacion ? ` en ${e.organizacion}` : "";
        const desc = e.descripcion ? `: ${e.descripcion}` : "";
        return `- ${e.titulo}${org} (${rango})${desc}`;
      })
      .join("\n");
    partes.push(`Experiencia:\n${lista}`);
  }

  if (skills?.length) {
    partes.push(`Skills: ${skills.map((s) => s.nombre).join(", ")}`);
  }

  if (projects?.length) {
    const lista = projects
      .map((p) => `- ${p.nombre}${p.descripcion ? `: ${p.descripcion}` : ""}`)
      .join("\n");
    partes.push(`Proyectos:\n${lista}`);
  }

  return partes.length > 0 ? partes.join("\n\n") : SIN_PERFIL;
}
