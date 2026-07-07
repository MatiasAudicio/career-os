import type { Metadata } from "next";

import { AiConfigForm } from "@/components/ajustes/ai-config-form";

export const metadata: Metadata = {
  title: "Ajustes",
};

export default function AjustesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Ajustes</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Configurá tu asistente de IA. El resto (tema, exportar tus datos)
          llega pronto.
        </p>
      </div>
      <AiConfigForm />
    </div>
  );
}
