import { useState } from "react";
import { X, Shield, Info, ThumbsUp, ThumbsDown, CheckCircle, XCircle } from "lucide-react";
import { ConfidenceBadge } from "@/app/components/common/ConfidenceBadge";
import type { Story, Post, ReportItem } from "@/app/types";

export function DecisionPanel({ item, coordName, onClose, onDecide }: {
  item: ReportItem; coordName: string; onClose: ()=>void;
  onDecide: (id:number, action:"approved"|"removed", note:string)=>void;
}) {
  const [choice, setChoice] = useState<"approved"|"removed"|null>(null);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const now = new Date().toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" });

  if (done) return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 flex flex-col items-center gap-4 shadow-2xl max-w-sm w-full">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${choice==="approved" ? "bg-green-100" : "bg-red-100"}`}>
          {choice==="approved" ? <CheckCircle className="w-8 h-8 text-green-600" /> : <XCircle className="w-8 h-8 text-red-600" />}
        </div>
        <p className="font-black text-foreground text-lg text-center">Decisão registrada</p>
        <p className="text-sm text-muted-foreground text-center">{choice==="approved" ? "Conteúdo aprovado e mantido." : "Ação registrada e conteúdo sinalizado."}<br />Responsável: <strong>{coordName}</strong> — {now}</p>
        <button onClick={onClose} className="w-full bg-primary text-white rounded-xl py-3 font-bold text-sm">Fechar</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-primary" /></div>
            <div><h3 className="font-black text-foreground">Painel de decisão</h3><p className="text-xs text-muted-foreground">{item.source==="ai-flagged" ? "Sinalizado pela IA · decisão humana obrigatória" : "Denúncia manual"}</p></div>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Conteúdo analisado</p>
            {item.authorDeleted
              ? <div className="flex items-center gap-2 text-muted-foreground italic text-sm"><Info className="w-4 h-4 flex-shrink-0" /><span>Conteúdo original removido pelo autor — registro preservado para auditoria.</span></div>
              : <p className="text-sm text-foreground leading-relaxed">"{item.content}"</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {([["Autor", item.author],["Turma / Contexto", `${item.turma}${item.subject ? ` · ${item.subject}` : ""}`],["Tipo", { post:"Post", story:"Story", message:"Mensagem no chat" }[item.type]],["Registrado", item.date]] as [string,string][]).map(([k,v]) => (
              <div key={k} className="bg-muted/30 rounded-xl px-4 py-3"><p className="text-xs text-muted-foreground mb-0.5">{k}</p><p className="text-sm font-semibold text-foreground">{v}</p></div>
            ))}
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 space-y-1">
            <p className="text-xs font-black text-orange-800 uppercase tracking-wider">Motivo / Sinalização</p>
            <p className="text-sm text-orange-900 font-medium">{item.reason}</p>
            {item.aiNote && (<><div className="h-px bg-orange-200 my-2" /><p className="text-xs font-black text-orange-800 uppercase tracking-wider">Nota da IA</p><p className="text-xs text-orange-800 leading-relaxed">{item.aiNote}</p>{item.confidence && <ConfidenceBadge c={item.confidence} />}</>)}
          </div>
          {item.source==="ai-flagged" && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
              <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-800 font-medium">A IA sinalizou, mas <strong>não decidiu</strong>. A decisão final é exclusivamente sua.</p>
            </div>
          )}
          <div>
            <p className="text-sm font-black text-foreground mb-2">Sua decisão</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setChoice("approved")} className={`flex flex-col items-center gap-2 rounded-2xl border-2 py-4 px-3 transition-all ${choice==="approved" ? "border-green-500 bg-green-50" : "border-border hover:border-green-300"}`}>
                <ThumbsUp className={`w-6 h-6 ${choice==="approved" ? "text-green-600" : "text-muted-foreground"}`} />
                <span className={`text-sm font-bold ${choice==="approved" ? "text-green-700" : "text-foreground"}`}>Conteúdo adequado</span>
                <span className="text-xs text-muted-foreground text-center leading-tight">Libera o conteúdo</span>
              </button>
              <button onClick={() => setChoice("removed")} className={`flex flex-col items-center gap-2 rounded-2xl border-2 py-4 px-3 transition-all ${choice==="removed" ? "border-red-500 bg-red-50" : "border-border hover:border-red-300"}`}>
                <ThumbsDown className={`w-6 h-6 ${choice==="removed" ? "text-red-600" : "text-muted-foreground"}`} />
                <span className={`text-sm font-bold ${choice==="removed" ? "text-red-700" : "text-foreground"}`}>Requer ação</span>
                <span className="text-xs text-muted-foreground text-center leading-tight">Registra intervenção</span>
              </button>
            </div>
          </div>
          {choice==="removed" && (
            <div>
              <p className="text-sm font-bold text-foreground mb-1">Ação tomada</p>
              <textarea className="w-full rounded-xl border border-border bg-input-background px-4 py-3 text-sm outline-none resize-none" rows={3} placeholder="Ex: Advertência verbal enviada ao aluno. Notificação enviada aos responsáveis." value={note} onChange={e => setNote(e.target.value)} />
            </div>
          )}
        </div>
        <div className="flex-shrink-0 px-6 py-4 border-t border-border">
          <button onClick={() => { if (!choice) return; onDecide(item.id, choice, note); setDone(true); }} disabled={!choice || (choice==="removed" && !note.trim())} className="w-full bg-primary text-white rounded-xl py-3 font-bold text-sm disabled:opacity-40 hover:bg-[#085a30] transition-colors">Registrar decisão →</button>
          <p className="text-center text-xs text-muted-foreground mt-2">Registrado como: {coordName} · {now}</p>
        </div>
      </div>
    </div>
  );
}
