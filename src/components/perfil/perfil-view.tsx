"use client";

import { useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatosBasicosForm } from "@/components/perfil/datos-basicos-form";
import { ExperienciasSection, type Experiencia } from "@/components/perfil/experiencias-section";
import { OnboardingChat } from "@/components/perfil/onboarding-chat";
import { ProyectosSection, type Proyecto } from "@/components/perfil/proyectos-section";
import { SkillsSection, type Skill } from "@/components/perfil/skills-section";

type Perfil = {
  nombre: string | null;
  ubicacion: string | null;
  objetivo: string | null;
  resumen: string | null;
  idiomas: string[] | null;
} | null;

type Props = {
  perfil: Perfil;
  experiencias: Experiencia[];
  skills: Skill[];
  proyectos: Proyecto[];
};

export function PerfilView({ perfil, experiencias, skills, proyectos }: Props) {
  const vacio = !perfil?.nombre && experiencias.length === 0 && skills.length === 0 && proyectos.length === 0;
  const [mostrarChat, setMostrarChat] = useState(vacio);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Mi perfil</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Tu experiencia, tus skills y lo que buscás — la única fuente de
          verdad que usan los agentes para ayudarte.
        </p>
      </div>

      {vacio && !mostrarChat && (
        <Card className="border-primary/20">
          <CardHeader>
            <span className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-accent">
              <Sparkles className="size-5 text-primary" aria-hidden="true" />
            </span>
            <CardTitle className="pt-2 text-lg">Todavía no completaste tu perfil</CardTitle>
            <CardDescription className="text-base">
              Charlá un par de minutos con nuestro asistente y te lo armamos
              juntos — nada de formularios largos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setMostrarChat(true)} className="gap-1.5">
              <MessageCircle className="size-4" aria-hidden="true" />
              Completar mi perfil conversando
            </Button>
          </CardContent>
        </Card>
      )}

      {!vacio && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setMostrarChat((v) => !v)} className="gap-1.5">
            <MessageCircle className="size-4" aria-hidden="true" />
            {mostrarChat ? "Ocultar chat" : "Seguir completando por chat"}
          </Button>
        </div>
      )}

      {mostrarChat && <OnboardingChat />}

      <DatosBasicosForm perfil={perfil} />
      <ExperienciasSection experiencias={experiencias} />
      <SkillsSection skills={skills} />
      <ProyectosSection proyectos={proyectos} />
    </div>
  );
}
