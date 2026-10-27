import { FlameIcon } from "@/app/components/gamification/FlameIcon";
import { FIRE_LEVELS, getFireLevel, getExpPct } from "@/app/utils/gamification";

export function ExpBar({ exp, compact = false, onClick }: { exp:number; compact?:boolean; onClick?:()=>void }) {
  const lvl = getFireLevel(exp);
  const next = FIRE_LEVELS.find(f => f.minExp > lvl.minExp);
  const pct = getExpPct(exp);
  return (
    <div className={`flex items-center gap-2 ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
      <FlameIcon level={lvl.level} size={compact ? 18 : 26} />
      <div className="flex-1 min-w-0">
        {!compact && <div className="flex justify-between items-baseline mb-1">
          <span className="text-xs font-black" style={{ color:lvl.color }}>{lvl.name}</span>
          <span className="text-xs text-muted-foreground">{exp}/{next ? next.minExp : "MAX"} EXP</span>
        </div>}
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width:`${pct}%`, backgroundColor:lvl.color }} />
        </div>
      </div>
      {next && <FlameIcon level={next.level} size={compact ? 14 : 20} />}
    </div>
  );
}
