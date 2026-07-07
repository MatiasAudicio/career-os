import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calcularEmbudo } from "@/lib/hoy/metricas";
import type { Estado } from "@/lib/vacantes/pipeline";

// Bar chart horizontal de un solo hue (primary), etiqueta directa en la
// punta de cada barra. Ver metricas.ts para la nota de honestidad sobre qué
// significa (y qué NO significa) este "embudo".
export function FunnelChart({ vacantes }: { vacantes: { estado: Estado }[] }) {
  const etapas = calcularEmbudo(vacantes);
  const total = etapas[0]?.cantidad ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Embudo de tu pipeline</CardTitle>
        <CardDescription>
          Vacantes activas por etapa — no incluye rechazadas ni cerradas, y se
          basa en el estado actual (no hay historial de transiciones).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavía no hay vacantes activas para mostrar acá.
          </p>
        ) : (
          <div className="space-y-2">
            {etapas.map((etapa) => {
              const pct = Math.round((etapa.cantidad / total) * 100);
              const etiquetaAdentro = pct >= 18;
              return (
                <div key={etapa.estado} className="flex items-center gap-2">
                  <span className="w-20 shrink-0 text-xs text-muted-foreground">
                    {etapa.label}
                  </span>
                  <div className="h-5 flex-1 overflow-hidden rounded-md bg-muted">
                    <div
                      className="flex h-full items-center justify-end rounded-r-sm bg-primary px-1.5"
                      style={{ width: `${Math.max(pct, etapa.cantidad > 0 ? 6 : 0)}%` }}
                    >
                      {etiquetaAdentro && (
                        <span className="truncate text-[11px] font-medium text-primary-foreground">
                          {etapa.cantidad} ({pct}%)
                        </span>
                      )}
                    </div>
                  </div>
                  {!etiquetaAdentro && (
                    <span className="w-16 shrink-0 text-xs text-muted-foreground">
                      {etapa.cantidad} ({pct}%)
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
