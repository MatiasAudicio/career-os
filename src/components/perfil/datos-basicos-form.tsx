"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { guardarDatosBasicosAction } from "@/app/(app)/perfil/actions";
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

type Perfil = {
  nombre: string | null;
  ubicacion: string | null;
  objetivo: string | null;
  resumen: string | null;
  idiomas: string[] | null;
};

export function DatosBasicosForm({ perfil }: { perfil: Perfil | null }) {
  const [nombre, setNombre] = useState(perfil?.nombre ?? "");
  const [ubicacion, setUbicacion] = useState(perfil?.ubicacion ?? "");
  const [objetivo, setObjetivo] = useState(perfil?.objetivo ?? "");
  const [resumen, setResumen] = useState(perfil?.resumen ?? "");
  const [idiomas, setIdiomas] = useState((perfil?.idiomas ?? []).join(", "));
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGuardar() {
    setGuardando(true);
    setError(null);
    const resultado = await guardarDatosBasicosAction({
      nombre: nombre.trim() || undefined,
      ubicacion: ubicacion.trim() || undefined,
      objetivo: objetivo.trim() || undefined,
      resumen: resumen.trim() || undefined,
      idiomas: idiomas
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
    });
    setGuardando(false);
    if (resultado.error) {
      setError(resultado.error);
      return;
    }
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Datos básicos</CardTitle>
        <CardDescription>
          Quién sos, dónde estás y qué rol estás buscando.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="h-11 text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicación</Label>
            <Input
              id="ubicacion"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="h-11 text-base"
              placeholder="Ciudad, país"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="objetivo">Objetivo de búsqueda</Label>
          <Input
            id="objetivo"
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            className="h-11 text-base"
            placeholder="Qué rol buscás y en qué plazo"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resumen">Sobre vos</Label>
          <Textarea
            id="resumen"
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            className="min-h-24 text-base"
            placeholder="En tus palabras: quién sos, qué te trajo hasta acá"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="idiomas">Idiomas</Label>
          <Input
            id="idiomas"
            value={idiomas}
            onChange={(e) => setIdiomas(e.target.value)}
            className="h-11 text-base"
            placeholder="Español nativo, Inglés intermedio"
          />
          <p className="text-sm text-muted-foreground">Separados por coma.</p>
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button onClick={handleGuardar} disabled={guardando} className="gap-2">
          {guardado ? (
            <>
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Guardado
            </>
          ) : guardando ? (
            "Guardando…"
          ) : (
            "Guardar"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
