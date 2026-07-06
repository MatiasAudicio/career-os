import { redirect } from "next/navigation";

import { BottomNav } from "@/components/shell/bottom-nav";
import { Sidebar } from "@/components/shell/sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1">
      <Sidebar />
      {/* pb-20 en mobile reserva espacio para la bottom nav fija */}
      <main className="flex-1 px-4 pb-20 pt-6 lg:px-10 lg:pb-10">
        <div className="mx-auto w-full max-w-4xl">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
