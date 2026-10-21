/** The Study Hub mark: three rising steps toward a goal. Same drawing as app/icon.svg. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="15" fill="#4f46e5" />
      <path d="M12 43a2 2 0 0 1 2-2h11v10H14a2 2 0 0 1-2-2z" fill="#ffffff" fillOpacity="0.6" />
      <path d="M25 31h12v20H25z" fill="#ffffff" fillOpacity="0.8" />
      <path d="M37 23a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2H37z" fill="#ffffff" />
      <circle cx="44.5" cy="12.5" r="4.5" fill="#fcd34d" />
    </svg>
  );
}
