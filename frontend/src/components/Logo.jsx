export default function Logo({ size = 30 }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="currentColor" />
        <path d="M18 20l28 24M46 20L18 44" stroke="var(--logo-ink)" strokeWidth="7" strokeLinecap="round" />
        <circle cx="50" cy="50" r="5" fill="var(--cobalt)" />
      </svg>
      <span className="logo__word">xyz</span>
    </span>
  )
}
