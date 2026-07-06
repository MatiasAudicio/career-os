function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[28%] border border-primary/25 bg-accent text-primary ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-[60%]"
        aria-hidden="true"
        fill="none"
      >
        <path
          d="M16.5 7.6c-1.1-1-2.5-1.6-4-1.6-3.2 0-5.9 2.6-5.9 6s2.7 6 5.9 6c1.5 0 2.9-.6 4-1.6"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
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
