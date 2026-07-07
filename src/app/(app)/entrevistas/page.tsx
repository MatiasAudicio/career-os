import type { Metadata } from "next";

import { EntrevistasView, type Entrevista } from "@/components/entrevistas/entrevistas-view";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Entrevistas",
};

export default async function EntrevistasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <EntrevistasView entrevistas={[]} vacantes={[]} />;
  }

  const [{ data: entrevistas }, { data: vacantes }] = await Promise.all([
    supabase
      .from("interviews")
      .select("*, applications(empresa, rol)")
      .order("fecha", { ascending: false, nullsFirst: false }),
    supabase
      .from("applications")
      .select("id, empresa, rol")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <EntrevistasView
      entrevistas={(entrevistas ?? []) as Entrevista[]}
      vacantes={vacantes ?? []}
    />
  );
}
