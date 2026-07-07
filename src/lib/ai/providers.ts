export type ProviderId =
  | "anthropic"
  | "google"
  | "groq"
  | "openrouter"
  | "huggingface";

export type ProviderInfo = {
  id: ProviderId;
  nombre: string;
  defaultModel: string;
  dondeConseguirLaKey: string;
  nivelGratuito: string;
};

export const PROVIDERS: ProviderInfo[] = [
  {
    id: "anthropic",
    nombre: "Claude (Anthropic)",
    defaultModel: "claude-sonnet-5",
    dondeConseguirLaKey: "console.anthropic.com → API Keys",
    nivelGratuito:
      "Sin nivel gratuito permanente, pero es el que mejor entiende el contexto de carrera. Recomendado si podés cargar unos dólares.",
  },
  {
    id: "google",
    nombre: "Gemini (Google AI Studio)",
    defaultModel: "gemini-2.5-flash",
    dondeConseguirLaKey: "aistudio.google.com → Get API key",
    nivelGratuito:
      "Nivel gratuito generoso (hasta 15 solicitudes por minuto) y no pide tarjeta.",
  },
  {
    id: "groq",
    nombre: "Groq",
    defaultModel: "llama-3.3-70b-versatile",
    dondeConseguirLaKey: "console.groq.com/keys",
    nivelGratuito: "Capa gratuita generosa y muy baja latencia (respuestas rápidas).",
  },
  {
    id: "openrouter",
    nombre: "OpenRouter",
    defaultModel: "meta-llama/llama-3.3-70b-instruct:free",
    dondeConseguirLaKey: "openrouter.ai/keys",
    nivelGratuito:
      "Créditos gratis al registrarte y modelos etiquetados \":free\" sin costo.",
  },
  {
    id: "huggingface",
    nombre: "Hugging Face",
    defaultModel: "meta-llama/Llama-3.1-8B-Instruct",
    dondeConseguirLaKey: "huggingface.co/settings/tokens",
    nivelGratuito: "Límites generosos en su API de inferencia gratuita.",
  },
];

export function getProvider(id: ProviderId): ProviderInfo {
  return PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0];
}
