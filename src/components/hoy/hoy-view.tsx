"use client";

import { useRef } from "react";
import { Briefcase, MessageSquareHeart, Send, Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  aplicaciones: number;
  nombre: string | null;
};

export function HoyView({ aplicaciones, nombre }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const contadorRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-anim='titulo']", {
          y: 16,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power3.out",
        });
        gsap.from("[data-anim='card']", {
          y: 28,
          autoAlpha: 0,
          duration: 0.55,
          stagger: 0.12,
          delay: 0.1,
          ease: "power3.out",
        });

        const obj = { n: 0 };
        gsap.to(obj, {
          n: aplicaciones,
          duration: Math.min(1.2, 0.3 + aplicaciones * 0.08),
          delay: 0.35,
          ease: "power1.out",
          snap: { n: 1 },
          onUpdate() {
            if (contadorRef.current) {
              contadorRef.current.textContent = String(Math.round(obj.n));
            }
          },
        });
      });
    },
    { scope: container },
  );

  return (
    <div ref={container} className="space-y-6">
      <div data-anim="titulo">
        <h1 className="text-3xl font-semibold tracking-tight">
          {nombre ? `Hola, ${nombre}` : "Hoy"}
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          Un paso a la vez. Esto es lo que importa ahora.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card
          data-anim="card"
          className="relative overflow-hidden sm:col-span-2 border-primary/15"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          />
          <div
            className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-base">
              <Send className="size-4 text-primary" aria-hidden="true" />
              Aplicaciones enviadas
            </CardDescription>
            <CardTitle className="font-mono text-6xl font-semibold tracking-tight text-foreground">
              <span ref={contadorRef}>{aplicaciones}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {aplicaciones === 0
              ? "Todavía ninguna registrada acá. La primera es la más difícil — y la única métrica que de verdad mueve tu búsqueda."
              : "Cada una cuenta. Seguí sumando."}
          </CardContent>
        </Card>

        <Card data-anim="card" className="relative overflow-hidden">
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-base">
              <MessageSquareHeart
                className="size-4 text-primary"
                aria-hidden="true"
              />
              Tu próximo paso
            </CardDescription>
            <CardTitle className="text-lg leading-snug font-medium">
              Contanos quién sos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Muy pronto en la sección Chat, como se lo contarías a un amigo.
          </CardContent>
        </Card>
      </div>

      <Card data-anim="card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2 text-base">
            <Briefcase className="size-4 text-primary" aria-hidden="true" />
            Qué es Career OS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Un equipo de agentes que te acompaña a conseguir trabajo:
            analizamos vacantes con porcentajes honestos, armamos tu CV y tus
            cartas, y llevamos la cuenta de tus aplicaciones.
          </p>
          <p className="flex items-start gap-2">
            <Sparkles
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            Sin humo: si una vacante no te conviene, te lo decimos. Y si pasás
            muchos días sin aplicar, también.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
