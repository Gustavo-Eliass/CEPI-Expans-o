import { useState } from "react";
import { ChevronDown, ChevronUp, RefreshCw, Info, CheckCircle } from "lucide-react";
import type { AIDecidedItem } from "@/app/types";

export function CoordAIDecided({ items, setItems }: { items:AIDecidedItem[]; setItems:(r:AIDecidedItem[])=>void }) {
  const [expanded, setExpanded] = useState<number|null>(null);
  const [reopenedIds, setReopenedIds] = useState<number[]>([]);
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[860px] mx-auto py-6 px-6 space-y-4">
        <div><h2 className="text-2xl font-black text-foreground">Decididas pela IA — Log de auditoria</h2><p className="text-sm text-muted-foreground mt-0.5">Mensagens processadas automaticamente com alta confiança. Não há fila de trabalho — apenas registro.</p></div>
        <div className="flex items-center gap-3 bg-muted/50 border border-border rounded-2xl px-5 py-3">
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">Este é um log de auditoria. Cada item pode ser reaberto para revisão humana caso você discorde da decisão automática.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {items.map(item => (
            <div key={item.id}>
              <div className="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => setExpanded(expanded===item.id ? null : item.id)}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.action==="liberado" ? "bg-green-500" : "bg-red-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.action==="liberado" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{item.action==="liberado" ? "✓ Liberado" : "✕ Bloqueado"}</span>
                    <span className="text-xs text-muted-foreground">Confiança: {item.confidence}%</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate">"{item.content}"</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.author} · {item.turma} · {item.date}</p>
                </div>
                {expanded===item.id ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />}
              </div>
              {expanded===item.id && (
                <div className="bg-muted/20 px-5 pb-4 space-y-3">
                  <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-wider">Processo de avaliação da IA</p>
                    <div className="space-y-1.5">
                      {([["Trecho analisado", `"${item.content}"`],["Critério aplicado", item.reason],["Nível de confiança", `${item.confidence}%`],["Ação tomada", item.action==="liberado" ? "Conteúdo liberado automaticamente" : "Conteúdo bloqueado automaticamente"]] as [string,string][]).map(([k,v]) => (
                        <div key={k} className="flex gap-2"><span className="text-xs font-bold text-muted-foreground w-32 flex-shrink-0">{k}:</span><span className={`text-xs ${k==="Ação tomada" ? (item.action==="liberado" ? "text-green-700 font-bold" : "text-red-700 font-bold") : "text-foreground"}`}>{v}</span></div>
                      ))}
                    </div>
                  </div>
                  {reopenedIds.includes(item.id) ? (
                    <div className="flex items-center gap-2 text-xs text-primary font-semibold"><CheckCircle className="w-4 h-4" /> Item reaberto para revisão humana.</div>
                  ) : (
                    <button onClick={() => setReopenedIds(ids => [...ids, item.id])} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary font-semibold transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" /> Reabrir para revisão humana
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
