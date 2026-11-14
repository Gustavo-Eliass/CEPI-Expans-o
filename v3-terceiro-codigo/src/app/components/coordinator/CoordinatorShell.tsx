import { useState } from "react";
import { X, Bell, Eye, LogOut, Sparkles, Flag, BarChart2, Zap } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import cepiLogo from "@/imports/image.png";
import { CePiBotPanel } from "@/app/components/bot/CePiBotPanel";
import { CoordAIDecided } from "@/app/components/coordinator/CoordAIDecided";
import { CoordAIFlagged } from "@/app/components/coordinator/CoordAIFlagged";
import { CoordDashboard } from "@/app/components/coordinator/CoordDashboard";
import { CoordReportsQueue } from "@/app/components/coordinator/CoordReportsQueue";
import { COORD_REPORTS_INIT, COORD_AI_FLAGGED_INIT, COORD_AI_DECIDED_INIT } from "@/app/data/moderation";
import type { CoordTab, AppUser, ReportItem, AIDecidedItem } from "@/app/types";

export function CoordinatorShell({ user, onLogout }: { user:AppUser; onLogout:()=>void }) {
  const [tab, setTab] = useState<CoordTab>("dashboard");
  const [reports, setReports] = useState<ReportItem[]>(COORD_REPORTS_INIT);
  const [aiReports, setAiReports] = useState<ReportItem[]>(COORD_AI_FLAGGED_INIT);
  const [aiDecided, setAiDecided] = useState<AIDecidedItem[]>(COORD_AI_DECIDED_INIT);
  const [showBot, setShowBot] = useState(false);
  const ini = user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  const navItems: { key:CoordTab; Icon:React.ElementType; label:string; badge?:number }[] = [
    { key:"dashboard",  Icon:BarChart2, label:"Visão geral" },
    { key:"reports",    Icon:Flag,      label:"Fila de denúncias",   badge:reports.filter(r=>!r.resolved).length },
    { key:"ai-flagged", Icon:Zap,       label:"Sinalizadas pela IA", badge:aiReports.filter(r=>!r.resolved).length },
    { key:"ai-decided", Icon:Eye,       label:"Decididas pela IA" },
  ];

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-background pt-safe">
      <aside className="hidden md:flex flex-col border-r border-border bg-card flex-shrink-0 w-56 xl:w-64">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-border flex-shrink-0"><ImageWithFallback src={cepiLogo} alt="CEPI" className="w-full h-full object-contain p-0.5" /></div>
          <div className="min-w-0"><p className="font-black text-foreground text-base leading-none">EduLink</p><p className="text-xs text-muted-foreground truncate">Coordenação</p></div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
          {navItems.map(({ key, Icon, label, badge }) => {
            const active = tab === key;
            return (
              <button key={key} onClick={() => setTab(key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${active ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
                {badge !== undefined && badge > 0 && <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 min-w-[20px] text-center">{badge}</span>}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-muted cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{ini}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-bold text-foreground truncate">{user.name}</p><p className="text-xs text-muted-foreground">Coordenador</p></div>
            <button onClick={onLogout} title="Sair"><LogOut className="w-4 h-4 text-muted-foreground" /></button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-6">
          <div className="min-w-0"><h1 className="truncate font-black text-foreground text-lg">{navItems.find(n=>n.key===tab)?.label}</h1><p className="hidden text-xs text-muted-foreground sm:block">Colégio CEPI Expansão · Painel de moderação</p></div>
          <button className="relative w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"><Bell className="w-5 h-5 text-muted-foreground" /></button>
        </header>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {tab==="dashboard"  && <CoordDashboard reports={reports} aiReports={aiReports} />}
          {tab==="reports"    && <CoordReportsQueue reports={reports} setReports={setReports} coordName={user.name} />}
          {tab==="ai-flagged" && <CoordAIFlagged items={aiReports} setItems={setAiReports} coordName={user.name} />}
          {tab==="ai-decided" && <CoordAIDecided items={aiDecided} setItems={setAiDecided} />}
        </div>
        <nav aria-label="Navegação da coordenação" className="grid flex-shrink-0 grid-cols-4 border-t border-border bg-card pb-safe md:hidden">
          {navItems.map(({ key, Icon, label, badge }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 px-1 py-2 text-center text-[10px] font-semibold leading-tight ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {badge !== undefined && badge > 0 && <span className="absolute -right-2 -top-2 min-w-4 rounded-full bg-red-500 px-1 text-[9px] leading-4 text-white">{badge}</span>}
                </span>
                <span className="line-clamp-2">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <button onClick={() => setShowBot(b=>!b)} aria-label={showBot ? "Fechar CePiBot" : "Abrir CePiBot"} className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-xl transition-all hover:scale-105 hover:bg-[#085a30] md:bottom-6 md:right-6">
        {showBot ? <X className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
      </button>
      {showBot && <CePiBotPanel onClose={() => setShowBot(false)} user={user} />}
    </div>
  );
}
