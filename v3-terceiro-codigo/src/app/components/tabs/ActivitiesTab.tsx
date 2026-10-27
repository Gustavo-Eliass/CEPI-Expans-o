import { useState } from "react";
import { Check, Target } from "lucide-react";
import { Tag } from "@/app/components/common/Tag";
import { FlameIcon } from "@/app/components/gamification/FlameIcon";
import { ActivityModal } from "@/app/components/modals/ActivityModal";
import type { Activity } from "@/app/types";

export function ActivitiesTab({ activities, onComplete, exp }: { activities:Activity[]; onComplete:(id:number)=>void; exp:number }) {
  const [selected, setSelected] = useState<Activity|null>(null);
  const pending  = activities.filter(a => a.status==="pendente");
  const done     = activities.filter(a => a.status==="concluida");
  const typeIcon = { questoes:"📝", texto:"✍️", upload:"📎" };
  const typeLabel = { questoes:"Questões", texto:"Redação", upload:"Upload" };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[680px] mx-auto py-6 px-4 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-foreground">Atividades</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{pending.length} pendente{pending.length!==1?"s":""} · {done.length} concluída{done.length!==1?"s":""}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary rounded-xl px-3 py-1.5">
            <FlameIcon level={1} size={16} />
            <span className="text-xs font-black text-primary">+20 EXP cada</span>
          </div>
        </div>

        {pending.length > 0 && (<>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Pendentes</p>
          <div className="space-y-3">
            {pending.map(a => (
              <div key={a.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor:a.teacher.col+"22" }}>{typeIcon[a.type]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm leading-snug">{a.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Tag name={a.subject} col={a.teacher.col} />
                        <span className="text-xs text-muted-foreground">Prof. {a.teacher.name.split(" ")[0]}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs font-semibold text-orange-600">Prazo: {a.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{typeLabel[a.type]}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelected(a)} className="mt-3 w-full bg-primary text-white rounded-xl py-2.5 font-bold text-sm hover:bg-[#085a30] transition-colors flex items-center justify-center gap-2">
                    <Target className="w-4 h-4" /> Fazer atividade (+{a.expReward} EXP)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>)}

        {done.length > 0 && (<>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-2">Concluídas</p>
          <div className="space-y-3">
            {done.map(a => (
              <div key={a.id} className="bg-card border border-border/50 rounded-2xl p-4 opacity-70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0"><Check className="w-5 h-5 text-green-600" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{a.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Tag name={a.subject} col={a.teacher.col} />
                      <span className="text-xs text-green-600 font-bold">+{a.expReward} EXP ganhos ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>)}
      </div>
      {selected && <ActivityModal activity={selected} exp={exp} onClose={() => setSelected(null)} onComplete={() => { onComplete(selected.id); setSelected(null); }} />}
    </div>
  );
}
