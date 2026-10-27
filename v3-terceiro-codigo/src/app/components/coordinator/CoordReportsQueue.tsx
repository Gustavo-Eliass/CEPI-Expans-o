import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { DecisionPanel } from "@/app/components/coordinator/DecisionPanel";
import type { Story, Post, ReportItem } from "@/app/types";

export function CoordReportsQueue({ reports, setReports, coordName }: { reports:ReportItem[]; setReports:(r:ReportItem[])=>void; coordName:string }) {
  const [selected, setSelected] = useState<ReportItem|null>(null);
  const [filter, setFilter] = useState<"pending"|"all"|"resolved">("pending");
  const filtered = reports.filter(r => filter==="all" ? true : filter==="pending" ? !r.resolved : r.resolved);
  const handleDecide = (id:number, action:"approved"|"removed", note:string) => {
    const now = new Date().toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" });
    setReports(reports.map(r => r.id===id ? { ...r, resolved:true, decision:{ action, note, by:coordName, at:`hoje às ${now}` } } : r));
    setSelected(null);
  };
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[860px] mx-auto py-6 px-6 space-y-4">
        <div><h2 className="text-2xl font-black text-foreground">Fila de denúncias</h2><p className="text-sm text-muted-foreground mt-0.5">Denúncias enviadas manualmente por alunos e professores</p></div>
        <div className="flex gap-2">
          {(["pending","all","resolved"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${filter===f ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary"}`}>
              {f==="pending" ? "Pendentes" : f==="all" ? "Todas" : "Resolvidas"}
            </button>
          ))}
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {filtered.length===0 && <p className="text-center text-muted-foreground py-12 text-sm">Nenhuma denúncia nesta categoria.</p>}
          {filtered.map(item => (
            <div key={item.id} className={`flex items-start gap-4 px-5 py-4 transition-colors ${!item.resolved ? "hover:bg-muted/20 cursor-pointer" : ""}`} onClick={() => !item.resolved && setSelected(item)}>
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.resolved ? "bg-green-500" : "bg-red-500"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.type==="post"?"bg-blue-100 text-blue-700":item.type==="story"?"bg-purple-100 text-purple-700":"bg-gray-100 text-gray-700"}`}>{item.type==="post"?"Post":item.type==="story"?"Story":"Mensagem"}</span>
                  {item.authorDeleted && <span className="text-xs text-muted-foreground italic">conteúdo removido pelo autor</span>}
                </div>
                <p className="text-sm font-semibold text-foreground truncate">"{item.authorDeleted ? "[conteúdo original removido]" : item.content}"</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.author} · {item.turma}{item.subject ? ` · ${item.subject}` : ""} · {item.date}</p>
                <p className="text-xs text-orange-700 font-medium mt-0.5">Motivo: {item.reason}</p>
                {item.resolved && item.decision && <p className="text-xs text-green-700 mt-0.5 font-medium">✓ Resolvido por {item.decision.by} {item.decision.at} · {item.decision.action==="approved" ? "Conteúdo aprovado" : "Ação tomada"}</p>}
              </div>
              {!item.resolved && <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />}
            </div>
          ))}
        </div>
      </div>
      {selected && <DecisionPanel item={selected} coordName={coordName} onClose={() => setSelected(null)} onDecide={handleDecide} />}
    </div>
  );
}
