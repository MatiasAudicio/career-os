import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { NextResponse } from "next/server";

import { ONBOARDING_SYSTEM_PROMPT } from "@/lib/agents/onboarding";
import { getModel } from "@/lib/ai/get-model";
import { humanizeError } from "@/lib/ai/humanize-error";
import type { ProviderId } from "@/lib/ai/providers";
import { crearToolsOnboarding } from "@/lib/perfil/tools";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

type OnboardingRequestBody = {
  messages: UIMessage[];
  provider: ProviderId;
  apiKey: string;
  model: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as OnboardingRequestBody;
  const { messages, provider, apiKey, model } = body;

  if (!apiKey || !model || !provider) {
    return NextResponse.json(
      { error: "Falta configurar tu proveedor de IA en Ajustes." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Tenés que iniciar sesión." }, { status: 401 });
  }

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
    system: ONBOARDING_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: crearToolsOnboarding(supabase, user.id),
    // Permite varios pasos por turno: guardar uno o más datos con tools y
    // recién después responderle al usuario en texto (default del SDK es 1
    // paso, que cortaría la conversación justo después de la tool call).
    stopWhen: stepCountIs(5),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: humanizeError,
    }),
  });
}
