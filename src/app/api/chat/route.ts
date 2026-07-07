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
import { humanizeError } from "@/lib/ai/humanize-error";
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
