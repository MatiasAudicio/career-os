import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogle } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";

import type { ProviderId } from "./providers";

// Server-only: cada llamada crea el provider con la key que mandó el cliente
// en esa request puntual. Nunca se persiste ni se loguea acá ni más arriba.
export function getModel(
  provider: ProviderId,
  apiKey: string,
  model: string,
): LanguageModel {
  switch (provider) {
    case "anthropic":
      return createAnthropic({ apiKey })(model);
    case "google":
      return createGoogle({ apiKey })(model);
    case "groq":
      return createGroq({ apiKey })(model);
    case "openrouter":
      return createOpenRouter({ apiKey })(model);
    case "huggingface":
      return createOpenAICompatible({
        name: "huggingface",
        apiKey,
        baseURL: "https://router.huggingface.co/v1",
      }).chatModel(model);
  }
}
