import type { Metadata } from "next";

import { SeccionEnConstruccion } from "@/components/shell/seccion-en-construccion";

export const metadata: Metadata = {
  title: "Entrevistas",
};

export default function EntrevistasPage() {
  return (
    <SeccionEnConstruccion
      titulo="Entrevistas"
      descripcion="Registrá cada entrevista real y practicá con simulacros que te puntúan y te dicen exactamente qué mejorar."
    />
  );
}
