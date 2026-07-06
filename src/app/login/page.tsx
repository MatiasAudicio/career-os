import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginView } from "@/components/auth/login-view";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Ingresar",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/hoy");
  }

  return <LoginView />;
}
