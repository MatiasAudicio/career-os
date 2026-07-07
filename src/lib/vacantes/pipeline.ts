export type Estado =
  | "guardada"
  | "aplicada"
  | "respuesta"
  | "entrevista"
  | "oferta"
  | "rechazada"
  | "cerrada";

export const ESTADOS: { value: Estado; label: string }[] = [
  { value: "guardada", label: "Guardada" },
  { value: "aplicada", label: "Aplicada" },
  { value: "respuesta", label: "Respuesta" },
  { value: "entrevista", label: "Entrevista" },
  { value: "oferta", label: "Oferta" },
  { value: "rechazada", label: "Rechazada" },
  { value: "cerrada", label: "Cerrada" },
];

// Conteo del pipeline a partir de la lista ya cargada en la página — sin
// queries extra a Supabase, es la misma fuente de verdad que la lista.
export function contarPorEstado(vacantes: { estado: Estado }[]): Record<Estado, number> {
  const conteo = Object.fromEntries(ESTADOS.map(({ value }) => [value, 0])) as Record<
    Estado,
    number
  >;
  for (const vacante of vacantes) {
    conteo[vacante.estado] = (conteo[vacante.estado] ?? 0) + 1;
  }
  return conteo;
}
