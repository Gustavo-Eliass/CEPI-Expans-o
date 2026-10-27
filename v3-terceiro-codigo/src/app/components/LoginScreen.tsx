import { useState } from "react";
import { User, GraduationCap, Check, Shield, Baby } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import cepiLogo from "@/imports/image.png";
import { GUARDIANS } from "@/app/data/feed";
import type { Role, AppUser } from "@/app/types";

export function LoginScreen({ onLogin }: { onLogin:(u:AppUser)=>void }) {
  const [role, setRole] = useState<Role|null>(null);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("5º Ano");
  const [turma, setTurma] = useState("B");
  const [guardian, setGuardian] = useState("");
  const [child, setChild] = useState<{ name:string; grade:string; turma:string }|null>(null);
  const guardianData = GUARDIANS.find(g => g.name === guardian);

  const handleLogin = () => {
    if (role==="guardian") { if (!guardian || !child) return; onLogin({ name:guardian, role:"guardian", grade:child.grade, turma:child.turma, guardianOf:child.name }); }
    else { if (!name.trim()) return; onLogin({ name:name.trim(), role:role!, grade, turma }); }
  };

  const roles: { r:Role; label:string; Icon:React.ElementType; desc:string }[] = [
    { r:"student",     label:"Sou Aluno",       Icon:User,          desc:"Feed e conteúdos" },
    { r:"teacher",     label:"Sou Professor",   Icon:GraduationCap, desc:"Publique turmas" },
    { r:"guardian",    label:"Sou Responsável", Icon:Baby,          desc:"Acompanhe filhos" },
    { r:"coordinator", label:"Sou Coordenador", Icon:Shield,        desc:"Moderação" },
  ];

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
          <p className="text-muted-foreground text-sm mb-5">Como você deseja entrar?</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
            {roles.map(({ r, label, Icon, desc }) => (
              <button key={r} onClick={() => { setRole(r); setGuardian(""); setChild(null); }}
                className={`rounded-2xl p-3 border-2 text-left transition-all ${role===r ? "border-primary bg-secondary" : "border-border bg-muted/30 hover:border-primary/40"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${role===r ? "bg-primary" : "bg-muted"}`}>
                  <Icon className={`w-5 h-5 ${role===r ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <p className={`text-xs font-bold leading-tight ${role===r ? "text-primary" : "text-foreground"}`}>{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight hidden md:block">{desc}</p>
              </button>
            ))}
          </div>

          {role && role!=="guardian" && (
            <div className="flex flex-col gap-3">
              {role==="coordinator" && <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex items-center gap-2"><Shield className="w-4 h-4 text-primary flex-shrink-0" /><p className="text-xs text-primary font-medium">Acesso ao painel de moderação e denúncias</p></div>}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Nome</label>
                <input className="w-full rounded-xl border border-border bg-input-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder={role==="student" ? "Ex: João Victor" : role==="coordinator" ? "Ex: Maria Coordenadora" : "Ex: Carlos Silva"}
                  value={name} onChange={e => setName(e.target.value)} />
              </div>
              {role==="student" && (
                <div className="grid grid-cols-2 gap-3">
                  {([["Série", grade, setGrade, ["3º Ano","4º Ano","5º Ano","6º Ano","7º Ano","8º Ano","9º Ano"]],["Turma", turma, setTurma, ["A","B","C","D"]]] as [string,string,(v:string)=>void,string[]][]).map(([lbl, val, fn, opts]) => (
                    <div key={lbl}>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">{lbl}</label>
                      <select className="w-full rounded-xl border border-border bg-input-background px-3 py-3 text-sm outline-none" value={val} onChange={e => fn(e.target.value)}>
                        {opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={handleLogin} disabled={!name.trim()} className="w-full bg-primary text-white rounded-xl py-3.5 font-bold text-sm disabled:opacity-40 hover:bg-[#085a30] transition-colors mt-1">Entrar →</button>
            </div>
          )}

          {role==="guardian" && (
            <div className="flex flex-col gap-3">
              <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-2"><Shield className="w-4 h-4 text-orange-600 flex-shrink-0" /><p className="text-xs text-orange-800 font-medium">Acesso exclusivo para responsáveis cadastrados</p></div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Selecione seu nome</label>
                <select className="w-full rounded-xl border border-border bg-input-background px-3 py-3 text-sm outline-none" value={guardian} onChange={e => { setGuardian(e.target.value); setChild(null); }}>
                  <option value="">Escolha o responsável...</option>
                  {GUARDIANS.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
                </select>
              </div>
              {guardianData && (
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Selecione o filho(a)</label>
                  <div className="space-y-2">
                    {guardianData.children.map(c => (
                      <button key={c.name} onClick={() => setChild(c)} className={`w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${child?.name===c.name ? "border-primary bg-secondary" : "border-border hover:border-primary/40"}`}>
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{c.name[0]}</div>
                        <div><p className={`font-bold text-sm ${child?.name===c.name ? "text-primary" : "text-foreground"}`}>{c.name}</p><p className="text-xs text-muted-foreground">{c.grade} · Turma {c.turma}</p></div>
                        {child?.name===c.name && <Check className="w-5 h-5 text-primary ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={handleLogin} disabled={!guardian || !child} className="w-full bg-primary text-white rounded-xl py-3.5 font-bold text-sm disabled:opacity-40 hover:bg-[#085a30] transition-colors">Entrar como responsável →</button>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground mt-6">Colégio CEPI Expansão · 2025</p>
        </div>
      </div>
    </div>
  );
}
