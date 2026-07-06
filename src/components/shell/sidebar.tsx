"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/logo";
import { SignoutButton } from "@/components/shell/signout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { secciones } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="px-5 py-5">
        <Link href="/hoy">
          <Logo markClassName="size-7" />
        </Link>
      </div>
      <nav aria-label="Secciones" className="flex-1 space-y-0.5 px-3">
        {secciones.map((item) => {
          const activa = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activa ? "page" : undefined}
              className={cn(
                "relative flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                activa
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              {activa && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary"
                />
              )}
              <item.icono className="size-[18px]" aria-hidden="true" />
              {item.titulo}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-0.5 p-3">
        <Separator className="mb-2" />
        <ThemeToggle />
        <SignoutButton />
      </div>
    </aside>
  );
}
