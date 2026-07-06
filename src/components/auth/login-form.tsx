"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"inicial" | "enviando" | "enviado">(
    "inicial",
  );
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "link"
      ? "Ese enlace ya venció o no es válido. Pedí uno nuevo con tu correo."
      : null,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setEstado("enviando");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (authError) {
      setEstado("inicial");
      setError(
        "No pudimos enviarte el correo. Revisá que la dirección esté bien escrita y probá de nuevo.",
      );
      return;
    }

    setEstado("enviado");
  }

  if (estado === "enviado") {
    return (
      <Card>
        <CardHeader className="text-center">
          <MailCheck
            className="mx-auto size-10 text-primary"
            aria-hidden="true"
          />
          <CardTitle className="text-xl">Revisá tu correo</CardTitle>
          <CardDescription className="text-base">
            Te mandamos un enlace a <strong>{email}</strong>. Tocalo y entrás
            directo — sin contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setEstado("inicial")}
          >
            Usar otro correo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Ingresá con tu correo</CardTitle>
        <CardDescription className="text-base">
          Sin contraseñas: te mandamos un enlace y listo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Tu correo electrónico</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="ejemplo@correo.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={error ? true : undefined}
              className="h-11 text-base"
            />
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="h-11 w-full text-base"
            disabled={estado === "enviando" || email.trim() === ""}
          >
            {estado === "enviando" ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Enviando…
              </>
            ) : (
              "Enviarme el enlace"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
