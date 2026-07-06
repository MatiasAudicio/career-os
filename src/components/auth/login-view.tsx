"use client";

import { Suspense, useRef } from "react";
import { BadgeCheck, FileText, Rocket } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

const promesas = [
  {
    icono: BadgeCheck,
    texto: "Match real de cada vacante — sin humo",
  },
  {
    icono: FileText,
    texto: "CV y cartas a medida, sin inventar nada",
  },
  {
    icono: Rocket,
    texto: "Te empuja a aplicar, no a procrastinar",
  },
];

export function LoginView() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        const titulo = new SplitText("[data-titulo]", { type: "words" });

        tl.from("[data-marca]", { y: -16, autoAlpha: 0, duration: 0.5 })
          .from(
            titulo.words,
            { y: 28, autoAlpha: 0, duration: 0.6, stagger: 0.05 },
            "-=0.2",
          )
          .from(
            "[data-promesa]",
            { x: -20, autoAlpha: 0, duration: 0.45, stagger: 0.1 },
            "-=0.3",
          )
          .from(
            "[data-form]",
            { y: 32, autoAlpha: 0, duration: 0.6 },
            "-=0.55",
          );

        // Deriva lenta y continua de los brillos del fondo.
        gsap.to("[data-blob='1']", {
          x: 60,
          y: -40,
          duration: 9,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        gsap.to("[data-blob='2']", {
          x: -50,
          y: 50,
          duration: 11,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });
    },
    { scope: container },
  );

  return (
    <div ref={container} className="grid flex-1 lg:grid-cols-2">
      {/* Panel de marca (desktop) */}
      <section
        aria-hidden="true"
        className="relative hidden overflow-hidden bg-[oklch(0.28_0.05_192)] lg:flex lg:flex-col lg:justify-between lg:p-12"
      >
        <div
          data-blob="1"
          className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-[oklch(0.6_0.104_184.7)] opacity-30 blur-3xl"
        />
        <div
          data-blob="2"
          className="pointer-events-none absolute -right-32 bottom-0 size-[28rem] rounded-full bg-[oklch(0.769_0.188_70.08)] opacity-20 blur-3xl"
        />

        <p
          data-marca
          className="relative text-2xl font-bold tracking-tight text-white"
        >
          Career OS
        </p>

        <div className="relative space-y-10">
          <h1
            data-titulo
            className="max-w-md text-4xl leading-tight font-bold text-white xl:text-5xl"
          >
            Conseguí trabajo con un equipo que te dice la verdad.
          </h1>
          <ul className="space-y-4">
            {promesas.map((p) => (
              <li
                key={p.texto}
                data-promesa
                className="flex items-center gap-3 text-base text-teal-50/90"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/10">
                  <p.icono className="size-5 text-[oklch(0.878_0.116_178)]" />
                </span>
                {p.texto}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-teal-100/60">
          Gratis y open source. Tus datos son tuyos.
        </p>
      </section>

      {/* Formulario */}
      <main className="relative flex items-center justify-center overflow-hidden px-4 py-12">
        <div
          className="pointer-events-none absolute -top-32 right-0 size-80 rounded-full bg-[oklch(0.953_0.051_180.8)] opacity-60 blur-3xl lg:hidden"
          aria-hidden="true"
        />
        <div data-form className="w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center lg:hidden">
            <p className="text-3xl font-bold tracking-tight text-primary">
              Career OS
            </p>
            <p className="text-base text-muted-foreground">
              Tu equipo para conseguir trabajo. Honesto, gratis y a tu ritmo.
            </p>
          </div>
          <div className="hidden space-y-1 lg:block">
            <h2 className="text-2xl font-bold tracking-tight">Bienvenido</h2>
            <p className="text-base text-muted-foreground">
              Entrá y seguí donde lo dejaste.
            </p>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
