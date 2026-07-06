import type { Metadata } from "next";

import { HoyView } from "@/components/hoy/hoy-view";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Hoy",
};

export default async function HoyPage() {
  const supabase = await createClient();

  const [{ count }, { data: perfil }] = await Promise.all([
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .not("fecha_aplicacion", "is", null),
    supabase.from("profiles").select("nombre").maybeSingle(),
  ]);

  return <HoyView aplicaciones={count ?? 0} nombre={perfil?.nombre ?? null} />;
}
