"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import {
  actualizarProyectoAction,
  agregarProyectoAction,
  eliminarProyectoAction,
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

export type Proyecto = {
  id: string;
  nombre: string;
  descripcion: string | null;
  url: string | null;
  tecnologias: string[];
};

type FormProyecto = {
  nombre: string;
  descripcion: string;
  url: string;
  tecnologias: string;
};

const FORM_VACIO: FormProyecto = { nombre: "", descripcion: "", url: "", tecnologias: "" };

function aArray(tecnologias: string): string[] {
  return tecnologias
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function ProyectosSection({ proyectos }: { proyectos: Proyecto[] }) {
  const [agregando, setAgregando] = useState(false);
  const [form, setForm] = useState<FormProyecto>(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  async function handleAgregar() {
    if (!form.nombre.trim()) return;
    setGuardando(true);
    setError(null);
    const resultado = await agregarProyectoAction({
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || undefined,
      url: form.url.trim() || undefined,
      tecnologias: aArray(form.tecnologias),
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
    const resultado = await eliminarProyectoAction(id);
    if (resultado.error) toast.error(resultado.error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Proyectos</CardTitle>
        <CardDescription>Personales o de portfolio que quieras destacar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {proyectos.length === 0 && !agregando && (
          <p className="text-sm text-muted-foreground">Todavía no cargaste ninguno.</p>
        )}
        {proyectos.length > 0 && (
          <ul className="space-y-3">
            {proyectos.map((proyecto) =>
              editandoId === proyecto.id ? (
                <li key={proyecto.id} className="rounded-lg border p-3">
                  <ProyectoEditForm
                    proyecto={proyecto}
                    onCancelar={() => setEditandoId(null)}
                    onGuardado={() => setEditandoId(null)}
                  />
                </li>
              ) : (
                <li
                  key={proyecto.id}
                  className="flex items-start justify-between gap-3 rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{proyecto.nombre}</p>
                    {proyecto.descripcion && (
                      <p className="mt-1 text-sm text-muted-foreground">{proyecto.descripcion}</p>
                    )}
                    {proyecto.tecnologias.length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {proyecto.tecnologias.join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditandoId(proyecto.id)}
                      aria-label="Editar proyecto"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => void handleEliminar(proyecto.id)}
                      aria-label="Borrar proyecto"
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
                <Label htmlFor="proy-nombre">Nombre</Label>
                <Input
                  id="proy-nombre"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="proy-url">URL</Label>
                <Input
                  id="proy-url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proy-descripcion">Descripción</Label>
              <Textarea
                id="proy-descripcion"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proy-tecnologias">Tecnologías</Label>
              <Input
                id="proy-tecnologias"
                value={form.tecnologias}
                onChange={(e) => setForm({ ...form, tecnologias: e.target.value })}
                placeholder="React, Supabase, Tailwind"
              />
              <p className="text-sm text-muted-foreground">Separadas por coma.</p>
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="flex gap-2">
              <Button onClick={handleAgregar} disabled={guardando || !form.nombre.trim()}>
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
            Agregar proyecto
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function ProyectoEditForm({
  proyecto,
  onCancelar,
  onGuardado,
}: {
  proyecto: Proyecto;
  onCancelar: () => void;
  onGuardado: () => void;
}) {
  const [form, setForm] = useState<FormProyecto>({
    nombre: proyecto.nombre,
    descripcion: proyecto.descripcion ?? "",
    url: proyecto.url ?? "",
    tecnologias: proyecto.tecnologias.join(", "),
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGuardar() {
    setGuardando(true);
    setError(null);
    const resultado = await actualizarProyectoAction(proyecto.id, {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || undefined,
      url: form.url.trim() || undefined,
      tecnologias: aArray(form.tecnologias),
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
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          aria-label="Nombre"
        />
        <Input
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          aria-label="URL"
        />
      </div>
      <Textarea
        value={form.descripcion}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        aria-label="Descripción"
      />
      <Input
        value={form.tecnologias}
        onChange={(e) => setForm({ ...form, tecnologias: e.target.value })}
        aria-label="Tecnologías"
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
