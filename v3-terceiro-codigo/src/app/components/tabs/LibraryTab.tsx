import { useState } from "react";
import { ChevronRight, Video, FileText, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { LIBRARY } from "@/app/data/library";
import type { AppUser } from "@/app/types";

export function LibraryTab({ user, onGainExp }: { user:AppUser; onGainExp?:(amount:number, reason:string)=>void }) {
  const [openSubject, setOpenSubject] = useState<string|null>(null);
  const [openBimester, setOpenBimester] = useState<string|null>(null);
  const [openTopic, setOpenTopic] = useState<string|null>(null);

  if (openSubject) {
    const sub = LIBRARY[openSubject];
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[860px] mx-auto py-6 px-4">
          <button onClick={() => { setOpenSubject(null); setOpenBimester(null); setOpenTopic(null); }} className="flex items-center gap-2 text-primary font-semibold text-sm mb-5 hover:underline"><ArrowLeft className="w-4 h-4" /> Voltar à biblioteca</button>
          <div className="flex items-center gap-4 mb-6"><div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor:sub.bg }}>{sub.icon}</div><div><h2 className="text-2xl font-black text-foreground">{openSubject}</h2><p className="text-sm text-muted-foreground">{user.grade}</p></div></div>
          <div className="space-y-3">
            {sub.bimesters.map(bim => (
              <div key={bim.name} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button onClick={() => setOpenBimester(openBimester===bim.name ? null : bim.name)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor:sub.col }}>{bim.name[0]}</div><span className="font-bold text-foreground">{bim.name}</span><span className="text-xs text-muted-foreground">{bim.topics.length} tópicos</span></div>
                  {openBimester===bim.name ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>
                {openBimester===bim.name && (
                  <div className="border-t border-border divide-y divide-border">
                    {bim.topics.map(topic => (
                      <div key={topic.name}>
                        <button onClick={() => setOpenTopic(openTopic===topic.name ? null : topic.name)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/20">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor:sub.col }} /><span className="text-sm font-semibold">{topic.name}</span><span className="text-xs text-muted-foreground">{topic.files.length} arquivos</span></div>
                          {openTopic===topic.name ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                        </button>
                        {openTopic===topic.name && (
                          <div className="bg-muted/30 px-5 pb-3 space-y-2">
                            {topic.files.map(f => (
                              <button key={f.n} onClick={() => onGainExp?.(5, `Abriu material: ${f.n.replace(/\.pdf|\.video/i,"")}`)} className="w-full flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 hover:bg-muted/50 text-left">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor:sub.col+"22" }}>{f.type==="video" ? <Video className="w-4 h-4" style={{ color:sub.col }} /> : <FileText className="w-4 h-4" style={{ color:sub.col }} />}</div>
                                <div className="flex-1 min-w-0"><p className="text-xs font-semibold truncate">{f.n}</p><p className="text-xs text-muted-foreground">{f.type==="video" ? "Videoaula" : "PDF"}</p></div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  {user.role==="student" && <span className="text-xs text-primary font-bold">+5</span>}
                                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[860px] mx-auto py-6 px-4">
        <div className="mb-6"><h2 className="text-2xl font-black text-foreground">Biblioteca</h2><p className="text-sm text-muted-foreground mt-1">{user.role==="guardian" ? `Materiais de ${user.guardianOf}` : `Materiais do ${user.grade}`}</p></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(LIBRARY).map(([name, sub]) => {
            const total = sub.bimesters.reduce((a,b) => a+b.topics.reduce((c,t) => c+t.files.length,0),0);
            return <button key={name} onClick={() => { setOpenSubject(name); setOpenBimester(null); setOpenTopic(null); }} className="rounded-2xl p-5 text-left border border-border hover:scale-[1.02] hover:shadow-md transition-all" style={{ backgroundColor:sub.bg }}><span className="text-4xl">{sub.icon}</span><p className="font-black text-foreground text-base mt-3 leading-tight">{name}</p><p className="text-xs font-semibold mt-1" style={{ color:sub.col }}>{sub.bimesters.length} bimestres · {total} arquivos</p></button>;
          })}
        </div>
      </div>
    </div>
  );
}
