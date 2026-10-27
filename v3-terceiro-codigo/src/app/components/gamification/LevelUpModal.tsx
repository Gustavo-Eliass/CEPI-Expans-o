import { ExpBar } from "@/app/components/gamification/ExpBar";
import { FlameIcon } from "@/app/components/gamification/FlameIcon";
import { FIRE_LEVELS, CONFETTI_POS, CONFETTI_COLORS } from "@/app/utils/gamification";

export function LevelUpModal({ oldLevel, newLevel, exp, onClose }: { oldLevel:number; newLevel:number; exp:number; onClose:()=>void }) {
  const lvlInfo = FIRE_LEVELS.find(f => f.level === newLevel) ?? FIRE_LEVELS[0];
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
      <div className="relative bg-card rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden py-10 px-8 flex flex-col items-center gap-5 text-center">
        {CONFETTI_POS.map((pos, i) => (
          <div key={i} className="absolute w-2.5 h-2.5 rounded-full opacity-80 animate-bounce"
            style={{ top:pos.top, left:pos.left, backgroundColor:CONFETTI_COLORS[i%CONFETTI_COLORS.length], animationDelay:`${(i*0.08).toFixed(2)}s`, animationDuration:"0.9s" }} />
        ))}
        <p className="text-3xl font-black text-foreground">🎉 Subiu de nível!</p>
        <FlameIcon level={newLevel} size={72} />
        <div>
          <p className="text-xl font-black" style={{ color:lvlInfo.color }}>{lvlInfo.name}</p>
          <p className="text-sm text-muted-foreground mt-1">Nível {oldLevel} → Nível {newLevel}</p>
        </div>
        <div className="w-full">
          <ExpBar exp={exp} />
        </div>
        <button onClick={onClose} className="w-full bg-primary text-white rounded-2xl py-3.5 font-black text-base hover:bg-[#085a30] transition-colors">
          Continuar 🔥
        </button>
      </div>
    </div>
  );
}
