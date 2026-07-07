"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, FileText, Mail, Plus } from "lucide-react";
import { toast } from "sonner";

import { cambiarEstadoAction } from "@/app/(app)/vacantes/actions";
import { ConfigRequerida } from "@/components/chat/config-requerida";
import { DocumentoSheet, type Documento } from "@/components/documentos/documento-sheet";
import { Badge } from "@/components/ui/badge";
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
import { PipelineStrip } from "@/components/vacantes/pipeline-strip";
import { loadAiConfig } from "@/lib/ai/config-storage";
import { ESTADOS, contarPorEstado, type Estado } from "@/lib/vacantes/pipeline";
import type { TipoDocumento } from "@/lib/documentos/generar";

type Decision = "aplicar" | "despues" | "ignorar";

export type Vacante = {
  id: string;
  empresa: string;
  rol: string;
  url: string | null;
  fuente: string | null;
  descripcion: string | null;
  estado: Estado;
  decision: Decision | null;
  match_pct: number | null;
  match_justificacion: string | null;
  fecha_aplicacion: string | null;
};

const DECISION_LABEL: Record<Decision, string> = {
  aplicar: "APLICAR",
  despues: "DESPUÉS",
  ignorar: "IGNORAR",
};

const DECISION_VARIANTE: Record<Decision, "success" | "warning" | "outline"> = {
  aplicar: "success",
  despues: "warning",
  ignorar: "outline",
};

function varianteMatch(pct: number | null): "success" | "warning" | "destructive" | "outline" {
  if (pct === null) return "outline";
  if (pct >= 70) return "success";
  if (pct >= 40) return "warning";
  return "destructive";
}

type FormVacante = {
  empresa: string;
  rol: string;
  url: string;
  fuente: string;
  descripcion: string;
};

const FORM_VACIO: FormVacante = { empresa: "", rol: "", url: "", fuente: "", descripcion: "" };

