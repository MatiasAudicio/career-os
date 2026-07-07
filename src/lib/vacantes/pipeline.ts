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

// Para el nudge anti-trampa del dashboard "Hoy". fechaMasReciente es la
// fecha_aplicacion más reciente entre las vacantes del usuario (null si
// nunca aplicó todavía).
export function diasDesdeUltimaAplicacion(
  fechaMasReciente: string | null,
  hoy: Date = new Date(),
): number | null {
  if (!fechaMasReciente) return null;
  const unDia = 1000 * 60 * 60 * 24;
  const diferencia = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) - Date.parse(fechaMasReciente);
  return Math.max(0, Math.round(diferencia / unDia));
}
