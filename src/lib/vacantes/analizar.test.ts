import { describe, expect, it } from "vitest";

import { AnalisisVacanteSchema, construirPromptAnalisis, formatearJustificacion } from "./analizar";

describe("construirPromptAnalisis", () => {
  it("incluye el contexto real del perfil y el texto de la vacante", () => {
    const { system, prompt } = construirPromptAnalisis(
      "Nombre: Matias\nSkills: SQL, Python",
      "Se busca QA junior con 2 años de experiencia en Selenium",
    );

    expect(system).toContain("Nombre: Matias");
    expect(system).toContain("Skills: SQL, Python");
    expect(prompt).toContain("Se busca QA junior con 2 años de experiencia en Selenium");
  });

  it("incluye la regla de mercado 50-60% de match real → aplicar", () => {
    const { system } = construirPromptAnalisis("perfil", "vacante");
    expect(system).toContain("50-60% de match real");
  });

  it("pide estimar probabilidad de entrevista y de oferta", () => {
    const { system } = construirPromptAnalisis("perfil", "vacante");
    expect(system).toContain("Probabilidad de entrevista");
    expect(system).toContain("Probabilidad de oferta");
  });
});

describe("formatearJustificacion", () => {
  it("arma resumen + por qué + faltantes + nice-to-have cuando hay de todo", () => {
    const texto = formatearJustificacion({
      match_pct: 65,
      probabilidad_entrevista: 40,
      probabilidad_oferta: 15,
      decision: "aplicar",
      resumen: "Buen match para un rol junior.",
      razonamiento: "Tiene la mayoría de las skills pedidas.",
      skills_faltantes_descalificantes: ["Selenium"],
      nice_to_have_ignorable: ["Docker", "Kubernetes"],
    });

    expect(texto).toBe(
      [
        "Resumen: Buen match para un rol junior.",
        "Por qué: Tiene la mayoría de las skills pedidas.",
        "Falta (descalificante): Selenium",
        "Nice-to-have que se puede ignorar: Docker, Kubernetes",
      ].join("\n\n"),
    );
  });

  it("omite las secciones de faltantes/nice-to-have cuando vienen vacías", () => {
    const texto = formatearJustificacion({
      match_pct: 90,
      probabilidad_entrevista: 70,
      probabilidad_oferta: 30,
      decision: "aplicar",
      resumen: "Match excelente.",
      razonamiento: "Cumple con todo lo pedido.",
      skills_faltantes_descalificantes: [],
      nice_to_have_ignorable: [],
    });

    expect(texto).toBe("Resumen: Match excelente.\n\nPor qué: Cumple con todo lo pedido.");
  });
});

describe("AnalisisVacanteSchema", () => {
  const base = {
    match_pct: 50,
    probabilidad_entrevista: 30,
    probabilidad_oferta: 10,
    decision: "aplicar" as const,
    resumen: "r",
    razonamiento: "r",
    skills_faltantes_descalificantes: [],
    nice_to_have_ignorable: [],
  };

  it("acepta un objeto válido", () => {
    expect(AnalisisVacanteSchema.safeParse(base).success).toBe(true);
  });

  it("rechaza match_pct fuera de 0-100", () => {
    expect(AnalisisVacanteSchema.safeParse({ ...base, match_pct: 150 }).success).toBe(false);
  });

  it("rechaza probabilidad_entrevista fuera de 0-100", () => {
    expect(
      AnalisisVacanteSchema.safeParse({ ...base, probabilidad_entrevista: -5 }).success,
    ).toBe(false);
  });

  it("rechaza una decision fuera del enum", () => {
    expect(AnalisisVacanteSchema.safeParse({ ...base, decision: "tal_vez" }).success).toBe(false);
  });
});
