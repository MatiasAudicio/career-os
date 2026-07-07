import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { NextResponse } from "next/server";

import { buildSystemPrompt, type AgentId } from "@/lib/agents";
import { buildProfileContext } from "@/lib/agents/context";
import { getModel } from "@/lib/ai/get-model";
import type { ProviderId } from "@/lib/ai/providers";

export const maxDuration = 30;

type ChatRequestBody = {
  messages: UIMessage[];
  agentId: AgentId;
  provider: ProviderId;
  apiKey: string;
  model: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequestBody;
  const { messages, agentId, provider, apiKey, model } = body;

  if (!apiKey || !model || !provider) {
    return NextResponse.json(
      { error: "Falta configurar tu proveedor de IA en Ajustes." },
      { status: 400 },
    );
  }

  const profileContext = await buildProfileContext();
  const system = buildSystemPrompt(agentId, profileContext);

  let languageModel;
  try {
    languageModel = getModel(provider, apiKey, model);
  } catch {
    return NextResponse.json(
      { error: "No reconocemos ese proveedor de IA." },
      { status: 400 },
    );
  }

  const result = streamText({
    model: languageModel,
    system,
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: humanizeError,
    }),
  });
}

function humanizeError(error: unknown): string {
  const mensaje = error instanceof Error ? error.message : String(error);

  if (/401|invalid.?api.?key|unauthorized/i.test(mensaje)) {
    return "Tu clave de IA no es válida o venció. Revisala en Ajustes.";
  }
  if (/429|rate.?limit/i.test(mensaje)) {
    return "Alcanzaste el límite de uso de tu proveedor de IA. Esperá un momento y probá de nuevo.";
  }
  if (/credit|balance|insufficient|quota/i.test(mensaje)) {
    return "Tu cuenta en ese proveedor de IA no tiene crédito disponible.";
  }
  return "Hubo un error al conectar con tu proveedor de IA. Probá de nuevo en unos segundos.";
}
