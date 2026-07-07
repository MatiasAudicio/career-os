"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ImprimirView({ titulo, contenido }: { titulo: string; contenido: string }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="print:hidden mb-6 flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
        <p className="text-sm text-muted-foreground">
          Este es el documento tal cual se va a imprimir.
        </p>
        <Button onClick={() => window.print()} className="gap-1.5">
          <Download className="size-4" aria-hidden="true" />
          Descargar / Imprimir PDF
        </Button>
      </div>

      <article className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
        <h1 className="mb-4 text-lg font-semibold">{titulo}</h1>
        {contenido}
      </article>
    </div>
  );
}
