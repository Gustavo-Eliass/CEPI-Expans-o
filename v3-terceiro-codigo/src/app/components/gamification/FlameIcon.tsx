export function FlameIcon({ level, size = 32 }: { level:number; size?:number }) {
  const cfgs = [
    { c1:"#9ca3af", c2:"#6b7280", c3:"#d1d5db", glow:"none" },
    { c1:"#ef4444", c2:"#f97316", c3:"#fde047", glow:"rgba(249,115,22,0.55)" },
    { c1:"#2563eb", c2:"#3b82f6", c3:"#93c5fd", glow:"rgba(59,130,246,0.6)" },
    { c1:"#7c3aed", c2:"#a855f7", c3:"#e879f9", glow:"rgba(168,85,247,0.6)" },
    { c1:"#15803d", c2:"#22c55e", c3:"#86efac", glow:"rgba(34,197,94,0.6)" },
    { c1:"#be185d", c2:"#ec4899", c3:"#fda4af", glow:"rgba(236,72,153,0.6)" },
    { c1:"#d97706", c2:"#fbbf24", c3:"#fef3c7", glow:"rgba(251,191,36,0.8)" },
  ];
  const cfg = cfgs[Math.max(0, Math.min(level, 6))];
  const gid = `fg${level}`;
  const igh = `fgh${level}`;
  const h = Math.round(size * 1.2);
  return (
    <svg width={size} height={h} viewBox="0 0 32 38" fill="none"
      style={cfg.glow !== "none" ? { filter:`drop-shadow(0 0 ${Math.round(size/5)}px ${cfg.glow})` } : undefined}>
      <defs>
        <linearGradient id={gid} x1="16" y1="2" x2="16" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={cfg.c3} />
          <stop offset="45%" stopColor={cfg.c2} />
          <stop offset="100%" stopColor={cfg.c1} />
        </linearGradient>
        <linearGradient id={igh} x1="16" y1="14" x2="16" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M16 36C10 36 6 31.5 6 26C6 19 11 12 16 2C21 12 26 19 26 26C26 31.5 22 36 16 36Z" fill={`url(#${gid})`} />
      <path d="M16 36C13 36 10 33 10 30C10 25 13 20 16 12C19 20 22 25 22 30C22 33 19 36 16 36Z" fill={`url(#${igh})`} />
      <ellipse cx="13.5" cy="26" rx="2" ry="5" fill="white" fillOpacity="0.28" transform="rotate(-15 13.5 26)" />
      {level === 6 && (<>
        <circle cx="7" cy="14" r="1.5" fill={cfg.c3} opacity="0.9" />
        <circle cx="25" cy="11" r="1.1" fill={cfg.c3} opacity="0.8" />
        <circle cx="5" cy="27" r="1.1" fill={cfg.c3} opacity="0.7" />
        <circle cx="27" cy="24" r="1.5" fill={cfg.c3} opacity="0.8" />
        <circle cx="16" cy="1" r="1.2" fill={cfg.c3} opacity="0.9" />
        <path d="M9 8L11 6L13 8L11 10Z" fill={cfg.c3} opacity="0.7" />
        <path d="M21 10L23 8L25 10L23 12Z" fill={cfg.c3} opacity="0.7" />
      </>)}
    </svg>
  );
}
