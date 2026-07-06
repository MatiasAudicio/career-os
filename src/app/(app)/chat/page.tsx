import type { Metadata } from "next";

import { SeccionEnConstruccion } from "@/components/shell/seccion-en-construccion";

export const metadata: Metadata = {
  title: "Chat",
};

export default function ChatPage() {
  return (
    <SeccionEnConstruccion
      titulo="Chat"
      descripcion="Acá vas a conversar con tu equipo de agentes — escribiendo o hablando con el micrófono. Es la próxima pieza que estamos construyendo."
    />
  );
}
