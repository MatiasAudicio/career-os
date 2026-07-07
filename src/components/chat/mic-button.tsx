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

const SUGERENCIA_NAVEGADOR =
  "El dictado por voz funciona mejor en Google Chrome — otros navegadores basados en Chromium (Opera, Brave, Vivaldi) no incluyen el motor de reconocimiento de Google y suelen fallar en silencio.";

function mensajeDeError(codigo: string): string {
  switch (codigo) {
    case "not-allowed":
    case "permission-denied":
      return "No tenemos permiso para usar tu micrófono. Habilitalo en los permisos del sitio (el ícono de candado al lado de la URL) y probá de nuevo.";
    case "audio-capture":
      return "No encontramos ningún micrófono conectado. Revisá que esté enchufado y habilitado.";
    case "no-speech":
      return "No te escuchamos decir nada. Probá de nuevo, más cerca del micrófono.";
    case "network":
    case "service-not-allowed":
      return `Falló la conexión con el servicio de dictado. ${SUGERENCIA_NAVEGADOR}`;
    case "aborted":
      return "";
    default:
      return `No se pudo completar el dictado (${codigo}). ${SUGERENCIA_NAVEGADOR}`;
  }
}

// Dictado por voz con la Web Speech API — nativa del navegador, sin costo.
// Solo Chrome/Edge la soportan de verdad hoy; en el resto el botón aparece
// (la API existe) pero puede fallar en silencio, así que detectamos también
// el caso "terminó sin transcribir nada y sin tirar error".
export function MicButton({ onResult, disabled }: Props) {
  const [escuchando, setEscuchando] = useState(false);
  const [soportado, setSoportado] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const resultadoRecibidoRef = useRef(false);
  const errorMostradoRef = useRef(false);

  useEffect(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "es-AR";
    // continuous=true: sigue escuchando a través de pausas cortas — el
    // usuario corta con el botón, no el navegador ante el primer silencio.
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const resultado = event.results[i];
        if (!resultado.isFinal) continue;
        const texto = resultado[0]?.transcript ?? "";
        if (texto) {
          resultadoRecibidoRef.current = true;
          onResult(texto);
        }
      }
    };
    recognition.onerror = (event) => {
      const mensaje = mensajeDeError(event.error);
      if (mensaje) {
        toast.error(mensaje);
        errorMostradoRef.current = true;
      }
    };
    recognition.onend = () => {
      setEscuchando(false);
      if (!resultadoRecibidoRef.current && !errorMostradoRef.current) {
        toast.warning(`No se transcribió nada. ${SUGERENCIA_NAVEGADOR}`);
      }
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

    resultadoRecibidoRef.current = false;
    errorMostradoRef.current = false;

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
