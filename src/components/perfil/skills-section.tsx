"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import {
  actualizarSkillAction,
  agregarSkillAction,
  eliminarSkillAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Nivel } from "@/lib/perfil/persistencia";

export type Skill = {
  id: string;
  nombre: string;
  nivel: Nivel | null;
  categoria: string | null;
};

const NIVELES: { value: Nivel; label: string }[] = [
  { value: "basico", label: "Básico" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
];

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const [agregando, setAgregando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [nivel, setNivel] = useState<Nivel>("intermedio");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAgregar() {
    if (!nombre.trim()) return;
    setGuardando(true);
    setError(null);
    const resultado = await agregarSkillAction({ nombre: nombre.trim(), nivel });
    setGuardando(false);
    if (resultado.error) {
      setError(resultado.error);
      return;
    }
    setNombre("");
    setNivel("intermedio");
    setAgregando(false);
  }

  async function handleCambiarNivel(id: string, nuevoNivel: Nivel) {
    const resultado = await actualizarSkillAction(id, { nivel: nuevoNivel });
    if (resultado.error) toast.error(resultado.error);
  }

  async function handleEliminar(id: string) {
    const resultado = await eliminarSkillAction(id);
    if (resultado.error) toast.error(resultado.error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Skills</CardTitle>
        <CardDescription>Técnicas, blandas, idiomas o herramientas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.length === 0 && !agregando && (
          <p className="text-sm text-muted-foreground">Todavía no cargaste ninguna.</p>
        )}
        {skills.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li
                key={skill.id}
                className="flex items-center gap-1.5 rounded-full border py-1 pr-1.5 pl-3"
              >
                <span className="text-sm">{skill.nombre}</span>
                <Select
                  value={skill.nivel ?? "intermedio"}
                  onValueChange={(v) => void handleCambiarNivel(skill.id, v as Nivel)}
                >
                  <SelectTrigger size="sm" className="h-6 border-none bg-transparent px-1.5 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NIVELES.map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        {n.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => void handleEliminar(skill.id)}
                  aria-label={`Borrar ${skill.nombre}`}
                >
                  <X className="size-3" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        )}

        {agregando ? (
          <div className="flex flex-wrap items-end gap-2 rounded-lg border p-3">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium" htmlFor="skill-nombre">
                Skill
              </label>
              <Input
                id="skill-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. SQL"
                className="h-9"
              />
            </div>
            <Select value={nivel} onValueChange={(v) => setNivel(v as Nivel)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NIVELES.map((n) => (
                  <SelectItem key={n.value} value={n.value}>
                    {n.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleAgregar} disabled={guardando || !nombre.trim()}>
              {guardando ? "Guardando…" : "Agregar"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setAgregando(false);
                setNombre("");
                setError(null);
              }}
            >
              Cancelar
            </Button>
            {error && (
              <p role="alert" className="w-full text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
        ) : (
          <Button variant="outline" onClick={() => setAgregando(true)} className="gap-1.5">
            <Plus className="size-4" aria-hidden="true" />
            Agregar skill
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
