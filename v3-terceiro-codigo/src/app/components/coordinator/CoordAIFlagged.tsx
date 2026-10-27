import { useState } from "react";
import { ChevronRight, Shield } from "lucide-react";
import { ConfidenceBadge } from "@/app/components/common/ConfidenceBadge";
import { DecisionPanel } from "@/app/components/coordinator/DecisionPanel";
import type { ReportItem } from "@/app/types";

export function CoordAIFlagged({ items, setItems, coordName }: { items:ReportItem[]; setItems:(r:ReportItem[])=>void; coordName:string }) {
  const [selected, setSelected] = useState<ReportItem|null>(null);
  const handleDecide = (id:number, action:"approved"|"removed", note:string) => {
    const now = new Date().toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" });
    setItems(items.map(r => r.id===id ? { ...r, resolved:true, decision:{ action, note, by:coordName, at:`hoje às ${now}` } } : r));
    setSelected(null);
  };
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[860px] mx-auto py-6 px-6 space-y-4">
        <div><h2 className="text-2xl font-black text-foreground">Sinalizadas pela IA</h2><p className="text-sm text-muted-foreground mt-0.5">Mensagens marcadas pelo classificador de risco aguardando revisão humana</p></div>
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800 font-medium"><strong>A IA sinalizou, mas nunca decide.</strong> Cada item aqui requer obrigatoriamente a revisão e decisão de um coordenador.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {items.length===0 && <p className="text-center text-muted-foreground py-12 text-sm">Nenhum item aguardando revisão.</p>}
          {items.map(item => (
            <div key={item.id} className={`flex items-start gap-4 px-5 py-4 transition-colors ${item.resolved ? "opacity-60" : "hover:bg-muted/20 cursor-pointer"}`} onClick={() => !item.resolved && setSelected(item)}>
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.resolved ? "bg-green-500" : item.confidence==="risco alto" ? "bg-red-500" : item.confidence==="ambíguo" ? "bg-orange-500" : "bg-yellow-500"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">{item.confidence && <ConfidenceBadge c={item.confidence} />}{item.resolved && <span className="text-xs text-green-700 font-bold">✓ Resolvido</span>}</div>
                <p className="text-sm font-semibold text-foreground truncate">"{item.content}"</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.author} · {item.turma} · {item.date}</p>
                <p className="text-xs text-orange-700 font-medium mt-0.5">IA: {item.reason}</p>
                {item.aiNote && <p className="text-xs text-muted-foreground mt-0.5 italic">{item.aiNote}</p>}
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
