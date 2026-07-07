export type TipoEntrevista = "hr" | "tecnica" | "behavioral" | "hiring_manager" | "otra";

export const TIPOS_ENTREVISTA: { value: TipoEntrevista; label: string }[] = [
  { value: "hr", label: "HR" },
  { value: "tecnica", label: "Técnica" },
  { value: "behavioral", label: "Behavioral" },
  { value: "hiring_manager", label: "Hiring manager" },
  { value: "otra", label: "Otra" },
];

export function labelTipoEntrevista(tipo: TipoEntrevista): string {
  return TIPOS_ENTREVISTA.find((t) => t.value === tipo)?.label ?? tipo;
}
