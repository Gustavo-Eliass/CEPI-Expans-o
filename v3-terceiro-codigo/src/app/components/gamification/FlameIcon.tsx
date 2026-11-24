import chamaLaranja from "@/app/assets/gamification/chama-laranja.png";
import chamaAzul from "@/app/assets/gamification/chama-azul.png";
import chamaVerde from "@/app/assets/gamification/chama-verde.png";
import chamaRosa from "@/app/assets/gamification/chama-rosa.png";
import chamaRoxo from "@/app/assets/gamification/chama-roxo.png";

type FlameIconProps = { level: number; size?: number };

// O nível 0 representa um fogo ainda não desbloqueado (cinza).
// Os níveis 1–6 seguem as cores definidas em FIRE_LEVELS.
const FIRE_STYLES = [
  { inner: "#d1d5db", middle: "#9ca3af", outer: "#6b7280", glow: "none" },
  { inner: "#fff7ed", middle: "#f97316", outer: "#c2410c", glow: "rgba(249,115,22,.48)" },
  { inner: "#eff6ff", middle: "#3b82f6", outer: "#1d4ed8", glow: "rgba(59,130,246,.5)" },
  { inner: "#f0fdf4", middle: "#22c55e", outer: "#15803d", glow: "rgba(34,197,94,.48)" },
  { inner: "#fdf2f8", middle: "#ec4899", outer: "#be185d", glow: "rgba(236,72,153,.5)" },
  { inner: "#faf5ff", middle: "#a855f7", outer: "#7e22ce", glow: "rgba(168,85,247,.5)" },
  { inner: "#fffbeb", middle: "#f59e0b", outer: "#b45309", glow: "rgba(245,158,11,.58)" },
];

// Raios alternados criam uma silhueta de explosão, em vez de uma chama.
const RAYS = [
  "M32 3 L32 13", "M32 51 L32 61", "M3 32 L13 32", "M51 32 L61 32",
  "M11.5 11.5 L18.5 18.5", "M45.5 45.5 L52.5 52.5",
  "M52.5 11.5 L45.5 18.5", "M18.5 45.5 L11.5 52.5",
  "M22 5 L25 14", "M42 50 L45 59", "M5 22 L14 25", "M50 39 L59 42",
  "M42 5 L39 14", "M22 50 L19 59", "M59 22 L50 25", "M14 39 L5 42",
];

export function FlameIcon({ level, size = 32 }: FlameIconProps) {
  const safeLevel = Math.max(0, Math.min(Math.round(level), FIRE_STYLES.length - 1));
  const cfg = FIRE_STYLES[safeLevel];
  const gradientId = `firework-gradient-${safeLevel}`;
  const glowId = `firework-glow-${safeLevel}`;
  const isLocked = safeLevel === 0;
  const flameImages = [null, chamaLaranja, chamaAzul, chamaVerde, chamaRosa, chamaRoxo];
  const suppliedImage = flameImages[safeLevel];

  if (suppliedImage) {
    return (
      <img
        src={suppliedImage}
        width={size}
        height={size}
        alt={`Foguinho ${["", "laranja", "azul", "verde", "rosa", "roxo"][safeLevel]}`}
        className="firework-icon object-contain shrink-0"
        style={{
          width: size,
          height: size,
          filter: `drop-shadow(0 0 ${Math.max(2, size / 9)}px ${cfg.glow})`,
        }}
        draggable={false}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label={isLocked ? "Foguinho não desbloqueado" : `Foguinho nível ${safeLevel}`}
      className={isLocked ? "firework-icon firework-icon-locked" : "firework-icon"}
      style={!isLocked ? { filter: `drop-shadow(0 0 ${Math.max(2, size / 9)}px ${cfg.glow})` } : undefined}
    >
      <defs>
        <radialGradient id={gradientId} cx="32" cy="32" r="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={cfg.inner} />
          <stop offset="48%" stopColor={cfg.middle} />
          <stop offset="100%" stopColor={cfg.outer} />
        </radialGradient>
        <radialGradient id={glowId} cx="32" cy="32" r="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={cfg.inner} stopOpacity=".95" />
          <stop offset="100%" stopColor={cfg.middle} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Brilho suave atrás da explosão */}
      <circle cx="32" cy="32" r="21" fill={`url(#${glowId})`} opacity={isLocked ? 0.12 : 0.42} />

      {/* Raios principais e secundários */}
      <g stroke={cfg.middle} strokeWidth="3.2" strokeLinecap="round" opacity=".96">
        {RAYS.slice(0, 8).map((ray, index) => <path key={`ray-main-${index}`} d={ray} />)}
      </g>
      <g stroke={cfg.inner} strokeWidth="2" strokeLinecap="round" opacity=".9">
        {RAYS.slice(8).map((ray, index) => <path key={`ray-small-${index}`} d={ray} />)}
      </g>

      {/* Pontas luminosas */}
      <g fill={cfg.middle}>
        <path d="M32 8 L35 16 L32 14 L29 16 Z" />
        <path d="M32 56 L35 48 L32 50 L29 48 Z" />
        <path d="M8 32 L16 29 L14 32 L16 35 Z" />
        <path d="M56 32 L48 29 L50 32 L48 35 Z" />
      </g>

      {/* Núcleo em estrela: mantém o desenho reconhecível mesmo pequeno */}
      <path d="M32 17 L36 27 L47 32 L36 37 L32 47 L28 37 L17 32 L28 27 Z" fill={`url(#${gradientId})`} stroke={cfg.inner} strokeWidth="1.4" />
      <circle cx="32" cy="32" r="5.2" fill={cfg.inner} />
      <circle cx="32" cy="32" r="2.2" fill="white" opacity=".95" />

      {/* Partículas */}
      <g fill={cfg.inner}>
        <circle cx="13" cy="15" r="1.8" />
        <circle cx="51" cy="14" r="1.5" />
        <circle cx="12" cy="49" r="1.5" />
        <circle cx="52" cy="49" r="1.8" />
      </g>
    </svg>
  );
}
