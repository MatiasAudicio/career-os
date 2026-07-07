"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2, Send, Sparkles } from "lucide-react";

import { ConfigRequerida } from "@/components/chat/config-requerida";
import { MicButton } from "@/components/chat/mic-button";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { loadAiConfig } from "@/lib/ai/config-storage";
import { getOrCreateSession, saveMessage } from "@/lib/chat/persist";
import { cn } from "@/lib/utils";

// Chat de onboarding: mismo molde que ChatConversation (src/components/chat/
// chat-view.tsx) pero apunta a /api/onboarding y no tiene selector de agente.
// Cada vez que el asistente termina de responder, refresca la página para
// que las secciones de perfil (debajo, en perfil-view.tsx) muestren los
// datos recién guardados por las tools sin que el usuario recargue a mano.
export function OnboardingChat() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [cargando, setCargando] = useState(true);
  const [configurado, setConfigurado] = useState(true);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/onboarding",
      body: () => {
        const config = loadAiConfig();
        return {
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
      router.refresh();
    },
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage no existe en SSR, hay que leerlo tras montar
    setConfigurado(Boolean(loadAiConfig()?.apiKey));
  }, []);

  useEffect(() => {
    let cancelado = false;
    getOrCreateSession("onboarding").then(({ sessionId: id, initialMessages }) => {
      if (cancelado) return;
      setSessionId(id);
      setMessages(initialMessages);
      setCargando(false);
    });
    return () => {
      cancelado = true;
    };
  }, [setMessages]);

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
    return <ConfigRequerida />;
  }

  return (
    <div className="flex h-[28rem] min-h-0 flex-col overflow-hidden rounded-xl border">
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
              Contame quién sos y qué estás buscando — escribí o dictá tu
              primer mensaje.
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
          placeholder="Escribí o dictá tu respuesta…"
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
