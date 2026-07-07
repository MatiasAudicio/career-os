"use server";

import { revalidatePath } from "next/cache";

import {
  actualizarDatosBasicos,
  actualizarExperiencia,
  actualizarProyecto,
  actualizarSkill,
  agregarExperiencia,
  agregarProyecto,
  agregarSkill,
  eliminarExperiencia,
  eliminarProyecto,
  eliminarSkill,
  type DatosBasicos,
  type DatosExperiencia,
  type DatosProyecto,
  type DatosSkill,
  type Resultado,
} from "@/lib/perfil/persistencia";
import { createClient } from "@/lib/supabase/server";

async function usuarioAutenticado() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, userId: user?.id };
}

const SIN_SESION: Resultado = { error: "Tenés que iniciar sesión." };

export async function guardarDatosBasicosAction(datos: DatosBasicos): Promise<Resultado> {
  const { supabase, userId } = await usuarioAutenticado();
  if (!userId) return SIN_SESION;
  const resultado = await actualizarDatosBasicos(supabase, userId, datos);
  if (!resultado.error) revalidatePath("/perfil");
  return resultado;
}

export async function agregarExperienciaAction(datos: DatosExperiencia): Promise<Resultado> {
  const { supabase, userId } = await usuarioAutenticado();
  if (!userId) return SIN_SESION;
  const resultado = await agregarExperiencia(supabase, userId, datos);
  if (!resultado.error) revalidatePath("/perfil");
  return resultado;
}

export async function actualizarExperienciaAction(
  id: string,
  datos: Partial<DatosExperiencia>,
): Promise<Resultado> {
  const { supabase, userId } = await usuarioAutenticado();
  if (!userId) return SIN_SESION;
  const resultado = await actualizarExperiencia(supabase, userId, id, datos);
  if (!resultado.error) revalidatePath("/perfil");
  return resultado;
}

export async function eliminarExperienciaAction(id: string): Promise<Resultado> {
  const { supabase, userId } = await usuarioAutenticado();
  if (!userId) return SIN_SESION;
  const resultado = await eliminarExperiencia(supabase, userId, id);
  if (!resultado.error) revalidatePath("/perfil");
  return resultado;
}

export async function agregarSkillAction(datos: DatosSkill): Promise<Resultado> {
  const { supabase, userId } = await usuarioAutenticado();
  if (!userId) return SIN_SESION;
  const resultado = await agregarSkill(supabase, userId, datos);
  if (!resultado.error) revalidatePath("/perfil");
  return resultado;
}

export async function actualizarSkillAction(
  id: string,
  datos: Partial<DatosSkill>,
): Promise<Resultado> {
  const { supabase, userId } = await usuarioAutenticado();
  if (!userId) return SIN_SESION;
  const resultado = await actualizarSkill(supabase, userId, id, datos);
  if (!resultado.error) revalidatePath("/perfil");
  return resultado;
}

export async function eliminarSkillAction(id: string): Promise<Resultado> {
  const { supabase, userId } = await usuarioAutenticado();
  if (!userId) return SIN_SESION;
  const resultado = await eliminarSkill(supabase, userId, id);
  if (!resultado.error) revalidatePath("/perfil");
  return resultado;
}

export async function agregarProyectoAction(datos: DatosProyecto): Promise<Resultado> {
  const { supabase, userId } = await usuarioAutenticado();
  if (!userId) return SIN_SESION;
  const resultado = await agregarProyecto(supabase, userId, datos);
  if (!resultado.error) revalidatePath("/perfil");
  return resultado;
}

export async function actualizarProyectoAction(
  id: string,
  datos: Partial<DatosProyecto>,
): Promise<Resultado> {
  const { supabase, userId } = await usuarioAutenticado();
  if (!userId) return SIN_SESION;
  const resultado = await actualizarProyecto(supabase, userId, id, datos);
  if (!resultado.error) revalidatePath("/perfil");
  return resultado;
}

export async function eliminarProyectoAction(id: string): Promise<Resultado> {
  const { supabase, userId } = await usuarioAutenticado();
  if (!userId) return SIN_SESION;
  const resultado = await eliminarProyecto(supabase, userId, id);
  if (!resultado.error) revalidatePath("/perfil");
  return resultado;
}
