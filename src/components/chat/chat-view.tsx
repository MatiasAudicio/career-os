"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2, Send, Sparkles } from "lucide-react";

import { MicButton } from "@/components/chat/mic-button";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { listAgents, type AgentId } from "@/lib/agents";
import { loadAiConfig } from "@/lib/ai/config-storage";
import { getOrCreateSession, saveMessage } from "@/lib/chat/persist";
import { cn } from "@/lib/utils";

const AGENTES = listAgents();

export function ChatView() {
  const [agentId, setAgentId] = useState<AgentId>(AGENTES[0].id);

  return (
    <div className="flex h-[calc(100dvh-9rem)] flex-col gap-4 lg:h-[calc(100dvh-5rem)]">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Chat</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Elegí con quién del equipo querés hablar.
        </p>
      </div>

      <Tabs value={agentId} onValueChange={(v) => setAgentId(v as AgentId)}>
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          {AGENTES.map((agente) => (
            <TabsTrigger
              key={agente.id}
              value={agente.id}
              className="rounded-full border border-border px-3 py-1.5 text-sm data-[selected]:border-primary/30 data-[selected]:bg-accent data-[selected]:text-accent-foreground"
            >
              {agente.nombre}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ChatConversation key={agentId} agentId={agentId} />
    </div>
  );
}

function ChatConversation({ agentId }: { agentId: AgentId }) {
  const agente = AGENTES.find((a) => a.id === agentId) ?? AGENTES[0];
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [cargando, setCargando] = useState(true);
  const [configurado, setConfigurado] = useState(true);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => {
        const config = loadAiConfig();
        return {
          agentId,
          provider: config?.provider,
          apiKey: config?.apiKey,
          model: config?.model,
        };
      },
    }),
    onFinish: ({ message }) => {
      const texto = message.parts
        .filter((parte) => parte.type === "text")
        .map((parte) => parte.text)
        .join("");
      if (texto) void saveMessage(sessionId, "assistant", texto);
    },
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage no existe en SSR, hay que leerlo tras montar
    setConfigurado(Boolean(loadAiConfig()?.apiKey));
  }, []);

  useEffect(() => {
    let cancelado = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- arranca la carga async de la sesion al cambiar de agente
    setCargando(true);
    getOrCreateSession(agentId).then(({ sessionId: id, initialMessages }) => {
      if (cancelado) return;
      setSessionId(id);
      setMessages(initialMessages);
      setCargando(false);
    });
    return () => {
      cancelado = true;
    };
  }, [agentId, setMessages]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const enviando = status === "submitted" || status === "streaming";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const texto = input.trim();
    if (!texto || enviando) return;
    sendMessage({ text: texto });
    void saveMessage(sessionId, "user", texto);
    setInput("");
  }

  if (!configurado) {
    return (
      <Card className="flex flex-1 items-center justify-center">
        <CardHeader className="items-center text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-accent">
            <Sparkles className="size-6 text-primary" aria-hidden="true" />
          </span>
          <CardTitle className="pt-2 text-lg">
            Falta conectar tu IA
          </CardTitle>
          <CardDescription className="mx-auto max-w-sm text-base">
            Elegí un proveedor y pegá tu clave en Ajustes — es gratis en la
            mayoría de las opciones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/ajustes" className={buttonVariants({ variant: "default" })}>
            Ir a Ajustes
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border">
      <ScrollArea className="min-h-0 flex-1 px-4 py-4">
        {cargando ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Cargando conversación…
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-accent">
              <Sparkles className="size-5 text-primary" aria-hidden="true" />
            </span>
            <p className="max-w-sm text-sm text-muted-foreground">
              {agente.descripcion} Escribí o dictá tu primer mensaje.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((mensaje) => (
              <div
                key={mensaje.id}
                className={cn(
                  "flex",
                  mensaje.role === "user" ? "justify-end" : "justify-start",
                )}
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
                    parte.type === "text" ? (
                      <span key={i}>{parte.text}</span>
                    ) : null,
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
        )}
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
          placeholder={`Escribile a ${agente.nombre.toLowerCase()}…`}
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
          aria-label="Enviar mensaje"
        >
          <Send className="size-4" aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}
