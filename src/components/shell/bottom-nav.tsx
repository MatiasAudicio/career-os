"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { SignoutButton } from "@/components/shell/signout-button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  seccionesPrincipales,
  seccionesSecundarias,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const enSecundaria = seccionesSecundarias.some((item) =>
    pathname.startsWith(item.href),
  );

  return (
    <nav
      aria-label="Secciones"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="grid grid-cols-5">
        {seccionesPrincipales.map((item) => {
          const activa = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activa ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 text-xs",
                activa
                  ? "font-semibold text-primary"
                  : "font-medium text-muted-foreground",
              )}
            >
              <item.icono className="size-5" aria-hidden="true" />
              {item.titulo}
            </Link>
          );
        })}

        <Sheet open={abierto} onOpenChange={setAbierto}>
          <SheetTrigger
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 text-xs",
              enSecundaria
                ? "font-semibold text-primary"
                : "font-medium text-muted-foreground",
            )}
          >
            <Menu className="size-5" aria-hidden="true" />
            Más
          </SheetTrigger>
          <SheetContent side="bottom" className="pb-[env(safe-area-inset-bottom)]">
            <SheetHeader>
              <SheetTitle>Más secciones</SheetTitle>
            </SheetHeader>
            <div className="space-y-1 px-4 pb-4">
              {seccionesSecundarias.map((item) => {
                const activa = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setAbierto(false)}
                    aria-current={activa ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm",
                      activa
                        ? "bg-accent font-semibold text-accent-foreground"
                        : "font-medium text-muted-foreground",
                    )}
                  >
                    <item.icono className="size-5" aria-hidden="true" />
                    {item.titulo}
                  </Link>
                );
              })}
              <Separator className="my-2" />
              <SignoutButton />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
