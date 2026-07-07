import type { Metadata } from "next";

import { VacantesView } from "@/components/vacantes/vacantes-view";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Vacantes",
};

export default async function VacantesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <VacantesView vacantesIniciales={[]} />;
  }

  const { data: vacantes } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  return <VacantesView vacantesIniciales={vacantes ?? []} />;
}
