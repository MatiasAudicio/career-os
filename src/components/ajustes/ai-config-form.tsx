"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, KeyRound, Trash2 } from "lucide-react";

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
import {
  clearAiConfig,
  defaultAiConfig,
  loadAiConfig,
  saveAiConfig,
  type AiConfig,
} from "@/lib/ai/config-storage";
import { getProvider, PROVIDERS, type ProviderId } from "@/lib/ai/providers";

export function AiConfigForm() {
  const [config, setConfig] = useState<AiConfig>(defaultAiConfig("anthropic"));
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const existente = loadAiConfig();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage no existe en SSR, hay que leerlo tras montar
    if (existente) setConfig(existente);
  }, []);

  function handleProviderChange(provider: ProviderId) {
    setConfig({ ...defaultAiConfig(provider) });
    setGuardado(false);
  }

  function handleGuardar() {
    saveAiConfig(config);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  }

  function handleBorrar() {
    clearAiConfig();
    setConfig(defaultAiConfig(config.provider));
    setGuardado(false);
  }

  const info = getProvider(config.provider);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <KeyRound className="size-4 text-primary" aria-hidden="true" />
          Tu asistente de IA
        </CardTitle>
        <CardDescription className="text-base">
          Elegí con qué IA querés que converse el equipo de Career OS. Tu
          clave se guarda solo en este navegador — nunca en nuestros
          servidores.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="provider">Proveedor</Label>
          <Select
            value={config.provider}
            onValueChange={(value) => handleProviderChange(value as ProviderId)}
          >
            <SelectTrigger id="provider" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROVIDERS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">{info.nivelGratuito}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="apiKey">Tu clave de API</Label>
          <Input
            id="apiKey"
            type="password"
            autoComplete="off"
            placeholder="pegá tu clave acá"
            value={config.apiKey}
            onChange={(e) => {
              setConfig({ ...config, apiKey: e.target.value });
              setGuardado(false);
            }}
            className="h-11 text-base"
          />
          <p className="text-sm text-muted-foreground">
            Se consigue en {info.dondeConseguirLaKey}.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          <Input
            id="model"
            value={config.model}
            onChange={(e) => {
              setConfig({ ...config, model: e.target.value });
              setGuardado(false);
            }}
            className="h-11 text-base font-mono text-sm"
          />
          <p className="text-sm text-muted-foreground">
            Ya viene con un modelo recomendado — cambialo si tu cuenta usa
            otro.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            onClick={handleGuardar}
            disabled={!config.apiKey.trim()}
            className="gap-2"
          >
            {guardado ? (
              <>
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Guardado
              </>
            ) : (
              "Guardar"
            )}
          </Button>
          <Button variant="ghost" onClick={handleBorrar} className="gap-2">
            <Trash2 className="size-4" aria-hidden="true" />
            Borrar clave guardada
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
