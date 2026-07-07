"use client";

import type { UIMessage } from "ai";

import { createClient } from "@/lib/supabase/client";

type SesionChat = {
  sessionId: string;
  initialMessages: UIMessage[];
};

// Reutiliza la última sesión de este agente si existe, o crea una nueva.
// Todo pasa por RLS: el usuario solo puede leer/escribir sus propias filas.
// agentId acepta cualquier string (no solo AgentId) porque la sesión de
// onboarding también pasa por acá con "onboarding" — la columna `agente` en
// Supabase es texto libre, sin constraint.
export async function getOrCreateSession(agentId: string): Promise<SesionChat> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { sessionId: "", initialMessages: [] };

  const { data: existente } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("agente", agentId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let sessionId = (existente?.id as string | undefined) ?? "";

  if (!sessionId) {
    const { data: creada } = await supabase
      .from("chat_sessions")
      .insert({ agente: agentId })
      .select("id")
      .single();
    sessionId = (creada?.id as string | undefined) ?? "";
  }

  if (!sessionId) return { sessionId: "", initialMessages: [] };

  const { data: filas } = await supabase
    .from("chat_messages")
    .select("id, rol, contenido")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  const initialMessages: UIMessage[] = (filas ?? []).map((fila) => ({
    id: fila.id as string,
    role: fila.rol as "user" | "assistant",
    parts: [{ type: "text", text: fila.contenido as string }],
  }));

  return { sessionId, initialMessages };
}

export async function saveMessage(
  sessionId: string,
  rol: "user" | "assistant",
  contenido: string,
): Promise<void> {
  if (!sessionId || !contenido) return;
  const supabase = createClient();
  await supabase.from("chat_messages").insert({ session_id: sessionId, rol, contenido });
  await supabase
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);
}
