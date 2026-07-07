import type { Estado } from "@/lib/vacantes/pipeline";

export type EtapaEmbudo = { estado: Estado; label: string; cantidad: number };

const ETAPAS_EMBUDO: { estado: Estado; label: string }[] = [
  { estado: "guardada", label: "Guardada" },
  { estado: "aplicada", label: "Aplicada" },
  { estado: "respuesta", label: "Respuesta" },
  { estado: "entrevista", label: "Entrevista" },
  { estado: "oferta", label: "Oferta" },
];

// El embudo cuenta vacantes ACTIVAS (rechazada/cerrada quedan afuera de
// raíz — no sabemos en qué etapa se cayeron) y usa el estado actual como
// proxy de "hasta dónde llegó" cada una, porque applications no guarda un
// historial de transiciones. Es una aproximación honesta, no un funnel con
// tracking real — el caption de FunnelChart lo aclara.
export function calcularEmbudo(vacantes: { estado: Estado }[]): EtapaEmbudo[] {
  return ETAPAS_EMBUDO.map(({ estado, label }, indice) => ({
    estado,
    label,
    cantidad: vacantes.filter(
      (v) => ETAPAS_EMBUDO.findIndex((etapa) => etapa.estado === v.estado) >= indice,
    ).length,
  }));
}

export type SemanaAplicaciones = { etiqueta: string; cantidad: number; actual: boolean };

// Baldes de 7 días terminando hoy, del más viejo al más nuevo. `fechas` son
// las fecha_aplicacion (YYYY-MM-DD) de todas las aplicaciones del usuario.
export function aplicacionesPorSemana(
  fechas: string[],
  semanas = 6,
  hoy: Date = new Date(),
): SemanaAplicaciones[] {
  const unDia = 24 * 60 * 60 * 1000;
  const hoyUTC = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const timestamps = fechas.map((f) => Date.parse(f));

  const resultado: SemanaAplicaciones[] = [];
  for (let i = semanas - 1; i >= 0; i--) {
    const finMs = hoyUTC - i * 7 * unDia;
    const inicioMs = finMs - 6 * unDia;
    const cantidad = timestamps.filter((t) => t >= inicioMs && t <= finMs).length;
    const inicio = new Date(inicioMs);
    resultado.push({
      etiqueta: `${inicio.getUTCDate()}/${inicio.getUTCMonth() + 1}`,
      cantidad,
      actual: i === 0,
    });
  }
  return resultado;
}
