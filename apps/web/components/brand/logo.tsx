export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="text-emerald-400">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 13.5c1.4 1.6 6.6 1.6 8 0" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="9.2" cy="10" r="1" fill="currentColor" />
        <circle cx="14.8" cy="10" r="1" fill="currentColor" />
      </svg>
      Futurehuman
    </span>
  );
}
