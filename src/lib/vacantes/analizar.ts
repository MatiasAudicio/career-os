import { z } from "zod";

export const AnalisisVacanteSchema = z.object({
  match_pct: z.number().min(0).max(100),
  decision: z.enum(["aplicar", "despues", "ignorar"]),
  resumen: z.string(),
  skills_faltantes_descalificantes: z.array(z.string()),
  nice_to_have_ignorable: z.array(z.string()),
  razonamiento: z.string(),
});

export type AnalisisVacante = z.infer<typeof AnalisisVacanteSchema>;

// Mismas reglas que ya sigue el agente application-writer (src/lib/agents/
// index.ts) para no reinventar el criterio de match honesto en dos lugares.
const REGLAS_ANALISIS = `Reglas del análisis:
- Match % honesto: no infles ni castigues de más. Los requisitos de vacantes junior suelen estar inflados — con 50-60% de match real, la decisión default es "aplicar".
- Separá "skills faltantes descalificantes" (las que de verdad frenarían al candidato) de "nice to have que se puede ignorar" (deseables pero no bloqueantes).
- Nunca inventes experiencia que el perfil no tiene para inflar el match.
- Terminá siempre con una decisión clara: aplicar / despues / ignorar.`;

export function construirPromptAnalisis(
  profileContext: string,
  vacanteTexto: string,
): { system: string; prompt: string } {
  const system = `Sos el analista de vacantes de Career OS. Tu trabajo es dar un análisis de compatibilidad honesto entre el perfil real de un usuario y una vacante — nunca inflado, nunca desalentador de más.

${REGLAS_ANALISIS}

Perfil real del usuario (única fuente de verdad, nunca inventes fuera de esto):
${profileContext}`;

  const prompt = `Analizá esta vacante y devolveme el análisis estructurado:\n\n${vacanteTexto}`;

  return { system, prompt };
}

export function formatearJustificacion(analisis: AnalisisVacante): string {
  const partes = [`Resumen: ${analisis.resumen}`, `Por qué: ${analisis.razonamiento}`];

  if (analisis.skills_faltantes_descalificantes.length > 0) {
    partes.push(
      `Falta (descalificante): ${analisis.skills_faltantes_descalificantes.join(", ")}`,
    );
  }
  if (analisis.nice_to_have_ignorable.length > 0) {
    partes.push(
      `Nice-to-have que se puede ignorar: ${analisis.nice_to_have_ignorable.join(", ")}`,
    );
  }

  return partes.join("\n\n");
}
