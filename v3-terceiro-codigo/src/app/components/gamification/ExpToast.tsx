import { FlameIcon } from "@/app/components/gamification/FlameIcon";

export function ExpToast({ amount, reason }: { amount:number; reason:string }) {
  return (
    <div className="fixed bottom-24 left-6 z-50 flex items-center gap-2 bg-foreground text-background rounded-2xl px-4 py-2.5 shadow-2xl animate-[slideUp_0.3s_ease-out]"
      style={{ animation:"slideInLeft 0.3s ease-out" }}>
      <FlameIcon level={1} size={16} />
      <span className="text-sm font-black text-green-300">+{amount} EXP</span>
      <span className="text-xs text-white/70 max-w-[140px] truncate">{reason}</span>
    </div>
  );
}
