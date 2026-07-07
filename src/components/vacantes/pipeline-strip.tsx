import { Card, CardContent } from "@/components/ui/card";
import { ESTADOS, type Estado } from "@/lib/vacantes/pipeline";

// Compartido por /vacantes y /hoy — mismo conteo (contarPorEstado), mismo
// componente, para que el pipeline se vea idéntico en los dos lugares.
export function PipelineStrip({ conteo }: { conteo: Record<Estado, number> }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
      {ESTADOS.map(({ value, label }) => (
        <Card key={value} size="sm" className="text-center">
          <CardContent className="space-y-0.5 px-3 py-2">
            <p className="font-mono text-xl font-semibold tracking-tight">{conteo[value]}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
