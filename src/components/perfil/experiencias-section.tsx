"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import {
  actualizarExperienciaAction,
  agregarExperienciaAction,
  eliminarExperienciaAction,
} from "@/app/(app)/perfil/actions";
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
import { Textarea } from "@/components/ui/textarea";

export type Experiencia = {
  id: string;
  titulo: string;
  organizacion: string | null;
  desde: string | null;
  hasta: string | null;
  descripcion: string | null;
};

type FormExperiencia = {
  titulo: string;
  organizacion: string;
  desde: string;
  hasta: string;
  descripcion: string;
};

const FORM_VACIO: FormExperiencia = {
  titulo: "",
  organizacion: "",
  desde: "",
  hasta: "",
  descripcion: "",
};

export function ExperienciasSection({ experiencias }: { experiencias: Experiencia[] }) {
  const [agregando, setAgregando] = useState(false);
  const [form, setForm] = useState<FormExperiencia>(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  async function handleAgregar() {
    if (!form.titulo.trim()) return;
    setGuardando(true);
    setError(null);
    const resultado = await agregarExperienciaAction({
      titulo: form.titulo.trim(),
      organizacion: form.organizacion.trim() || undefined,
      desde: form.desde || undefined,
      hasta: form.hasta || undefined,
      descripcion: form.descripcion.trim() || undefined,
    });
    setGuardando(false);
    if (resultado.error) {
      setError(resultado.error);
      return;
    }
    setForm(FORM_VACIO);
    setAgregando(false);
  }

  async function handleEliminar(id: string) {
    const resultado = await eliminarExperienciaAction(id);
    if (resultado.error) toast.error(resultado.error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Experiencia</CardTitle>
        <CardDescription>Laboral o formativa — la que quieras mostrar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {experiencias.length === 0 && !agregando && (
          <p className="text-sm text-muted-foreground">Todavía no cargaste ninguna.</p>
        )}
        {experiencias.length > 0 && (
          <ul className="space-y-3">
            {experiencias.map((exp) =>
              editandoId === exp.id ? (
                <li key={exp.id} className="rounded-lg border p-3">
                  <ExperienciaEditForm
                    experiencia={exp}
                    onCancelar={() => setEditandoId(null)}
                    onGuardado={() => setEditandoId(null)}
                  />
                </li>
              ) : (
                <li key={exp.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{exp.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {[exp.organizacion, `${exp.desde ?? "?"} – ${exp.hasta ?? "actual"}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {exp.descripcion && (
                      <p className="mt-1 text-sm text-muted-foreground">{exp.descripcion}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditandoId(exp.id)}
                      aria-label="Editar experiencia"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => void handleEliminar(exp.id)}
                      aria-label="Borrar experiencia"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              ),
            )}
          </ul>
        )}

        {agregando ? (
          <div className="space-y-3 rounded-lg border p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="exp-titulo">Título</Label>
                <Input
                  id="exp-titulo"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exp-organizacion">Organización</Label>
                <Input
                  id="exp-organizacion"
                  value={form.organizacion}
                  onChange={(e) => setForm({ ...form, organizacion: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exp-desde">Desde</Label>
                <Input
                  id="exp-desde"
                  type="date"
                  value={form.desde}
                  onChange={(e) => setForm({ ...form, desde: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exp-hasta">Hasta (vacío = actual)</Label>
                <Input
                  id="exp-hasta"
                  type="date"
                  value={form.hasta}
                  onChange={(e) => setForm({ ...form, hasta: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="exp-descripcion">Descripción</Label>
              <Textarea
                id="exp-descripcion"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="flex gap-2">
              <Button onClick={handleAgregar} disabled={guardando || !form.titulo.trim()}>
                {guardando ? "Guardando…" : "Agregar"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setAgregando(false);
                  setForm(FORM_VACIO);
                  setError(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setAgregando(true)} className="gap-1.5">
            <Plus className="size-4" aria-hidden="true" />
            Agregar experiencia
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function ExperienciaEditForm({
  experiencia,
  onCancelar,
  onGuardado,
}: {
  experiencia: Experiencia;
  onCancelar: () => void;
  onGuardado: () => void;
}) {
  const [form, setForm] = useState<FormExperiencia>({
    titulo: experiencia.titulo,
    organizacion: experiencia.organizacion ?? "",
    desde: experiencia.desde ?? "",
    hasta: experiencia.hasta ?? "",
    descripcion: experiencia.descripcion ?? "",
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGuardar() {
    setGuardando(true);
    setError(null);
    const resultado = await actualizarExperienciaAction(experiencia.id, {
      titulo: form.titulo.trim(),
      organizacion: form.organizacion.trim() || undefined,
      desde: form.desde || undefined,
      hasta: form.hasta || undefined,
      descripcion: form.descripcion.trim() || undefined,
    });
    setGuardando(false);
    if (resultado.error) {
      setError(resultado.error);
      return;
    }
    onGuardado();
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          aria-label="Título"
        />
        <Input
          value={form.organizacion}
          onChange={(e) => setForm({ ...form, organizacion: e.target.value })}
          aria-label="Organización"
        />
        <Input
          type="date"
          value={form.desde}
          onChange={(e) => setForm({ ...form, desde: e.target.value })}
          aria-label="Desde"
        />
        <Input
          type="date"
          value={form.hasta}
          onChange={(e) => setForm({ ...form, hasta: e.target.value })}
          aria-label="Hasta"
        />
      </div>
      <Textarea
        value={form.descripcion}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        aria-label="Descripción"
      />
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <Button size="sm" onClick={handleGuardar} disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar"}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancelar} className="gap-1.5">
          <X className="size-3.5" aria-hidden="true" />
          Cancelar
        </Button>
      </div>
    </div>
  );
}
