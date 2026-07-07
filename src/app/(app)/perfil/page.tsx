import type { Metadata } from "next";

import { PerfilView } from "@/components/perfil/perfil-view";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mi perfil",
};

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <PerfilView perfil={null} experiencias={[]} skills={[]} proyectos={[]} />;
  }

  const [{ data: perfil }, { data: experiencias }, { data: skills }, { data: proyectos }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase
        .from("experiences")
        .select("*")
        .order("orden", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase.from("skills").select("*").order("created_at", { ascending: true }),
      supabase.from("projects").select("*").order("created_at", { ascending: true }),
    ]);

  return (
    <PerfilView
      perfil={perfil ?? null}
      experiencias={experiencias ?? []}
      skills={skills ?? []}
      proyectos={proyectos ?? []}
    />
  );
}
