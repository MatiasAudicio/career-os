import { generateText } from "ai";
import { NextResponse } from "next/server";

import { buildProfileContext } from "@/lib/agents/context";
import { getModel } from "@/lib/ai/get-model";
import { humanizeError } from "@/lib/ai/humanize-error";
import type { ProviderId } from "@/lib/ai/providers";
import {
  construirPromptDocumento,
  siguienteVersion,
  tituloDocumento,
  type TipoDocumento,
} from "@/lib/documentos/generar";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

type GenerarRequestBody = {
  applicationId: string;
  tipo: TipoDocumento;
  provider: ProviderId;
  apiKey: string;
  model: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as GenerarRequestBody;
  const { applicationId, tipo, provider, apiKey, model } = body;

  if (!applicationId || (tipo !== "cv" && tipo !== "carta")) {
    return NextResponse.json({ error: "Faltan datos para generar el documento." }, { status: 400 });
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

  const { data: vacante } = await supabase
    .from("applications")
    .select("id, empresa, rol, descripcion")
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!vacante) {
    return NextResponse.json({ error: "No encontramos esa vacante." }, { status: 404 });
  }

  let languageModel;
  try {
    languageModel = getModel(provider, apiKey, model);
  } catch {
    return NextResponse.json({ error: "No reconocemos ese proveedor de IA." }, { status: 400 });
  }

  const profileContext = await buildProfileContext();
  const { system, prompt } = construirPromptDocumento(tipo, profileContext, vacante);

  let contenido: string;
  try {
    const resultado = await generateText({ model: languageModel, system, prompt });
    contenido = resultado.text;
  } catch (error) {
    return NextResponse.json({ error: humanizeError(error) }, { status: 502 });
  }

  const { data: existentes } = await supabase
    .from("documents")
    .select("version")
    .eq("user_id", user.id)
    .eq("application_id", applicationId)
    .eq("tipo", tipo);

  const version = siguienteVersion((existentes ?? []).map((d) => d.version as number));

  const { data: documento, error } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      application_id: applicationId,
      tipo,
      titulo: tituloDocumento(tipo, vacante),
      contenido,
      version,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "El documento se generó pero no lo pudimos guardar. Probá de nuevo." },
      { status: 500 },
    );
  }

  return NextResponse.json({ documento });
}
