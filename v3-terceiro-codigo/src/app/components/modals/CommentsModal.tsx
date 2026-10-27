import { useState } from "react";
import { X, Send, AlertTriangle } from "lucide-react";
import { Av } from "@/app/components/common/Av";
import type { AppUser, Post } from "@/app/types";
import { checkWord } from "@/app/utils/moderation";

export function CommentsModal({ post, user, onClose, onAdd, onGainExp }: { post:Post; user:AppUser; onClose:()=>void; onAdd:(id:number, text:string)=>void; onGainExp?:(amount:number, reason:string)=>void }) {
  const [text, setText] = useState("");
  const [warn, setWarn] = useState("");
  const send = () => {
    const bad = checkWord(text);
    if (bad) { setWarn(`A palavra "${bad}" não é permitida.`); return; }
    if (!text.trim()) return;
    onAdd(post.id, text.trim()); setText(""); setWarn("");
    onGainExp?.(5, "Comentou em um post");
  };
  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0"><h3 className="font-black text-foreground">Comentários</h3><button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button></div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {post.comments.length===0 && <p className="text-muted-foreground text-sm text-center py-8">Nenhum comentário ainda.</p>}
          {post.comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground flex-shrink-0">{c.user.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
              <div className="flex-1"><div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2"><p className="text-xs font-bold">{c.user}</p><p className="text-sm mt-0.5">{c.text}</p></div><p className="text-xs text-muted-foreground mt-1 ml-2">{c.age}</p></div>
            </div>
          ))}
        </div>
        {warn && <div className="mx-6 mb-2 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2"><AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" /><p className="text-xs text-red-700 font-medium">{warn}</p></div>}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-border flex-shrink-0">
          <Av ini={user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()} col="#0a6b38" size="sm" />
          <input className="flex-1 bg-muted rounded-2xl px-4 py-2.5 text-sm outline-none" placeholder="Escreva um comentário..." value={text} onChange={e => { setText(e.target.value); setWarn(""); }} onKeyDown={e => e.key==="Enter" && send()} />
          <button onClick={send} disabled={!text.trim()} className="w-9 h-9 bg-primary rounded-full flex items-center justify-center disabled:opacity-40"><Send className="w-4 h-4 text-white" /></button>
        </div>
      </div>
    </div>
  );
}
