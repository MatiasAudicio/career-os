import type { Metadata } from "next";

import { SeccionEnConstruccion } from "@/components/shell/seccion-en-construccion";

export const metadata: Metadata = {
  title: "Mi perfil",
};

export default function PerfilPage() {
  return (
    <SeccionEnConstruccion
      titulo="Mi perfil"
      descripcion="Tu experiencia, tus habilidades y lo que buscás — todo en un solo lugar. Lo vas a poder completar conversando, sin formularios eternos."
    />
  );
}
