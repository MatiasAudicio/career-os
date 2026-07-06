function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="oklch(0.78 0.16 293)" />
          <stop offset="100%" stopColor="oklch(0.7 0.2 320)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#logo-grad)" />
      <path
        d="M20.5 10.5c-1.2-1.1-2.8-1.7-4.5-1.7-3.7 0-6.8 3-6.8 7.2s3.1 7.2 6.8 7.2c1.7 0 3.3-.6 4.5-1.7"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

type Props = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
};

// El tamaño del wordmark se pasa por prop a propósito: el mismo lockup se usa
// en el hero grande del login y en la sidebar compacta, y un solo tamaño fijo
// se ve desproporcionado en uno de los dos contextos.
export function Logo({
  className,
  markClassName = "size-8",
  wordmarkClassName = "text-lg font-semibold tracking-tight",
  showWordmark = true,
}: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className={markClassName} />
      {showWordmark && <span className={wordmarkClassName}>Career OS</span>}
    </span>
  );
}
