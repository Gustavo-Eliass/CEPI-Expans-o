import { Eye, Flag, Zap, CheckCircle } from "lucide-react";
import { COORD_AI_DECIDED_INIT } from "@/app/data/moderation";
import type { ReportItem } from "@/app/types";

export function CoordDashboard({ reports, aiReports }: { reports:ReportItem[]; aiReports:ReportItem[] }) {
  const pending   = reports.filter(r => !r.resolved).length;
  const aiPending = aiReports.filter(r => !r.resolved).length;
  const stats = [
    { label:"Denúncias pendentes",           v:pending,                    Icon:Flag,        col:"#c0392b", bg:"#faeae9" },
    { label:"Sinalizadas pela IA (revisar)",  v:aiPending,                  Icon:Zap,         col:"#d97706", bg:"#fef3c7" },
    { label:"Decididas pela IA (7 dias)",     v:COORD_AI_DECIDED_INIT.length, Icon:Eye,       col:"#1a5276", bg:"#e8f0f6" },
    { label:"Resolvidas hoje",                v:reports.filter(r=>r.resolved).length, Icon:CheckCircle, col:"#0a6b38", bg:"#e6f4ec" },
  ];
  const recent = [...reports, ...aiReports].slice(0, 5);
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1000px] mx-auto py-6 px-6 space-y-6">
        <div><h2 className="text-2xl font-black text-foreground">Visão geral</h2><p className="text-sm text-muted-foreground mt-0.5">Dashboard de moderação · CEPI Expansão</p></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, v, Icon, col, bg }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor:bg }}><Icon className="w-5 h-5" style={{ color:col }} /></div>
              <div><p className="text-3xl font-black text-foreground">{v}</p><p className="text-xs text-muted-foreground mt-0.5 leading-tight">{label}</p></div>
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-black text-foreground text-lg mb-3">Itens mais recentes</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {recent.length===0 && <p className="text-center text-muted-foreground py-10 text-sm">Nenhum item encontrado.</p>}
            {recent.map(item => (
              <div key={item.id} className="flex items-start gap-4 px-5 py-4">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.resolved ? "bg-green-500" : item.source==="ai-flagged" ? "bg-orange-500" : "bg-red-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">"{item.authorDeleted ? "Conteúdo removido pelo autor" : item.content}"</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.author} · {item.turma} · {item.date}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${item.source==="ai-flagged" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                  {item.source==="ai-flagged" ? "Sinalizado por IA" : "Denúncia manual"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
