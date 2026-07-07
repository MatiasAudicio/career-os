"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { eliminarDocumentoAction } from "@/app/(app)/documentos/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentoSheet, TIPO_LABEL, type Documento } from "@/components/documentos/documento-sheet";

export type DocumentoConVacante = Documento & {
  created_at: string;
  applications: { empresa: string; rol: string } | null;
};

export function DocumentosView({ documentos: documentosIniciales }: { documentos: DocumentoConVacante[] }) {
  const [documentos, setDocumentos] = useState(documentosIniciales);
  const [documentoAbierto, setDocumentoAbierto] = useState<DocumentoConVacante | null>(null);

  async function handleBorrar(id: string) {
    const resultado = await eliminarDocumentoAction(id);
    if (resultado.error) {
      toast.error(resultado.error);
      return;
    }
    setDocumentos((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Documentos</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Tus CVs y cartas, uno por vacante, siempre guardados y listos para
          copiar o descargar.
        </p>
      </div>

      {documentos.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Todavía no generaste ningún documento — hacelo desde una vacante en{" "}
          <Link href="/vacantes" className="text-primary underline-offset-4 hover:underline">
            Vacantes
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-3">
          {documentos.map((documento) => (
            <Card key={documento.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge>{TIPO_LABEL[documento.tipo]}</Badge>
                    <Badge variant="outline">v{documento.version}</Badge>
                  </div>
                  <p className="mt-1 font-medium">{documento.titulo}</p>
                  {documento.applications && (
                    <p className="text-sm text-muted-foreground">
                      {documento.applications.rol} en {documento.applications.empresa}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setDocumentoAbierto(documento)}>
                    Abrir
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => void handleBorrar(documento.id)}
                    aria-label="Borrar documento"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DocumentoSheet
        documento={documentoAbierto}
        open={documentoAbierto !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setDocumentoAbierto(null);
        }}
      />
    </div>
  );
}
