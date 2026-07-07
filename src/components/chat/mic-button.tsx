"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  onResult: (texto: string) => void;
  disabled?: boolean;
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
    recognition.onerror = () => setEscuchando(false);

    recognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deteccion de soporte del navegador, solo existe en cliente
    setSoportado(true);

    return () => recognition.stop();
  }, [onResult]);

  if (!soportado) return null;

  function toggle() {
    if (!recognitionRef.current) return;
    if (escuchando) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setEscuchando(true);
    }
  }

  return (
    <Button
      type="button"
      variant={escuchando ? "default" : "ghost"}
      size="icon"
      disabled={disabled}
      onClick={toggle}
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
