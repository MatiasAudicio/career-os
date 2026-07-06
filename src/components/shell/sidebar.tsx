"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignoutButton } from "@/components/shell/signout-button";
import { Separator } from "@/components/ui/separator";
import { secciones } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r bg-sidebar lg:flex">
      <div className="px-6 py-5">
        <Link href="/hoy" className="text-xl font-bold text-primary">
          Career OS
        </Link>
      </div>
      <nav aria-label="Secciones" className="flex-1 space-y-1 px-3">
        {secciones.map((item) => {
          const activa = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activa ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                activa
                  ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icono className="size-5" aria-hidden="true" />
              {item.titulo}
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <Separator className="mb-3" />
        <SignoutButton />
      </div>
    </aside>
  );
}
