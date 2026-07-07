export type TipoDocumento = "cv" | "carta";

export type VacanteParaDocumento = {
  empresa: string;
  rol: string;
  descripcion: string | null;
};

// Mismas reglas que ya sigue el agente application-writer (src/lib/agents/
// index.ts) para no reinventar el criterio en dos lugares.
const REGLAS_DOCUMENTOS = `Reglas no negociables:
- Formato copy-paste puro: cada sección bajo su propio encabezado, texto final sin explicaciones mezcladas adentro. Nada de comentarios tipo "acá podrías agregar...".
- ATS-friendly: keywords del aviso presentes cuando sean ciertas, formato simple en texto plano, sin tablas ni gráficos ni columnas.
- Nunca inventar experiencia, títulos, fechas ni logros que no estén en el perfil del usuario. Si falta algo para que quede completo, dejalo genérico en vez de inventarlo.
- Responder en español.`;

function contextoVacante(vacante: VacanteParaDocumento): string {
  return `Empresa: ${vacante.empresa}\nRol: ${vacante.rol}\n\nTexto de la vacante:\n${vacante.descripcion ?? "(sin descripción)"}`;
}

export function construirPromptDocumento(
  tipo: TipoDocumento,
  profileContext: string,
  vacante: VacanteParaDocumento,
): { system: string; prompt: string } {
  const tarea =
    tipo === "cv"
      ? "Escribí un CV completo (datos de contacto, resumen, experiencia, skills, proyectos) adaptado a esta vacante puntual, resaltando lo más relevante para ese rol."
      : "Escribí una carta de presentación corta (3-4 párrafos) dirigida a esta empresa, explicando por qué el candidato encaja con este rol puntual.";

  const system = `Sos el redactor de materiales de postulación de Career OS. ${tarea}

${REGLAS_DOCUMENTOS}

Perfil real del usuario (única fuente de verdad, nunca inventes fuera de esto):
${profileContext}`;

  const prompt = `Generá el documento para esta vacante:\n\n${contextoVacante(vacante)}`;

  return { system, prompt };
}

export function tituloDocumento(
  tipo: TipoDocumento,
  vacante: { empresa: string; rol: string },
): string {
  const etiqueta = tipo === "cv" ? "CV" : "Carta";
  return `${etiqueta} — ${vacante.rol} en ${vacante.empresa}`;
}

export function siguienteVersion(versionesExistentes: number[]): number {
  return versionesExistentes.length === 0 ? 1 : Math.max(...versionesExistentes) + 1;
}
