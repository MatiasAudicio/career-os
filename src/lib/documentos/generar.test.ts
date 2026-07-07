import { describe, expect, it } from "vitest";

import { construirPromptDocumento, siguienteVersion, tituloDocumento } from "./generar";

const VACANTE = { empresa: "Acme", rol: "QA Junior", descripcion: "Se busca QA junior con Selenium" };

describe("construirPromptDocumento", () => {
  it("incluye el perfil real y los datos de la vacante", () => {
    const { system, prompt } = construirPromptDocumento("cv", "Nombre: Matias\nSkills: SQL", VACANTE);

    expect(system).toContain("Nombre: Matias");
    expect(system).toContain("Skills: SQL");
    expect(prompt).toContain("Acme");
    expect(prompt).toContain("Se busca QA junior con Selenium");
  });

  it("incluye la regla de no inventar experiencia", () => {
    const { system } = construirPromptDocumento("carta", "perfil", VACANTE);
    expect(system).toContain("Nunca inventar experiencia");
  });

  it("pide un CV completo para tipo cv y una carta corta para tipo carta", () => {
    const cv = construirPromptDocumento("cv", "perfil", VACANTE);
    const carta = construirPromptDocumento("carta", "perfil", VACANTE);

    expect(cv.system).toContain("CV completo");
    expect(carta.system).toContain("carta de presentación corta");
  });
});

describe("tituloDocumento", () => {
  it("arma el título con el rol y la empresa", () => {
    expect(tituloDocumento("cv", VACANTE)).toBe("CV — QA Junior en Acme");
    expect(tituloDocumento("carta", VACANTE)).toBe("Carta — QA Junior en Acme");
  });
});

describe("siguienteVersion", () => {
  it("devuelve 1 cuando no hay versiones previas", () => {
    expect(siguienteVersion([])).toBe(1);
  });

  it("devuelve el máximo + 1 cuando ya hay versiones", () => {
    expect(siguienteVersion([1, 2, 3])).toBe(4);
    expect(siguienteVersion([1, 3])).toBe(4);
  });
});
