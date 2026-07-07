import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { aplicacionesPorSemana } from "@/lib/hoy/metricas";
import { cn } from "@/lib/utils";

// Bar chart vertical, un solo hue: la semana actual en primary pleno, las
// anteriores en gris de-emphasis (patrón "emphasis" de la skill dataviz).
// Pocas barras (6) → está bien rotular el valor de todas.
export function TendenciaSemanal({ fechasAplicacion }: { fechasAplicacion: string[] }) {
  const semanas = aplicacionesPorSemana(fechasAplicacion);
  const max = Math.max(1, ...semanas.map((s) => s.cantidad));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Aplicaciones por semana</CardTitle>
        <CardDescription>Últimas 6 semanas, terminando hoy.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-28 items-end gap-3">
          {semanas.map((semana) => (
            <div
              key={semana.etiqueta}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1"
            >
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {semana.cantidad}
              </span>
              <div
                className={cn(
                  "w-full rounded-t-sm",
                  semana.actual ? "bg-primary" : "bg-muted-foreground/30",
                )}
                style={{ height: `${(semana.cantidad / max) * 100}%` }}
              />
              <span className="text-[10px] text-muted-foreground">{semana.etiqueta}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
