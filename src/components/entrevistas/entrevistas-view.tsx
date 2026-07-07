"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { eliminarEntrevistaAction } from "@/app/(app)/entrevistas/actions";
import {
  RegistroEntrevistaForm,
  type VacanteOpcion,
} from "@/components/entrevistas/registro-entrevista-form";
import { SimulacroChat } from "@/components/entrevistas/simulacro-chat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { labelTipoEntrevista, type TipoEntrevista } from "@/lib/entrevistas/tipos";

export type Entrevista = {
  id: string;
  tipo: TipoEntrevista;
  fecha: string | null;
  resultado: string | null;
  lecciones: string | null;
  applications: { empresa: string; rol: string } | null;
};

type EstadoFormulario = {
  entrevistaId?: string;
  valoresIniciales?: {
    tipo?: TipoEntrevista;
    fecha?: string;
    resultado?: string;
    lecciones?: string;
  };
};

export function EntrevistasView({
  entrevistas,
  vacantes,
}: {
  entrevistas: Entrevista[];
  vacantes: VacanteOpcion[];
}) {
  const router = useRouter();
  const [formulario, setFormulario] = useState<EstadoFormulario | null>(null);
  const [simulacroKey, setSimulacroKey] = useState(0);

  function handleGuardado() {
    setFormulario(null);
    setSimulacroKey((k) => k + 1);
    router.refresh();
  }

  async function handleBorrar(id: string) {
    const resultado = await eliminarEntrevistaAction(id);
    if (resultado.error) {
      toast.error(resultado.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Entrevistas</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Practicá con simulacros puntuados y llevá el registro de tus
          entrevistas reales.
        </p>
      </div>

      <SimulacroChat
        key={simulacroKey}
        onTerminar={(tipo) => setFormulario({ valoresIniciales: { tipo } })}
      />

      {formulario ? (
        <RegistroEntrevistaForm
          vacantes={vacantes}
          valoresIniciales={formulario.valoresIniciales}
          entrevistaId={formulario.entrevistaId}
          onGuardado={handleGuardado}
          onCancelar={() => setFormulario(null)}
        />
      ) : (
        <Button variant="outline" onClick={() => setFormulario({})} className="gap-1.5">
          <Plus className="size-4" aria-hidden="true" />
          Registrar entrevista
        </Button>
      )}

      {entrevistas.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Todavía no registraste ninguna entrevista.
        </p>
      ) : (
        <div className="space-y-3">
          {entrevistas.map((entrevista) => (
            <Card key={entrevista.id}>
              <CardContent className="space-y-2 pt-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge>{labelTipoEntrevista(entrevista.tipo)}</Badge>
                      {entrevista.fecha && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(entrevista.fecha).toLocaleDateString("es-AR")}
                        </span>
                      )}
                    </div>
                    {entrevista.applications && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {entrevista.applications.rol} en {entrevista.applications.empresa}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        setFormulario({
                          entrevistaId: entrevista.id,
                          valoresIniciales: {
                            tipo: entrevista.tipo,
                            fecha: entrevista.fecha?.slice(0, 10),
                            resultado: entrevista.resultado ?? "",
                            lecciones: entrevista.lecciones ?? "",
                          },
                        })
                      }
                      aria-label="Editar entrevista"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => void handleBorrar(entrevista.id)}
                      aria-label="Borrar entrevista"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
                {entrevista.resultado && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Resultado: </span>
                    {entrevista.resultado}
                  </p>
                )}
                {entrevista.lecciones && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Lecciones: </span>
                    {entrevista.lecciones}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
