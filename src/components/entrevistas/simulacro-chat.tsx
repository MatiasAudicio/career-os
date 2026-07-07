"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2, Send } from "lucide-react";

import { ConfigRequerida } from "@/components/chat/config-requerida";
import { MicButton } from "@/components/chat/mic-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { loadAiConfig } from "@/lib/ai/config-storage";
import { labelTipoEntrevista, TIPOS_ENTREVISTA, type TipoEntrevista } from "@/lib/entrevistas/tipos";
import { cn } from "@/lib/utils";

// A diferencia del chat de agentes y el de onboarding, este simulacro es
// efímero: no persiste la conversación (getOrCreateSession/saveMessage) —
// es una práctica en vivo, como una entrevista real. Solo se guarda el
// resumen que el usuario elige registrar al terminar (ver
// registro-entrevista-form.tsx).
export function SimulacroChat({ onTerminar }: { onTerminar: (tipo: TipoEntrevista) => void }) {
  const [tipo, setTipo] = useState<TipoEntrevista>("hr");
  const [iniciado, setIniciado] = useState(false);
  const [configurado, setConfigurado] = useState(true);
  const [input, setInput] = useState("");
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => {
        const config = loadAiConfig();
        return {
          agentId: "interview-coach",
          provider: config?.provider,
          apiKey: config?.apiKey,
          model: config?.model,
        };
      },
    }),
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage no existe en SSR, hay que leerlo tras montar
    setConfigurado(Boolean(loadAiConfig()?.apiKey));
  }, []);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  const enviando = status === "submitted" || status === "streaming";

  function handleEmpezar() {
    setIniciado(true);
    sendMessage({
      text: `Quiero practicar un simulacro de entrevista tipo ${labelTipoEntrevista(tipo)}. Arrancá cuando quieras.`,
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const texto = input.trim();
    if (!texto || enviando) return;
    sendMessage({ text: texto });
    setInput("");
  }

  if (!configurado) {
    return <ConfigRequerida />;
  }

  if (!iniciado) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Simulacro de entrevista</CardTitle>
          <CardDescription>
            Elegí el tipo y empezá — el entrenador toma la posta, una pregunta a
            la vez, y puntúa cada respuesta.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <Select value={tipo} onValueChange={(v) => setTipo(v as TipoEntrevista)}>
            <SelectTrigger className="w-48">
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
          <Button onClick={handleEmpezar}>Empezar simulacro</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex items-center justify-between gap-3 border-b">
        <div>
          <CardTitle className="text-lg">Simulacro — {labelTipoEntrevista(tipo)}</CardTitle>
          <CardDescription>
            En vivo, no se guarda la conversación — solo lo que registrés al
            terminar.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => onTerminar(tipo)} className="shrink-0">
          Terminar y guardar
        </Button>
      </CardHeader>
      <ScrollArea className="h-96 px-4 py-4">
        <div className="space-y-4">
          {messages.map((mensaje) => (
            <div
              key={mensaje.id}
              className={cn("flex", mensaje.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                  mensaje.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border bg-card",
                )}
              >
                {mensaje.parts.map((parte, i) =>
                  parte.type === "text" ? <span key={i}>{parte.text}</span> : null,
                )}
              </div>
            </div>
          ))}
          {enviando && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border bg-card px-4 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                Pensando…
              </div>
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error.message}
            </p>
          )}
          <div ref={scrollAnchorRef} />
        </div>
      </ScrollArea>
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 border-t bg-background/60 p-3"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Tu respuesta…"
          rows={1}
          className="max-h-32 min-h-11 flex-1 resize-none text-base"
        />
        <MicButton
          disabled={enviando}
          onResult={(texto) => setInput((prev) => (prev ? `${prev} ${texto}` : texto))}
        />
        <Button
          type="submit"
          size="icon"
          disabled={enviando || !input.trim()}
          aria-label="Enviar respuesta"
        >
          <Send className="size-4" aria-hidden="true" />
        </Button>
      </form>
    </Card>
  );
}
