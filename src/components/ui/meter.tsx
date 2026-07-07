import { varianteProbabilidad } from "@/lib/vacantes/pipeline"
import { cn } from "@/lib/utils"

const RELLENO: Record<"success" | "warning" | "destructive" | "outline", string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  destructive: "bg-destructive",
  outline: "bg-muted-foreground/40",
}

// Meter: track delgado con relleno sólido según severidad — la forma que
// pide un "ratio contra un límite" (match %, probabilidad de entrevista/
// oferta), en vez de un badge de solo texto. La etiqueta y el valor van en
// texto (nunca el texto lleva el color de la data).
function Meter({ label, value }: { label: string; value: number }) {
  const variante = varianteProbabilidad(value)

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-36 shrink-0 truncate text-muted-foreground">{label}</span>
      <div className="h-2 flex-1 rounded-full bg-muted" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div
          className={cn("h-2 rounded-full", RELLENO[variante])}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className="w-9 shrink-0 text-right font-mono tabular-nums text-muted-foreground">
        {value}%
      </span>
    </div>
  )
}

export { Meter }
