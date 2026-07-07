import type { Metadata } from "next";

import { HoyView } from "@/components/hoy/hoy-view";
import { createClient } from "@/lib/supabase/server";
import { contarPorEstado } from "@/lib/vacantes/pipeline";

export const metadata: Metadata = {
  title: "Hoy",
};

export default async function HoyPage() {
  const supabase = await createClient();

  const [{ data: aplicaciones }, { data: perfil }] = await Promise.all([
    supabase.from("applications").select("estado, fecha_aplicacion"),
    supabase.from("profiles").select("nombre").maybeSingle(),
  ]);

  const filas = aplicaciones ?? [];
  const conteo = contarPorEstado(filas);
  const fechasAplicacion = filas
    .map((f) => f.fecha_aplicacion as string | null)
    .filter((f): f is string => f !== null)
    .sort();
  const ultimaFecha = fechasAplicacion.at(-1) ?? null;

  return (
    <HoyView
      aplicaciones={fechasAplicacion.length}
      nombre={perfil?.nombre ?? null}
      conteo={conteo}
      ultimaFechaAplicacion={ultimaFecha}
      vacantes={filas}
      fechasAplicacion={fechasAplicacion}
    />
  );
}
