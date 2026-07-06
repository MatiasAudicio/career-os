"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);

  // Evita el flash: hasta hidratar no sabemos qué tema resolvió el sistema.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- patrón estándar de next-themes para el "mounted check"
  useEffect(() => setMontado(true), []);

  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Cambiar tema claro/oscuro"
    >
      {montado && resolvedTheme === "dark" ? (
        <Sun aria-hidden="true" />
      ) : (
        <Moon aria-hidden="true" />
      )}
      {montado ? (resolvedTheme === "dark" ? "Tema claro" : "Tema oscuro") : "Tema"}
    </Button>
  );
}
