import { useState } from "react";
import { X, Check, Flag, Shield } from "lucide-react";
import { REPORT_REASONS } from "@/app/data/moderation";

export function ReportModal({ contentType, onClose }: { contentType:"post"|"story"|"message"; onClose:()=>void }) {
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 flex flex-col items-center gap-4 shadow-2xl max-w-sm w-full">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center"><Shield className="w-8 h-8 text-orange-600" /></div>
        <p className="font-black text-foreground text-lg text-center">Denúncia enviada!</p>
        <p className="text-sm text-muted-foreground text-center">A coordenação foi notificada e irá analisar o conteúdo em breve.</p>
        <button onClick={onClose} className="w-full bg-primary text-white rounded-xl py-3 font-bold text-sm">Fechar</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center"><Flag className="w-5 h-5 text-orange-600" /></div>
            <div><h3 className="font-black text-foreground text-base">Denunciar conteúdo</h3><p className="text-xs text-muted-foreground">Será analisado pela coordenação</p></div>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm font-bold text-foreground mb-2">Motivo da denúncia</p>
            <div className="space-y-2">
              {REPORT_REASONS.map(r => (
                <button key={r} onClick={() => setReason(r)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-colors ${reason===r ? "border-orange-400 bg-orange-50 text-orange-700 font-semibold" : "border-border hover:bg-muted/40"}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${reason===r ? "border-orange-500 bg-orange-500" : "border-border"}`}>
                    {reason===r && <Check className="w-3 h-3 text-white" />}
                  </div>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground mb-1">Detalhes (opcional)</p>
            <textarea className="w-full rounded-xl border border-border bg-input-background px-4 py-3 text-sm outline-none resize-none" rows={3} placeholder="Descreva o problema..." value={detail} onChange={e => setDetail(e.target.value)} />
          </div>
          <button onClick={() => reason && setSent(true)} disabled={!reason} className="w-full bg-orange-500 text-white rounded-xl py-3 font-bold text-sm disabled:opacity-40 hover:bg-orange-600 transition-colors">Enviar denúncia →</button>
        </div>
      </div>
    </div>
  );
}
