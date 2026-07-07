import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ImprimirView } from "@/components/documentos/imprimir-view";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Exportar documento",
};

// Ruta standalone, fuera del grupo (app): no hereda el shell (sidebar/bottom
// nav de src/app/(app)/layout.tsx), solo el layout raíz minimalista. Así el
// botón "Imprimir/Guardar PDF" no arrastra nada de la navegación de la app.
export default async function ImprimirPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: documento } = await supabase
    .from("documents")
    .select("titulo, contenido")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!documento) notFound();

  return <ImprimirView titulo={documento.titulo} contenido={documento.contenido} />;
}
