"use client";

import { Suspense, useRef } from "react";
import { BadgeCheck, FileText, Rocket, Sparkles } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/logo";
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
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        const titulo = new SplitText("[data-titulo]", { type: "words" });

        tl.from("[data-marca]", { y: -16, autoAlpha: 0, duration: 0.5 })
          .from(
            "[data-badge]",
            { y: -12, autoAlpha: 0, duration: 0.45 },
            "-=0.25",
          )
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

        gsap.to("[data-blob='1']", {
          x: 70,
          y: -50,
          duration: 10,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        gsap.to("[data-blob='2']", {
          x: -60,
          y: 60,
          duration: 12,
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
        className="bg-dot-grid relative hidden overflow-hidden bg-[oklch(0.1_0.014_285)] lg:flex lg:flex-col lg:justify-between lg:p-12 [mask-image:radial-gradient(ellipse_120%_100%_at_0%_0%,black_60%,transparent_100%)]"
      >
        <div
          data-blob="1"
          className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-[oklch(0.635_0.225_293)] opacity-30 blur-3xl"
        />
        <div
          data-blob="2"
          className="pointer-events-none absolute -right-32 bottom-0 size-[28rem] rounded-full bg-[oklch(0.6_0.22_320)] opacity-20 blur-3xl"
        />

        <div data-marca className="relative">
          <Logo className="text-white" markClassName="size-8" />
        </div>

        <div className="relative space-y-8">
          <span
            data-badge
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
          >
            <Sparkles className="size-3.5 text-[oklch(0.78_0.16_293)]" />
            Gratis y open source
          </span>
          <h1
            data-titulo
            className="max-w-md text-4xl leading-[1.1] font-semibold tracking-tight text-white xl:text-5xl"
          >
            Conseguí trabajo con un equipo que{" "}
            <span className="text-gradient-brand">te dice la verdad</span>.
          </h1>
          <ul className="space-y-4">
            {promesas.map((p) => (
              <li
                key={p.texto}
                data-promesa
                className="flex items-center gap-3 text-base text-white/70"
              >
                <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <p.icono className="size-4.5 text-[oklch(0.78_0.16_293)]" />
                </span>
                {p.texto}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/40">
          Tus datos son tuyos. Siempre.
        </p>
      </section>

      {/* Formulario */}
      <main className="bg-dot-grid relative flex items-center justify-center overflow-hidden px-4 py-12 lg:bg-none">
        <div
          className="pointer-events-none absolute -top-32 right-0 size-80 rounded-full bg-[oklch(0.635_0.225_293)] opacity-20 blur-3xl lg:hidden"
          aria-hidden="true"
        />
        <div data-form className="relative w-full max-w-sm space-y-8">
          <div className="lg:hidden">
            <Logo className="justify-center" markClassName="size-9" />
          </div>
          <div className="space-y-1 text-center lg:text-left">
            <h2 className="text-2xl font-semibold tracking-tight">
              Bienvenido de vuelta
            </h2>
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
