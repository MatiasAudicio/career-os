function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[28%] border border-primary/25 bg-accent text-primary ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-[62%]"
        aria-hidden="true"
        fill="none"
      >
        <circle cx="12" cy="12.5" r="2.4" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="10.2" y1="10.6" x2="6.7" y2="3.6" />
          <line x1="12.4" y1="10.1" x2="13.3" y2="4.4" />
          <line x1="14.1" y1="10.7" x2="17.3" y2="7.1" />
          <line x1="14.4" y1="12.5" x2="21.2" y2="13.6" />
          <line x1="13.8" y1="14.3" x2="16.8" y2="18.9" />
          <line x1="11.6" y1="14.8" x2="10.4" y2="21.6" />
          <line x1="10.1" y1="14.1" x2="6.4" y2="17.4" />
          <line x1="9.6" y1="12.1" x2="3.6" y2="10.9" />
        </g>
      </svg>
    </span>
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
