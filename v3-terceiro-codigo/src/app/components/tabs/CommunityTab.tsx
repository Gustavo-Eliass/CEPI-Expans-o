import { useState } from "react";
import { Send, AlertTriangle, Lock, Flag, Shield } from "lucide-react";
import { CHAT_INIT } from "@/app/data/school";
import type { AppUser } from "@/app/types";
import { checkWord } from "@/app/utils/moderation";

export function CommunityTab({ user, onGainExp }: { user:AppUser; onGainExp?:(amount:number, reason:string)=>void }) {
  const [msgs, setMsgs] = useState(CHAT_INIT);
  const [text, setText] = useState("");
  const [warn, setWarn] = useState("");
  const [reportToast, setReportToast] = useState(false);
  const ini = user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const isReadonly = user.role==="guardian";

  const send = () => {
    const bad = checkWord(text);
    if (bad) { setWarn(`"${bad}" não é permitida.`); return; }
    if (!text.trim()) return;
    const now = new Date();
    const h = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
    setMsgs(m => [...m, { id:Date.now(), user:"Você", me:true, text:text.trim(), h, ini, col:"#0a6b38" }]);
    setText(""); setWarn("");
    onGainExp?.(3, "Enviou mensagem para a turma");
  };

  const handleMsgReport = () => {
    setReportToast(true);
    setTimeout(() => setReportToast(false), 3000);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="max-w-[700px] w-full mx-auto flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background:"linear-gradient(135deg,#0a6b38,#3a9d5c)" }}>{user.turma||"T"}</div>
            <div><p className="font-black text-foreground">{user.grade} {user.turma} · Comunidade da turma</p><div className="flex items-center gap-1 mt-0.5"><Lock className="w-3 h-3 text-primary" /><p className="text-xs text-primary font-semibold">{isReadonly ? `Visualizando como responsável de ${user.guardianOf}` : "Somente alunos desta turma"}</p></div></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {msgs.map(m => (
            <div key={m.id} className={`flex items-end gap-2 group ${m.me ? "flex-row-reverse" : ""}`}>
              {!m.me && <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor:m.col }}>{m.ini}</div>}
              <div className={`max-w-[65%] flex flex-col gap-0.5 ${m.me ? "items-end" : "items-start"}`}>
                {!m.me && <span className="text-xs font-bold text-muted-foreground ml-1">{m.user}</span>}
                <div className={`rounded-2xl px-3 py-2 text-sm ${m.me ? "bg-primary text-white rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}>{m.text}</div>
                <span className="text-xs text-muted-foreground mx-1">{m.h}</span>
              </div>
              {!m.me && !isReadonly && (
                <button onClick={handleMsgReport} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-orange-50 flex-shrink-0 self-center mb-1" title="Denunciar mensagem">
                  <Flag className="w-3.5 h-3.5 text-muted-foreground hover:text-orange-500" />
                </button>
              )}
            </div>
          ))}
        </div>

        {reportToast && (
          <div className="mx-6 mb-2 flex-shrink-0 flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 shadow-sm">
            <Shield className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <p className="text-xs text-orange-800 font-medium">Mensagem denunciada — a coordenação será notificada.</p>
          </div>
        )}

        {!isReadonly && (
          <div className="flex-shrink-0 border-t border-border bg-card">
            {warn && <div className="mx-6 mt-2 flex items-center gap-2 bg-red-50 rounded-xl px-3 py-1.5"><AlertTriangle className="w-3 h-3 text-red-500" /><p className="text-xs text-red-700">{warn}</p></div>}
            <div className="flex items-center gap-3 px-6 py-3">
              <input className="flex-1 bg-muted rounded-2xl px-4 py-2.5 text-sm outline-none" placeholder="Mensagem para sua turma..." value={text} onChange={e => { setText(e.target.value); setWarn(""); }} onKeyDown={e => e.key==="Enter" && send()} />
              <button onClick={send} disabled={!text.trim()} className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40"><Send className="w-4 h-4 text-white" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
