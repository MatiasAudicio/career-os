"use client";

import { getProvider, type ProviderId } from "./providers";

export type AiConfig = {
  provider: ProviderId;
  apiKey: string;
  model: string;
};

const STORAGE_KEY = "career-os:ai-config";

// Vive solo en el navegador del usuario — nunca se manda a nuestro servidor
// salvo dentro del body de /api/chat, request por request, sin persistir.
export function loadAiConfig(): AiConfig | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<AiConfig>;
    if (!parsed.provider || !parsed.apiKey || !parsed.model) return null;
    return parsed as AiConfig;
  } catch {
    return null;
  }
}

export function saveAiConfig(config: AiConfig): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearAiConfig(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function defaultAiConfig(provider: ProviderId): AiConfig {
  return { provider, apiKey: "", model: getProvider(provider).defaultModel };
}
