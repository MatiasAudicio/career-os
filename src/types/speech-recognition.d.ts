// La Web Speech API no es un estándar formal del DOM todavía — TypeScript no
// la incluye. Declaración mínima de lo que usamos (Chrome/Edge la soportan).
export {};

declare global {
  interface SpeechRecognitionResultItem {
    transcript: string;
  }

  interface SpeechRecognitionResultEntry {
    0: SpeechRecognitionResultItem;
    isFinal: boolean;
  }

  interface SpeechRecognitionEvent extends Event {
    results: ArrayLike<SpeechRecognitionResultEntry>;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    start(): void;
    stop(): void;
  }

  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}
