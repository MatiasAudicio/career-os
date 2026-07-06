"use client";

import { useRef } from "react";
import { Hammer } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  titulo: string;
  descripcion: string;
};

// Estado vacío honesto para secciones aún no construidas:
// dice qué va a hacer la sección, sin botones que no llevan a nada.
export function SeccionEnConstruccion({ titulo, descripcion }: Props) {
  const container = useRef<HTMLDivElement>(null);

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
          delay: 0.1,
          ease: "power3.out",
        });
        gsap.to("[data-anim='icono']", {
          y: -6,
          duration: 1.8,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });
    },
    { scope: container },
  );

  return (
    <div ref={container} className="space-y-6">
      <h1 data-anim="titulo" className="text-3xl font-bold tracking-tight">
        {titulo}
      </h1>
      <Card data-anim="card" className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-12 right-8 size-40 rounded-full bg-accent blur-3xl"
          aria-hidden="true"
        />
        <CardHeader className="items-center py-4 text-center">
          <span
            data-anim="icono"
            className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-accent"
          >
            <Hammer
              className="size-8 text-accent-foreground"
              aria-hidden="true"
            />
          </span>
          <CardTitle className="pt-2 text-xl">
            Estamos construyendo esto
          </CardTitle>
          <CardDescription className="mx-auto max-w-md text-base">
            {descripcion}
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}
