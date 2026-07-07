import Link from "next/link";
import { Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Bloque compartido por cualquier conversación (chat de agentes, onboarding)
// cuando el usuario todavía no configuró su proveedor de IA en Ajustes.
export function ConfigRequerida() {
  return (
    <Card className="flex flex-1 items-center justify-center">
      <CardHeader className="items-center text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-accent">
          <Sparkles className="size-6 text-primary" aria-hidden="true" />
        </span>
        <CardTitle className="pt-2 text-lg">Falta conectar tu IA</CardTitle>
        <CardDescription className="mx-auto max-w-sm text-base">
          Elegí un proveedor y pegá tu clave en Ajustes — es gratis en la
          mayoría de las opciones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/ajustes" className={buttonVariants({ variant: "default" })}>
          Ir a Ajustes
        </Link>
      </CardContent>
    </Card>
  );
}