export function VacantesView({ vacantesIniciales }: { vacantesIniciales: Vacante[] }) {
  const [vacantes, setVacantes] = useState(vacantesIniciales);
  const [form, setForm] = useState<FormVacante>(FORM_VACIO);
  const [analizando, setAnalizando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configurado, setConfigurado] = useState(true);
  const [documentoAbierto, setDocumentoAbierto] = useState<Documento | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage no existe en SSR, hay que leerlo tras montar
    setConfigurado(Boolean(loadAiConfig()?.apiKey));
  }, []);

  const conteo = useMemo(() => contarPorEstado(vacantes), [vacantes]);

  async function handleAnalizar() {
    if (!form.empresa.trim() || !form.rol.trim() || !form.descripcion.trim()) return;
    const config = loadAiConfig();
    setAnalizando(true);
    setError(null);
    try {
      const res = await fetch("/api/vacantes/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa: form.empresa.trim(),
          rol: form.rol.trim(),
          url: form.url.trim() || undefined,
          fuente: form.fuente.trim() || undefined,
          descripcion: form.descripcion.trim(),
          provider: config?.provider,
          apiKey: config?.apiKey,
          model: config?.model,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo analizar la vacante.");
        return;
      }
      setVacantes((prev) => [data.vacante as Vacante, ...prev]);
      setForm(FORM_VACIO);
    } catch {
      setError("No se pudo conectar con el servidor. Probá de nuevo.");
    } finally {
      setAnalizando(false);
    }
  }

  async function handleCambiarEstado(id: string, estado: Estado) {
    const vacanteActual = vacantes.find((v) => v.id === id);
    const fechaAplicacion =
      estado !== "guardada" && !vacanteActual?.fecha_aplicacion
        ? new Date().toISOString().slice(0, 10)
        : undefined;

    const resultado = await cambiarEstadoAction(id, estado, fechaAplicacion);
    if (resultado.error) {
      toast.error(resultado.error);
      return;
    }
    setVacantes((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, estado, fecha_aplicacion: fechaAplicacion ?? v.fecha_aplicacion }
          : v,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Vacantes</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Pegá el texto de una vacante y te decimos, con honestidad, qué tan
          compatible sos.
        </p>
      </div>

      <PipelineStrip conteo={conteo} />

      {!configurado ? (
        <ConfigRequerida />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agregar vacante</CardTitle>
            <CardDescription>
              Pegá el texto completo del aviso — cuanto más contexto, mejor el
              análisis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="vac-empresa">Empresa</Label>
                <Input
                  id="vac-empresa"
                  value={form.empresa}
                  onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                  className="h-11 text-base"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vac-rol">Rol</Label>
                <Input
                  id="vac-rol"
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  className="h-11 text-base"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vac-url">URL (opcional)</Label>
                <Input
                  id="vac-url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="h-11 text-base"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vac-fuente">Fuente (opcional)</Label>
                <Input
                  id="vac-fuente"
                  value={form.fuente}
                  onChange={(e) => setForm({ ...form, fuente: e.target.value })}
                  className="h-11 text-base"
                  placeholder="LinkedIn, referido, web de la empresa…"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vac-descripcion">Texto de la vacante</Label>
              <Textarea
                id="vac-descripcion"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="min-h-32 text-base"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button
              onClick={handleAnalizar}
              disabled={
                analizando ||
                !form.empresa.trim() ||
                !form.rol.trim() ||
                !form.descripcion.trim()
              }
              className="gap-1.5"
            >
              {analizando ? (
                "Analizando…"
              ) : (
                <>
                  <Plus className="size-4" aria-hidden="true" />
                  Analizar vacante
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {vacantes.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no cargaste ninguna vacante.</p>
      ) : (
        <div className="space-y-3">
          {vacantes.map((vacante) => (
            <VacanteCard
              key={vacante.id}
              vacante={vacante}
              onCambiarEstado={(estado) => void handleCambiarEstado(vacante.id, estado)}
              onDocumentoGenerado={setDocumentoAbierto}
            />
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

function VacanteCard({
  vacante,
  onCambiarEstado,
  onDocumentoGenerado,
}: {
  vacante: Vacante;
  onCambiarEstado: (estado: Estado) => void;
  onDocumentoGenerado: (documento: Documento) => void;
}) {
  const [mostrarJustificacion, setMostrarJustificacion] = useState(false);
  const [generando, setGenerando] = useState<TipoDocumento | null>(null);

  async function handleGenerar(tipo: TipoDocumento) {
    const config = loadAiConfig();
    setGenerando(tipo);
    try {
      const res = await fetch("/api/documentos/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: vacante.id,
          tipo,
          provider: config?.provider,
          apiKey: config?.apiKey,
          model: config?.model,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo generar el documento.");
        return;
      }
      onDocumentoGenerado(data.documento as Documento);
    } catch {
      toast.error("No se pudo conectar con el servidor. Probá de nuevo.");
    } finally {
      setGenerando(null);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-medium">{vacante.rol}</p>
            <p className="text-sm text-muted-foreground">
              {vacante.empresa}
              {vacante.fuente ? ` · ${vacante.fuente}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {vacante.match_pct !== null && (
              <Badge variant={varianteMatch(vacante.match_pct)}>{vacante.match_pct}% match</Badge>
            )}
            {vacante.decision && (
              <Badge variant={DECISION_VARIANTE[vacante.decision]}>
                {DECISION_LABEL[vacante.decision]}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={vacante.estado} onValueChange={(v) => onCambiarEstado(v as Estado)}>
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {vacante.fecha_aplicacion && (
            <span className="text-xs text-muted-foreground">
              Aplicada el {vacante.fecha_aplicacion}
            </span>
          )}
          {vacante.url && (
            <a
              href={vacante.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary underline-offset-4 hover:underline"
            >
              Ver aviso
            </a>
          )}
        </div>

        {vacante.match_justificacion && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarJustificacion((v) => !v)}
              className="gap-1.5 px-0 text-muted-foreground hover:bg-transparent"
            >
              {mostrarJustificacion ? (
                <ChevronUp className="size-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="size-3.5" aria-hidden="true" />
              )}
              {mostrarJustificacion ? "Ocultar justificación" : "Ver justificación"}
            </Button>
            {mostrarJustificacion && (
              <p className="mt-2 text-sm whitespace-pre-wrap text-muted-foreground">
                {vacante.match_justificacion}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 border-t pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleGenerar("cv")}
            disabled={generando !== null}
            className="gap-1.5"
          >
            <FileText className="size-3.5" aria-hidden="true" />
            {generando === "cv" ? "Generando…" : "Generar CV"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleGenerar("carta")}
            disabled={generando !== null}
            className="gap-1.5"
          >
            <Mail className="size-3.5" aria-hidden="true" />
            {generando === "carta" ? "Generando…" : "Generar carta"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
