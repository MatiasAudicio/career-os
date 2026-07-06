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

function mensajeDeError(codigo: string | undefined, detalle: string): string {
  switch (codigo) {
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Alcanzamos el límite de correos por hora. Esperá un rato y probá de nuevo — el enlace va a llegar.";
    case "email_address_invalid":
      return "Esa dirección de correo no parece válida. Revisala y probá de nuevo.";
    case "invalid_credentials":
      return "El correo o la contraseña no coinciden. Revisalos y probá de nuevo.";
    case "signup_disabled":
      return "Los registros están desactivados por el momento.";
    default:
      return `No pudimos completar el ingreso (${detalle}). Probá de nuevo en unos minutos.`;
  }
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const [modo, setModo] = useState<"enlace" | "password">("enlace");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [estado, setEstado] = useState<"inicial" | "enviando" | "enviado">(
    "inicial",
  );
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "link"
      ? "Ese enlace ya venció o no es válido. Pedí uno nuevo con tu correo."
      : null,
  );

  async function handleEnlace(event: React.FormEvent<HTMLFormElement>) {
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
      setError(mensajeDeError(authError.code, authError.message));
      return;
    }

    setEstado("enviado");
  }

  async function handlePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setEstado("enviando");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setEstado("inicial");
      setError(mensajeDeError(authError.code, authError.message));
      return;
    }

    // Recarga completa para que el servidor lea la cookie de sesión nueva.
    window.location.assign("/hoy");
  }

  if (estado === "enviado") {
    return (
      <Card className="border-white/10 shadow-2xl shadow-black/20">
        <CardHeader className="text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-accent">
            <MailCheck className="size-6 text-primary" aria-hidden="true" />
          </span>
          <CardTitle className="pt-2 text-xl">Revisá tu correo</CardTitle>
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

  const enviando = estado === "enviando";

  return (
    <Card className="border-white/10 shadow-2xl shadow-black/20">
      <CardHeader>
        <CardTitle className="text-xl">
          {modo === "enlace" ? "Ingresá con tu correo" : "Ingresá con tu contraseña"}
        </CardTitle>
        <CardDescription className="text-base">
          {modo === "enlace"
            ? "Sin contraseñas: te mandamos un enlace y listo."
            : "Correo y contraseña de tu cuenta."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          onSubmit={modo === "enlace" ? handleEnlace : handlePassword}
          className="space-y-4"
          noValidate
        >
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
          </div>
          {modo === "password" && (
            <div className="space-y-2">
              <Label htmlFor="password">Tu contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={error ? true : undefined}
                className="h-11 text-base"
              />
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="glow-primary h-11 w-full text-base font-semibold"
            disabled={
              enviando ||
              email.trim() === "" ||
              (modo === "password" && password === "")
            }
          >
            {enviando ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                {modo === "enlace" ? "Enviando…" : "Entrando…"}
              </>
            ) : modo === "enlace" ? (
              "Enviarme el enlace"
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => {
            setModo(modo === "enlace" ? "password" : "enlace");
            setError(null);
          }}
        >
          {modo === "enlace"
            ? "Prefiero entrar con contraseña"
            : "Prefiero el enlace por correo"}
        </Button>
      </CardContent>
    </Card>
  );
}
