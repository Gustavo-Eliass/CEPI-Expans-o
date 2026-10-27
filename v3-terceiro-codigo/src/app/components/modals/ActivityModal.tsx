import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Tag } from "@/app/components/common/Tag";
import { ExpBar } from "@/app/components/gamification/ExpBar";
import { FlameIcon } from "@/app/components/gamification/FlameIcon";
import type { Activity } from "@/app/types";
import { getFireLevel, getExpPct, CONFETTI_POS, CONFETTI_COLORS } from "@/app/utils/gamification";

export function ActivityModal({ activity, exp, onClose, onComplete }: { activity:Activity; exp:number; onClose:()=>void; onComplete:()=>void }) {
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState<number|null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [text, setTextVal] = useState("");
  const [phase, setPhase] = useState<"doing"|"done">("doing");
  const newExp = exp + activity.expReward;

  const handleQuizNext = () => {
    if (chosen === null) return;
    const newAnswers = [...answers, chosen];
    setAnswers(newAnswers);
    if (qIdx < (activity.questions?.length ?? 1) - 1) {
      setQIdx(i => i+1);
      setChosen(null);
    } else {
      setPhase("done");
    }
  };

  if (phase === "done") {
    const lvlBefore = getFireLevel(exp);
    const lvlAfter  = getFireLevel(newExp);
    const pct = getExpPct(newExp);
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
          <div className="p-8 flex flex-col items-center gap-5 text-center">
            {CONFETTI_POS.slice(0,8).map((pos, i) => (
              <div key={i} className="absolute w-2 h-2 rounded-full animate-bounce opacity-70"
                style={{ top:pos.top, left:pos.left, backgroundColor:CONFETTI_COLORS[i%CONFETTI_COLORS.length], animationDelay:`${i*0.1}s` }} />
            ))}
            <p className="text-3xl">🎉</p>
            <div>
              <p className="text-xl font-black text-foreground">Atividade concluída!</p>
              {activity.type==="questoes" && (() => { const correct=answers.filter((a,i)=>a===(activity.questions?.[i]?.answer)).length; return <p className="text-sm text-muted-foreground mt-1">{correct}/{answers.length} respostas corretas</p>; })()}
            </div>
            <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor:getFireLevel(newExp).bg }}>
              <FlameIcon level={getFireLevel(newExp).level} size={52} />
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-green-600">+{activity.expReward} EXP</p>
              {lvlAfter.level > lvlBefore.level && <p className="text-base font-bold mt-1" style={{ color:lvlAfter.color }}>Subiu para {lvlAfter.name}! 🔥</p>}
            </div>
            <div className="w-full px-2">
              <ExpBar exp={newExp} />
              <p className="text-xs text-muted-foreground text-center mt-1.5">{newExp} EXP total</p>
            </div>
            <button onClick={() => { onComplete(); onClose(); }} className="w-full bg-primary text-white rounded-2xl py-3.5 font-black text-base hover:bg-[#085a30] transition-colors">Continuar</button>
          </div>
        </div>
      </div>
    );
  }

  const q = activity.questions?.[qIdx];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div>
            <h3 className="font-black text-foreground text-base">{activity.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Tag name={activity.subject} col={activity.teacher.col} />
              <span className="text-xs text-muted-foreground">Prazo: {activity.deadline}</span>
            </div>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activity.type === "questoes" && q && (<>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Questão {qIdx+1} de {activity.questions?.length}</span>
              <div className="flex gap-1">{activity.questions?.map((_,i) => <div key={i} className={`w-5 h-1.5 rounded-full ${i<qIdx?"bg-green-500":i===qIdx?"bg-primary":"bg-border"}`} />)}</div>
            </div>
            <p className="font-bold text-foreground text-base leading-snug">{q.q}</p>
            <div className="space-y-2.5">
              {q.opts.map((opt,i) => (
                <button key={i} onClick={() => setChosen(i)}
                  className={`w-full flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all ${chosen===i ? "border-primary bg-secondary text-primary" : "border-border hover:border-primary/40"}`}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black flex-shrink-0 ${chosen===i ? "border-primary bg-primary text-white" : "border-border text-muted-foreground"}`}>{String.fromCharCode(65+i)}</div>
                  {opt}
                </button>
              ))}
            </div>
            <button onClick={handleQuizNext} disabled={chosen===null}
              className="w-full bg-primary text-white rounded-2xl py-3.5 font-bold disabled:opacity-40 hover:bg-[#085a30] transition-colors">
              {qIdx < (activity.questions?.length??1)-1 ? "Próxima questão →" : "Concluir atividade →"}
            </button>
          </>)}
          {activity.type === "texto" && (<>
            <p className="text-sm text-muted-foreground">Escreva sua resposta abaixo. Mínimo de 20 palavras.</p>
            <textarea className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm outline-none resize-none" rows={6} placeholder="Escreva aqui sua resposta..." value={text} onChange={e => setTextVal(e.target.value)} />
            <p className="text-xs text-muted-foreground">{text.split(/\s+/).filter(Boolean).length} palavras</p>
            <button onClick={() => text.split(/\s+/).filter(Boolean).length >= 10 && setPhase("done")}
              disabled={text.split(/\s+/).filter(Boolean).length < 10}
              className="w-full bg-primary text-white rounded-2xl py-3.5 font-bold disabled:opacity-40 hover:bg-[#085a30] transition-colors">
              Enviar redação →
            </button>
          </>)}
          {activity.type === "upload" && (<>
            <p className="text-sm text-muted-foreground">Faça upload do arquivo com seu relatório.</p>
            <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer" onClick={() => setPhase("done")}>
              <Upload className="w-10 h-10" />
              <p className="text-sm font-semibold">Clique para selecionar arquivo</p>
              <p className="text-xs">PDF, Word ou imagem — máx. 10MB</p>
            </div>
            <button onClick={() => setPhase("done")} className="w-full bg-primary text-white rounded-2xl py-3.5 font-bold hover:bg-[#085a30] transition-colors">Enviar arquivo →</button>
          </>)}
        </div>
      </div>
    </div>
  );
}
