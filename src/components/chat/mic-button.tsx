"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  onResult: (texto: string) => void;
  disabled?: boolean;
};

const MENSAJE_POR_ERROR: Record<string, string> = {
  "not-allowed":
    "No tenemos permiso para usar tu micrófono. Habilitalo en los permisos del sitio (el ícono de candado al lado de la URL) y probá de nuevo.",
  "audio-capture":
    "No encontramos ningún micrófono conectado. Revisá que esté enchufado y habilitado.",
  "no-speech": "No te escuchamos decir nada. Probá de nuevo, más cerca del micrófono.",
  network: "Falló la conexión con el servicio de dictado. Probá de nuevo en un momento.",
  aborted: "",
};

// Dictado por voz con la Web Speech API — nativa del navegador, sin costo.
// Solo Chrome/Edge la soportan hoy; en el resto el botón simplemente no aparece.
export function MicButton({ onResult, disabled }: Props) {
  const [escuchando, setEscuchando] = useState(false);
  const [soportado, setSoportado] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "es-AR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const texto = event.results[0]?.[0]?.transcript ?? "";
      if (texto) onResult(texto);
    };
    recognition.onend = () => setEscuchando(false);
    recognition.onerror = (event) => {
      setEscuchando(false);
      const mensaje = MENSAJE_POR_ERROR[event.error];
      if (mensaje) toast.error(mensaje);
    };

    recognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deteccion de soporte del navegador, solo existe en cliente
    setSoportado(true);

    return () => recognition.stop();
  }, [onResult]);

  if (!soportado) return null;

  async function toggle() {
    if (!recognitionRef.current) return;

    if (escuchando) {
      recognitionRef.current.stop();
      return;
    }

    // Pedimos el permiso de micrófono explícitamente: si el navegador lo
    // niega, acá aparece un error claro en vez de que start() falle mudo.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      toast.error(
        "No pudimos acceder a tu micrófono. Revisá los permisos del navegador para este sitio.",
      );
      return;
    }

    try {
      recognitionRef.current.start();
      setEscuchando(true);
    } catch {
      toast.error("No se pudo iniciar el dictado. Probá de nuevo.");
    }
  }

  return (
    <Button
      type="button"
      variant={escuchando ? "default" : "ghost"}
      size="icon"
      disabled={disabled}
      onClick={() => void toggle()}
      aria-pressed={escuchando}
      aria-label={escuchando ? "Detener dictado por voz" : "Dictar por voz"}
      className={cn(escuchando && "glow-primary animate-pulse")}
    >
      {escuchando ? (
        <MicOff aria-hidden="true" />
      ) : (
        <Mic aria-hidden="true" />
      )}
    </Button>
  );
}
