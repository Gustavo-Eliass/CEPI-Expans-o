import { Bell, ChevronRight, GraduationCap, Settings, LogOut, Bookmark, Award, Baby } from "lucide-react";
import { Tag } from "@/app/components/common/Tag";
import { GUARDIANS } from "@/app/data/feed";
import type { AppUser } from "@/app/types";

export function AccountTab({ user, onLogout, onShowGrades }: { user:AppUser; onLogout:()=>void; onShowGrades:()=>void }) {
  const ini = user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const isTeacher = user.role==="teacher";
  const isGuardian = user.role==="guardian";
  const stats = isTeacher
    ? [{ label:"Publicações",v:"12" },{ label:"Turmas",v:"4" },{ label:"Alunos",v:"128" }]
    : isGuardian
    ? [{ label:"Filhos",v:String(GUARDIANS.find(g=>g.name===user.name)?.children.length||1) },{ label:"Posts vistos",v:"34" },{ label:"Alertas",v:"0" }]
    : [{ label:"Curtidas",v:"47" },{ label:"Shorts vistos",v:"23" },{ label:"Salvos",v:"8" }];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[680px] mx-auto py-8 px-4">
        <div className="bg-card border border-border rounded-3xl overflow-hidden mb-5">
          <div className="h-24 bg-gradient-to-r from-[#0a6b38] to-[#3a9d5c]" />
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 rounded-full border-4 border-card bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg">{ini}</div>
              {isGuardian && <Tag name="Responsável" col="#c0392b" />}
              {isTeacher && <Tag name="Professor" col="#0a6b38" />}
              {!isTeacher && !isGuardian && <div className="flex gap-2"><Tag name={user.grade} col="#0a6b38" /><Tag name={`Turma ${user.turma}`} col="#1a5276" /></div>}
            </div>
            <h2 className="font-black text-foreground text-2xl">{isTeacher ? "Prof. " : ""}{user.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{isGuardian ? `Responsável por: ${user.guardianOf} (${user.grade} ${user.turma})` : "Colégio CEPI Expansão"}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">{stats.map(s => <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center"><p className="font-black text-foreground text-2xl">{s.v}</p><p className="text-xs text-muted-foreground mt-0.5">{s.label}</p></div>)}</div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <button onClick={onShowGrades} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0"><Award className="w-5 h-5 text-yellow-700" /></div>
            <div className="flex-1 text-left"><p className="font-semibold text-foreground text-sm">{isGuardian ? `Boletim de ${user.guardianOf}` : "Minhas Notas"}</p><p className="text-xs text-muted-foreground">Notas do semestre · 2025</p></div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          {[
            { Icon:Bell,          label:"Notificações",  sub:"Ativas" },
            { Icon:Settings,      label:"Configurações", sub:"Privacidade e conta" },
            ...(isTeacher ? [{ Icon:GraduationCap, label:"Minhas turmas", sub:"4 turmas ativas" }] : []),
            ...(isGuardian ? [{ Icon:Baby, label:"Meus filhos", sub:`${GUARDIANS.find(g=>g.name===user.name)?.children.length||1} aluno(s)` }] : []),
            { Icon:Bookmark, label:"Conteúdo salvo", sub:`${isTeacher?"3":"8"} itens` },
          ].map(({ Icon, label, sub }, i, arr) => (
            <button key={label} className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors ${i<arr.length-1?"border-b border-border":""}`}>
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0"><Icon className="w-5 h-5 text-secondary-foreground" /></div>
              <div className="flex-1 text-left"><p className="font-semibold text-foreground text-sm">{label}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
        <button onClick={onLogout} className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3.5 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors"><LogOut className="w-4 h-4" /> Sair da conta</button>
      </div>
    </div>
  );
}
