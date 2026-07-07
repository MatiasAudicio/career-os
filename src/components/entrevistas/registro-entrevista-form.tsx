"use client";

import { useState } from "react";

import {
  actualizarEntrevistaAction,
  agregarEntrevistaAction,
} from "@/app/(app)/entrevistas/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TIPOS_ENTREVISTA, type TipoEntrevista } from "@/lib/entrevistas/tipos";

export type VacanteOpcion = { id: string; empresa: string; rol: string };

type Valores = {
  tipo: TipoEntrevista;
  fecha: string;
  applicationId: string;
  resultado: string;
  lecciones: string;
};

const SIN_VACANTE = "sin-vacante";

// Un mismo formulario sirve para guardar el cierre de un simulacro (tipo
// prellenado) y para registrar a mano una entrevista real ya tenida, o para
// editar un registro existente (entrevistaId presente).
export function RegistroEntrevistaForm({
  vacantes,
  valoresIniciales,
  entrevistaId,
  onGuardado,
  onCancelar,
}: {
  vacantes: VacanteOpcion[];
  valoresIniciales?: Partial<Valores>;
  entrevistaId?: string;
  onGuardado: () => void;
  onCancelar: () => void;
}) {
  const [valores, setValores] = useState<Valores>({
    tipo: valoresIniciales?.tipo ?? "hr",
    fecha: valoresIniciales?.fecha ?? new Date().toISOString().slice(0, 10),
    applicationId: valoresIniciales?.applicationId ?? "",
    resultado: valoresIniciales?.resultado ?? "",
    lecciones: valoresIniciales?.lecciones ?? "",
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGuardar() {
    setGuardando(true);
    setError(null);
    const datos = {
      tipo: valores.tipo,
      fecha: valores.fecha,
      applicationId: valores.applicationId || undefined,
      resultado: valores.resultado.trim() || undefined,
      lecciones: valores.lecciones.trim() || undefined,
    };
    const resultado = entrevistaId
      ? await actualizarEntrevistaAction(entrevistaId, datos)
      : await agregarEntrevistaAction(datos);
    setGuardando(false);
    if (resultado.error) {
      setError(resultado.error);
      return;
    }
    onGuardado();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {entrevistaId ? "Editar entrevista" : "Registrar entrevista"}
        </CardTitle>
        <CardDescription>
          Cargá el resultado y lo que aprendiste — te sirve para la próxima.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select
              value={valores.tipo}
              onValueChange={(v) => setValores({ ...valores, tipo: v as TipoEntrevista })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_ENTREVISTA.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="entrevista-fecha">Fecha</Label>
            <Input
              id="entrevista-fecha"
              type="date"
              value={valores.fecha}
              onChange={(e) => setValores({ ...valores, fecha: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Vacante (opcional)</Label>
            <Select
              value={valores.applicationId || SIN_VACANTE}
              onValueChange={(v) =>
                setValores({ ...valores, applicationId: v && v !== SIN_VACANTE ? v : "" })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SIN_VACANTE}>Ninguna</SelectItem>
                {vacantes.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.rol} en {v.empresa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="entrevista-resultado">Resultado</Label>
          <Textarea
            id="entrevista-resultado"
            value={valores.resultado}
            onChange={(e) => setValores({ ...valores, resultado: e.target.value })}
            placeholder="Cómo te fue, en general"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="entrevista-lecciones">Lecciones</Label>
          <Textarea
            id="entrevista-lecciones"
            value={valores.lecciones}
            onChange={(e) => setValores({ ...valores, lecciones: e.target.value })}
            placeholder="Qué mejorarías para la próxima"
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <Button onClick={handleGuardar} disabled={guardando}>
            {guardando ? "Guardando…" : "Guardar"}
          </Button>
          <Button variant="ghost" onClick={onCancelar}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
