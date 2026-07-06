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
      <h1
        data-anim="titulo"
        className="text-3xl font-semibold tracking-tight"
      >
        {titulo}
      </h1>
      <Card data-anim="card" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
        />
        <div
          className="pointer-events-none absolute -top-12 right-8 size-40 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <CardHeader className="items-center py-6 text-center">
          <span
            data-anim="icono"
            className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-accent"
          >
            <Hammer
              className="size-7 text-primary"
              aria-hidden="true"
            />
          </span>
          <CardTitle className="pt-3 text-xl font-medium">
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
