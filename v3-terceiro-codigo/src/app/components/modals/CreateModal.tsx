import { useState } from "react";
import { BookOpen, X, ChevronRight, FileText, Camera, Upload, ArrowLeft, Check } from "lucide-react";
import { LIBRARY } from "@/app/data/library";
import type { CreateType, Story } from "@/app/types";

export function CreateModal({ onClose, onPost, teacherSubject }: { onClose:()=>void; onPost:(type:CreateType, body:string, subject:string)=>void; teacherSubject?:string }) {
  const subjects = teacherSubject ? [teacherSubject] : Object.keys(LIBRARY);
  const [type, setType] = useState<CreateType|null>(null);
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState(subjects[0] ?? "Matemática");
  const [done, setDone] = useState(false);

  if (done) return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-10 flex flex-col items-center gap-3 shadow-2xl"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"><Check className="w-8 h-8 text-green-600" /></div><p className="font-black text-foreground text-lg">Publicado!</p></div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border"><h3 className="font-black text-foreground">Criar conteúdo</h3><button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button></div>
        {!type ? (
          <div className="p-6 space-y-3">
            {([
              { t:"post" as CreateType, label:"Publicação no Feed", desc:"Foto, vídeo ou texto", Icon:FileText, col:"#0a6b38" },
              { t:"story" as CreateType, label:"Story",             desc:"Foto/vídeo (24h)",     Icon:Camera,   col:"#c0392b" },
              { t:"library" as CreateType, label:"Adicionar à Biblioteca", desc:"PDF, vídeo ou material", Icon:BookOpen, col:"#003087" },
            ]).map(({ t:tp, label, desc, Icon, col }) => (
              <button key={tp} onClick={() => setType(tp)} className="w-full flex items-center gap-4 rounded-2xl border border-border p-4 hover:bg-muted/50 text-left">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor:col+"22" }}><Icon className="w-6 h-6" style={{ color:col }} /></div>
                <div className="flex-1"><p className="font-bold text-sm">{label}</p><p className="text-xs text-muted-foreground mt-0.5">{desc}</p></div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <button onClick={() => setType(null)} className="flex items-center gap-1 text-primary text-sm font-semibold"><ArrowLeft className="w-4 h-4" /> Voltar</button>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Matéria</label>
              <select className="w-full rounded-xl border border-border bg-input-background px-3 py-2.5 text-sm outline-none" value={subject} onChange={e => setSubject(e.target.value)}>
                {subjects.map(s => <option key={s}>{s}</option>)}
              </select>
              {teacherSubject && <p className="text-xs text-muted-foreground mt-1">Publicando em: {teacherSubject}</p>}
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Conteúdo</label>
              <textarea className="w-full rounded-xl border border-border bg-input-background px-4 py-3 text-sm outline-none resize-none" rows={4} placeholder="Escreva aqui..." value={body} onChange={e => setBody(e.target.value)} />
            </div>
            <button className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-muted-foreground text-sm hover:bg-muted/40"><Upload className="w-4 h-4" /> Anexar arquivo (PDF / Foto / Vídeo)</button>
            <button onClick={() => { onPost(type!, body, subject); setDone(true); setTimeout(onClose, 1200); }} disabled={!body.trim()} className="w-full bg-primary text-white rounded-xl py-3 font-bold text-sm disabled:opacity-40">Publicar →</button>
          </div>
        )}
      </div>
    </div>
  );
}
