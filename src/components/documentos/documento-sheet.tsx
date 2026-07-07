"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

import { actualizarDocumentoAction } from "@/app/(app)/documentos/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

export type Documento = {
  id: string;
  tipo: "cv" | "carta" | "mensaje" | "otro";
  titulo: string;
  contenido: string;
  version: number;
};

const TIPO_LABEL: Record<Documento["tipo"], string> = {
  cv: "CV",
  carta: "Carta",
  mensaje: "Mensaje",
  otro: "Otro",
};

// Sheet compartido para ver/editar un documento — se usa tanto desde Vacantes
// (apenas se termina de generar) como desde /documentos (al abrir uno ya
// existente). "Descargar PDF" abre /imprimir/[id] en una pestaña nueva, fuera
// del shell de la app, para no arrastrar el sidebar/bottom nav al imprimir.
export function DocumentoSheet({
  documento,
  open,
  onOpenChange,
}: {
  documento: Documento | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [contenido, setContenido] = useState(documento?.contenido ?? "");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resincroniza el borrador editable cuando se abre un documento distinto en el mismo Sheet ya montado
    if (documento) setContenido(documento.contenido);
  }, [documento]);

  if (!documento) return null;

  const editado = contenido !== documento.contenido;

  async function handleGuardar() {
    if (!documento) return;
    setGuardando(true);
    const resultado = await actualizarDocumentoAction(documento.id, contenido);
    setGuardando(false);
    if (resultado.error) {
      toast.error(resultado.error);
      return;
    }
    toast.success("Documento guardado.");
  }

  async function handleCopiar() {
    await navigator.clipboard.writeText(contenido);
    toast.success("Copiado al portapapeles.");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-4 sm:max-w-2xl">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge>{TIPO_LABEL[documento.tipo]}</Badge>
            <Badge variant="outline">v{documento.version}</Badge>
          </div>
          <SheetTitle>{documento.titulo}</SheetTitle>
          <SheetDescription>
            Copy-paste listo para usar. Editalo acá si querés ajustar algo antes de aplicar.
          </SheetDescription>
        </SheetHeader>

        <Textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          className="min-h-96 flex-1 font-mono text-sm"
        />

        <SheetFooter className="flex-row flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={handleCopiar} className="gap-1.5">
            <Copy className="size-4" aria-hidden="true" />
            Copiar
          </Button>
          <Link
            href={`/imprimir/${documento.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-input px-2.5 text-sm font-medium hover:bg-muted"
          >
            <Download className="size-4" aria-hidden="true" />
            Descargar PDF
          </Link>
          <Button onClick={handleGuardar} disabled={!editado || guardando}>
            {guardando ? "Guardando…" : "Guardar cambios"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
