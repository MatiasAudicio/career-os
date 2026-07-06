import type { Metadata } from "next";

import { SeccionEnConstruccion } from "@/components/shell/seccion-en-construccion";

export const metadata: Metadata = {
  title: "Ajustes",
};

export default function AjustesPage() {
  return (
    <SeccionEnConstruccion
      titulo="Ajustes"
      descripcion="Acá vas a elegir tu asistente de IA (tu propia clave de Claude o un modelo local con Ollama), el idioma, y descargar todos tus datos cuando quieras."
    />
  );
}
