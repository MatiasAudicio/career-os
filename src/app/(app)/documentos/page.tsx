import type { Metadata } from "next";

import { SeccionEnConstruccion } from "@/components/shell/seccion-en-construccion";

export const metadata: Metadata = {
  title: "Documentos",
};

export default function DocumentosPage() {
  return (
    <SeccionEnConstruccion
      titulo="Documentos"
      descripcion="Tus CVs y cartas de presentación, uno por vacante, siempre guardados y listos para descargar. Nunca inventamos experiencia que no tenés."
    />
  );
}
