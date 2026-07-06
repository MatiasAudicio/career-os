import type { Metadata } from "next";

import { SeccionEnConstruccion } from "@/components/shell/seccion-en-construccion";

export const metadata: Metadata = {
  title: "Vacantes",
};

export default function VacantesPage() {
  return (
    <SeccionEnConstruccion
      titulo="Vacantes"
      descripcion="Vas a pegar el texto de una vacante y te vamos a decir, con honestidad, qué tan compatible sos y si conviene aplicar — con el porqué, no solo un número."
    />
  );
}
