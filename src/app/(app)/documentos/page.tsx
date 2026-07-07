import type { Metadata } from "next";

import { DocumentosView } from "@/components/documentos/documentos-view";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Documentos",
};

export default async function DocumentosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <DocumentosView documentos={[]} />;
  }

  const { data: documentos } = await supabase
    .from("documents")
    .select("*, applications(empresa, rol)")
    .order("created_at", { ascending: false });

  return <DocumentosView documentos={documentos ?? []} />;
}
