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

        // El contador sube desde cero hasta el número real.
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
        <h1 className="text-3xl font-bold tracking-tight">
          {nombre ? `Hola, ${nombre}` : "Hoy"}
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          Un paso a la vez. Esto es lo que importa ahora.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          data-anim="card"
          className="relative overflow-hidden border-primary/20"
        >
          <div
            className="pointer-events-none absolute -top-10 -right-10 size-36 rounded-full bg-accent blur-2xl"
            aria-hidden="true"
          />
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-base">
              <Send className="size-4 text-primary" aria-hidden="true" />
              Aplicaciones enviadas
            </CardDescription>
            <CardTitle className="text-5xl font-bold tabular-nums text-primary">
              <span ref={contadorRef}>{aplicaciones}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {aplicaciones === 0
              ? "Todavía ninguna registrada acá. La primera es la más difícil — y la única métrica que de verdad mueve tu búsqueda."
              : "Cada una cuenta. Seguí sumando."}
          </CardContent>
        </Card>

        <Card data-anim="card">
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-base">
              <MessageSquareHeart
                className="size-4 text-primary"
                aria-hidden="true"
              />
              Tu próximo paso
            </CardDescription>
            <CardTitle className="text-lg leading-snug">
              Contanos quién sos y qué buscás
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Muy pronto vas a poder contarlo hablando en la sección Chat, como
            se lo contarías a un amigo. Con eso armamos tu perfil y tu CV.
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
              className="mt-0.5 size-4 shrink-0 text-[oklch(0.769_0.188_70.08)]"
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
