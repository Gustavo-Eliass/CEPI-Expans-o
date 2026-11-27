import { useState } from "react";
import { User, GraduationCap, Check, Shield, Baby } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import cepiLogo from "@/imports/image.png";
import { DEMO_ACCOUNTS, describeAccount } from "@/app/data/accounts";
import { GUARDIANS } from "@/app/data/feed";
import type { Role, AppUser } from "@/app/types";

const ROLES: { r:Role; label:string; Icon:React.ElementType; desc:string }[] = [
  { r:"student",     label:"Sou Aluno",       Icon:User,          desc:"Feed e conteúdos" },
  { r:"teacher",     label:"Sou Professor",   Icon:GraduationCap, desc:"Publique turmas" },
  { r:"guardian",    label:"Sou Responsável", Icon:Baby,          desc:"Acompanhe filhos" },
  { r:"coordinator", label:"Sou Coordenador", Icon:Shield,        desc:"Moderação" },
];

export function LoginScreen({ onLogin }: { onLogin:(u:AppUser)=>void }) {
  const [role, setRole] = useState<Role|null>(null);
  const account = role ? DEMO_ACCOUNTS[role] : null;
  const guardianChildren = GUARDIANS.find(g => g.name === DEMO_ACCOUNTS.guardian.name)?.children ?? [];
  const [child, setChild] = useState(guardianChildren[0]);

  const user: AppUser|null = account && account.role === "guardian" && child
    ? { ...account, grade:child.grade, turma:child.turma, guardianOf:child.name }
    : account;
  const ini = user ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "";

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#032815] via-[#054022] to-[#0a6b38]">
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 gap-8">
        <div className="w-48 h-48 bg-white rounded-3xl flex items-center justify-center shadow-2xl p-4"><ImageWithFallback src={cepiLogo} alt="Colégio CEPI Expansão" className="w-full h-full object-contain" /></div>
        <div className="text-center max-w-xs"><h1 className="text-4xl font-black text-white mb-3">EduLink</h1><p className="text-green-200 text-lg leading-relaxed">A rede social educacional do Colégio CEPI Expansão.</p></div>
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          {[["📚","Biblioteca","Materiais organizados"],["🎬","Shorts","Videoaulas rápidas"],["👨‍👩‍👧","Família","Acompanhe filhos"],["🛡️","Moderação","Coordenação segura"]].map(([icon,t,d]) => (
            <div key={t} className="bg-white/10 rounded-2xl p-3 text-center"><div className="text-2xl mb-1">{icon}</div><p className="text-white font-bold text-xs">{t}</p><p className="text-green-300 text-xs mt-0.5 leading-tight">{d}</p></div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:bg-white/5 lg:backdrop-blur-sm">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex lg:hidden items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border"><ImageWithFallback src={cepiLogo} alt="CEPI" className="w-full h-full object-contain" /></div>
            <div><h1 className="font-black text-foreground text-xl">EduLink</h1><p className="text-xs text-muted-foreground">Colégio CEPI Expansão</p></div>
          </div>
          <h2 className="font-black text-foreground text-2xl mb-1">Bem-vindo!</h2>
          <p className="text-muted-foreground text-sm mb-5">Escolha um perfil para entrar na demonstração.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
            {ROLES.map(({ r, label, Icon, desc }) => (
              <button key={r} onClick={() => setRole(r)}
                className={`rounded-2xl p-3 border-2 text-left transition-all ${role===r ? "border-primary bg-secondary" : "border-border bg-muted/30 hover:border-primary/40"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${role===r ? "bg-primary" : "bg-muted"}`}>
                  <Icon className={`w-5 h-5 ${role===r ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <p className={`text-xs font-bold leading-tight ${role===r ? "text-primary" : "text-foreground"}`}>{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight hidden md:block">{desc}</p>
              </button>
            ))}
          </div>

          {user && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-3">
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">{ini}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground truncate">{user.role==="teacher" ? `Prof. ${user.name}` : user.name}</p>
                  <p className="text-xs text-muted-foreground">{describeAccount(user)}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-2 py-1 flex-shrink-0">Demo</span>
              </div>

              {user.role==="guardian" && guardianChildren.length > 1 && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Acompanhar</p>
                  <div className="grid grid-cols-2 gap-2">
                    {guardianChildren.map(c => (
                      <button key={c.name} onClick={() => setChild(c)} className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-left transition-all ${child?.name===c.name ? "border-primary bg-secondary" : "border-border hover:border-primary/40"}`}>
                        <div className="min-w-0 flex-1"><p className={`font-bold text-sm ${child?.name===c.name ? "text-primary" : "text-foreground"}`}>{c.name}</p><p className="text-xs text-muted-foreground">{c.grade} · Turma {c.turma}</p></div>
                        {child?.name===c.name && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => onLogin(user)} className="w-full bg-primary text-white rounded-xl py-3.5 font-bold text-sm hover:bg-[#085a30] transition-colors mt-1">Entrar →</button>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground mt-6">Colégio CEPI Expansão · Contas de demonstração</p>
        </div>
      </div>
    </div>
  );
}
