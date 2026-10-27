import { Check, Trophy, TrendingUp } from "lucide-react";
import { FlameIcon } from "@/app/components/gamification/FlameIcon";
import { CLASS_RANKING_DEMO } from "@/app/data/school";
import type { AppUser, ExpEntry } from "@/app/types";
import { FIRE_LEVELS, getFireLevel, getExpPct } from "@/app/utils/gamification";

export function ProgressTab({ exp, expHistory, user }: { exp:number; expHistory:ExpEntry[]; user:AppUser }) {
  const lvl = getFireLevel(exp);
  const next = FIRE_LEVELS.find(f => f.minExp > lvl.minExp);
  const pct = getExpPct(exp);

  const myRankName = user.name.split(" ")[0];
  const allRankers = [...CLASS_RANKING_DEMO, { name: myRankName + " (você)", exp, level: lvl.level }]
    .sort((a,b) => b.exp - a.exp);
  const myPos = allRankers.findIndex(r => r.name.includes("(você)")) + 1;
  const topExp = allRankers[0]?.exp ?? 1;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[720px] mx-auto py-6 px-4 space-y-5">

        {/* Hero card */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden">
          <div className="h-2" style={{ backgroundColor:lvl.color }} />
          <div className="flex flex-col items-center gap-4 py-8 px-6">
            <FlameIcon level={lvl.level} size={80} />
            <div className="text-center">
              <p className="text-2xl font-black text-foreground">{lvl.name}</p>
              <p className="text-sm text-muted-foreground mt-1">Nível {lvl.level} · {exp} EXP acumulados</p>
            </div>
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Nível {lvl.level}</span>
                <span className="font-bold" style={{ color:lvl.color }}>{pct}%</span>
                <span>{next ? `Nível ${next.level}` : "MAX"}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width:`${pct}%`, backgroundColor:lvl.color }} />
              </div>
              {next && <p className="text-center text-xs text-muted-foreground mt-1.5">Faltam <strong>{next.minExp - exp} EXP</strong> para o {next.name}</p>}
            </div>
          </div>
        </div>

        {/* Journey map */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Jornada dos Focos</p>
          <div className="flex items-center justify-between gap-1">
            {FIRE_LEVELS.map((fl, i) => {
              const reached = exp >= fl.minExp;
              const isCurrent = fl.level === lvl.level;
              return (
                <div key={fl.level} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={`relative rounded-2xl p-2 transition-all ${isCurrent ? "ring-2 ring-offset-1" : ""} ${reached ? "" : "opacity-30"}`}
                    style={isCurrent ? { "--tw-ring-color":fl.color, backgroundColor:fl.bg } as React.CSSProperties : reached ? { backgroundColor:fl.bg } : { backgroundColor:"#f3f4f6" }}>
                    <FlameIcon level={fl.level} size={28} />
                    {isCurrent && <div className="absolute -top-1 -right-1 w-4 h-4 bg-foreground rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-background" /></div>}
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight" style={{ color:reached ? fl.color : "#9ca3af" }}>{fl.name.replace("Fogo ","")}</span>
                  {i < FIRE_LEVELS.length - 1 && <div className="absolute" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* EXP History */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="font-black text-foreground">Histórico de EXP</p>
          </div>
          <div className="divide-y divide-border">
            {expHistory.slice(0,8).map(e => (
              <div key={e.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor:"#e6f4ec" }}>
                  <FlameIcon level={1} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{e.reason}</p>
                  <p className="text-xs text-muted-foreground">{e.time}</p>
                </div>
                <span className="text-sm font-black text-green-600 flex-shrink-0">+{e.amount}</span>
              </div>
            ))}
            {expHistory.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Nenhum EXP ganho ainda.<br />Interaja com o app para começar! 🔥</p>}
          </div>
        </div>

        {/* Class ranking */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <p className="font-black text-foreground">Ranking da Turma</p>
            <span className="ml-auto text-xs text-muted-foreground">{user.grade} {user.turma}</span>
          </div>
          <div className="divide-y divide-border">
            {allRankers.map((r, i) => {
              const isMe = r.name.includes("(você)");
              return (
                <div key={r.name} className={`flex items-center gap-4 px-5 py-3 ${isMe ? "bg-secondary/60" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${i===0?"bg-yellow-400 text-white":i===1?"bg-slate-300 text-white":i===2?"bg-orange-400 text-white":"bg-muted text-muted-foreground"}`}>
                    {i < 3 ? ["🥇","🥈","🥉"][i] : i+1}
                  </div>
                  <FlameIcon level={r.level} size={20} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isMe ? "text-primary" : "text-foreground"}`}>{r.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden max-w-[100px]">
                        <div className="h-full rounded-full" style={{ width:`${Math.round((r.exp/topExp)*100)}%`, backgroundColor:FIRE_LEVELS[r.level-1]?.color ?? "#f97316" }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{r.exp} EXP</span>
                    </div>
                  </div>
                  {isMe && <span className="text-xs font-bold text-primary bg-secondary rounded-full px-2 py-0.5 flex-shrink-0">#{myPos}</span>}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
