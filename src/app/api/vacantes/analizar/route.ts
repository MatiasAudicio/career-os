import { generateObject } from "ai";
import { NextResponse } from "next/server";

import { buildProfileContext } from "@/lib/agents/context";
import { getModel } from "@/lib/ai/get-model";
import { humanizeError } from "@/lib/ai/humanize-error";
import type { ProviderId } from "@/lib/ai/providers";
import {
  AnalisisVacanteSchema,
  construirPromptAnalisis,
  formatearJustificacion,
} from "@/lib/vacantes/analizar";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

type AnalizarRequestBody = {
  empresa: string;
  rol: string;
  url?: string;
  fuente?: string;
  descripcion: string;
  provider: ProviderId;
  apiKey: string;
  model: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as AnalizarRequestBody;
  const { empresa, rol, url, fuente, descripcion, provider, apiKey, model } = body;

  if (!empresa?.trim() || !rol?.trim() || !descripcion?.trim()) {
    return NextResponse.json(
      { error: "Faltan datos de la vacante (empresa, rol y descripción son obligatorios)." },
      { status: 400 },
    );
  }

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

  const profileContext = await buildProfileContext();
  const { system, prompt } = construirPromptAnalisis(profileContext, descripcion);

  let analisis;
  try {
    const resultado = await generateObject({
      model: languageModel,
      schema: AnalisisVacanteSchema,
      system,
      prompt,
    });
    analisis = resultado.object;
  } catch (error) {
    return NextResponse.json({ error: humanizeError(error) }, { status: 502 });
  }

  const { data: vacante, error } = await supabase
    .from("applications")
    .insert({
      user_id: user.id,
      empresa: empresa.trim(),
      rol: rol.trim(),
      url: url?.trim() || null,
      fuente: fuente?.trim() || null,
      descripcion: descripcion.trim(),
      decision: analisis.decision,
      match_pct: analisis.match_pct,
      match_justificacion: formatearJustificacion(analisis),
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "El análisis salió bien pero no pudimos guardar la vacante. Probá de nuevo." },
      { status: 500 },
    );
  }

  return NextResponse.json({ vacante });
}
