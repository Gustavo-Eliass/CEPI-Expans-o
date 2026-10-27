import { useState, useRef } from "react";
import { Home, Play, BookOpen, Users, User, Plus, X, Bell, Search, Sparkles, CalendarDays, Trophy, ClipboardList } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import cepiLogo from "@/imports/image.png";
import { CePiBotPanel } from "@/app/components/bot/CePiBotPanel";
import { StoryViewer } from "@/app/components/feed/StoryViewer";
import { ExpBar } from "@/app/components/gamification/ExpBar";
import { ExpToast } from "@/app/components/gamification/ExpToast";
import { FlameIcon } from "@/app/components/gamification/FlameIcon";
import { LevelUpModal } from "@/app/components/gamification/LevelUpModal";
import { CommentsModal } from "@/app/components/modals/CommentsModal";
import { CreateModal } from "@/app/components/modals/CreateModal";
import { GradesModal } from "@/app/components/modals/GradesModal";
import { ReportModal } from "@/app/components/modals/ReportModal";
import { AccountTab } from "@/app/components/tabs/AccountTab";
import { ActivitiesTab } from "@/app/components/tabs/ActivitiesTab";
import { AgendaTab } from "@/app/components/tabs/AgendaTab";
import { CommunityTab } from "@/app/components/tabs/CommunityTab";
import { FeedTab } from "@/app/components/tabs/FeedTab";
import { LibraryTab } from "@/app/components/tabs/LibraryTab";
import { ProgressTab } from "@/app/components/tabs/ProgressTab";
import { ShortsTab } from "@/app/components/tabs/ShortsTab";
import { TEACHERS, INIT_STORIES, INIT_POSTS } from "@/app/data/feed";
import { ACTIVITIES_DATA } from "@/app/data/school";
import type { Tab, CreateType, AppUser, Activity, ExpEntry, Story, Post } from "@/app/types";
import { getFireLevel, getExpPct } from "@/app/utils/gamification";

export function AppShell({ user, onLogout }: { user:AppUser; onLogout:()=>void }) {
  const [tab, setTab] = useState<Tab>("feed");
  const [posts, setPosts] = useState<Post[]>(INIT_POSTS);
  const [stories, setStories] = useState<Story[]>(INIT_STORIES);
  const [activeStory, setActiveStory] = useState<Story|null>(null);
  const [commentPost, setCommentPost] = useState<Post|null>(null);
  const [reportPost, setReportPost] = useState<Post|null>(null);
  const [reportStory, setReportStory] = useState<Story|null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [showGrades, setShowGrades] = useState(false);
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES_DATA);

  // ── EXP / Gamification (students only) ──
  const [exp, setExp] = useState(87);
  const [expHistory, setExpHistory] = useState<ExpEntry[]>([
    { id:1, reason:"Compartilhou story na turma", amount:8, time:"há 10min" },
    { id:2, reason:"Comentou em um post",         amount:5, time:"há 25min" },
    { id:3, reason:"Curtiu um post",               amount:2, time:"há 45min" },
    { id:4, reason:"Enviou mensagem para a turma", amount:3, time:"há 1h" },
    { id:5, reason:"Abriu material de estudo",     amount:5, time:"há 2h" },
    { id:6, reason:"Atividade concluída!",         amount:20, time:"ontem" },
    { id:7, reason:"Abriu material de estudo",     amount:5, time:"ontem" },
    { id:8, reason:"Curtiu um post",               amount:2, time:"ontem" },
  ]);
  const [expToast, setExpToast] = useState<{ id:number; amount:number; reason:string }|null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ oldLevel:number; newLevel:number }|null>(null);
  const expRef = useRef(exp);
  expRef.current = exp;

  const isStudent = user.role === "student";
  const isTeacher = user.role === "teacher";
  const ini = user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const teacherData = TEACHERS.find(t => t.name===user.name);

  const gainExp = (amount:number, reason:string) => {
    if (!isStudent) return;
    const cur = expRef.current;
    const next = cur + amount;
    const oldLvl = getFireLevel(cur).level;
    const newLvl = getFireLevel(next).level;
    setExp(next);
    if (newLvl > oldLvl) setLevelUpInfo({ oldLevel:oldLvl, newLevel:newLvl });
    setExpHistory(h => [{ id:Date.now(), reason, amount, time:"agora" }, ...h.slice(0,9)]);
    const tid = Date.now();
    setExpToast({ id:tid, amount, reason });
    setTimeout(() => setExpToast(v => v?.id===tid ? null : v), 2500);
  };

  const handleLike = (id:number) => {
    setPosts(ps => ps.map(p => {
      if (p.id===id) {
        if (!p.liked) gainExp(2, "Curtiu um post");
        return { ...p, liked:!p.liked, likes:p.liked?p.likes-1:p.likes+1 };
      }
      return p;
    }));
  };
  const handleAddComment = (postId:number, text:string) => setPosts(ps => ps.map(p => p.id===postId ? {...p, comments:[...p.comments,{id:Date.now(),user:isTeacher?`Prof. ${user.name}`:user.name,text,age:"agora"}]} : p));
  const handleStory = (s:Story) => { setActiveStory(s); setStories(prev => prev.map(st => st.id===s.id ? {...st, viewed:true} : st)); };
  const handleCreate = (type:CreateType, body:string, subject:string) => {
    if (type==="post") { const t=TEACHERS.find(t=>t.subj===subject)??TEACHERS[0]; setPosts(ps => [{id:Date.now(),t,age:"agora",subj:subject,body,img:null,likes:0,liked:false,comments:[]},...ps]); }
    if (type==="story") { const t=TEACHERS.find(t=>t.subj===subject)??TEACHERS[0]; setStories(prev => [{id:Date.now(),t,viewed:false,img:t.photo,caption:body},...prev]); }
  };
  const handleActivityComplete = (id:number) => {
    setActivities(acts => acts.map(a => a.id===id ? {...a, status:"concluida"} : a));
    gainExp(20, "Atividade concluída!");
  };

  const currentLvl = getFireLevel(exp);

  const baseNav: { key:Tab; Icon:React.ElementType; label:string; badge?:string }[] = [
    { key:"feed",      Icon:Home,         label:"Início" },
    { key:"shorts",    Icon:Play,         label:"Shorts", badge:"5" },
    { key:"library",   Icon:BookOpen,     label:"Biblioteca" },
    ...(isStudent ? [
      { key:"activities" as Tab, Icon:ClipboardList, label:"Atividades", badge: activities.filter(a=>a.status==="pendente").length.toString() },
    ] : []),
    { key:"community", Icon:Users,        label:"Turma" },
    { key:"agenda",    Icon:CalendarDays, label:"Agenda" },
    ...(isStudent ? [
      { key:"progress" as Tab, Icon:Trophy, label:"Progresso" },
    ] : []),
    { key:"account",   Icon:User,         label:"Conta" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="flex flex-col border-r border-border bg-card flex-shrink-0 w-56 xl:w-64">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-border flex-shrink-0"><ImageWithFallback src={cepiLogo} alt="CEPI" className="w-full h-full object-contain p-0.5" /></div>
          <div className="min-w-0"><p className="font-black text-foreground text-base leading-none">EduLink</p><p className="text-xs text-muted-foreground truncate">CEPI Expansão</p></div>
        </div>
        <div className="px-3 py-3 border-b border-border">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2"><Search className="w-4 h-4 text-muted-foreground flex-shrink-0" /><input className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Buscar..." /></div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {baseNav.map(({ key, Icon, label, badge }) => {
            const active = tab===key;
            return <button key={key} onClick={() => setTab(key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${active ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="w-5 h-5 flex-shrink-0" />{label}{badge && badge!=="0" && <span className="ml-auto text-xs bg-primary text-white rounded-full px-1.5 py-0.5">{badge}</span>}</button>;
          })}
          {isTeacher && (<><div className="h-px bg-border my-2" /><button onClick={() => setShowCreate(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-[#085a30] transition-colors"><Plus className="w-5 h-5 flex-shrink-0" /> Criar conteúdo</button></>)}
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex flex-col gap-2 px-2 py-2 rounded-xl hover:bg-muted cursor-pointer" onClick={() => isStudent && setTab("progress")}>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{ini}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-bold text-foreground truncate">{isTeacher?"Prof. ":""}{user.name.split(" ")[0]}</p><p className="text-xs text-muted-foreground">{user.role==="guardian" ? `Resp. por ${user.guardianOf}` : user.role==="student" ? `${user.grade} ${user.turma}` : "Professor"}</p></div>
              <Bell className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
            {isStudent && (
              <div className="pl-0.5">
                <ExpBar exp={exp} compact />
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card flex-shrink-0">
          <div>
            <h1 className="font-black text-foreground text-lg">{baseNav.find(n=>n.key===tab)?.label ?? tab}</h1>
            {tab!=="shorts" && <p className="text-xs text-muted-foreground">{user.role==="student" ? `${user.grade} ${user.turma}` : user.role==="guardian" ? `Responsável por ${user.guardianOf}` : "Professor · CEPI Expansão"}</p>}
          </div>
          <div className="flex items-center gap-3">
            {isStudent && (
              <button onClick={() => setTab("progress")} className="flex items-center gap-2 bg-muted rounded-2xl px-3 py-1.5 hover:bg-secondary transition-colors">
                <FlameIcon level={currentLvl.level} size={20} />
                <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width:`${getExpPct(exp)}%`, backgroundColor:currentLvl.color }} />
                </div>
                <span className="text-xs font-black text-foreground">{exp}</span>
              </button>
            )}
            <button className="relative w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"><Bell className="w-5 h-5 text-muted-foreground" /><span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card" /></button>
          </div>
        </header>
        <div className="flex-1 overflow-hidden flex">
          {tab==="feed"       && <FeedTab user={user} posts={posts} stories={stories} onLike={handleLike} onComment={setCommentPost} onStory={handleStory} onReport={setReportPost} onReportStory={setReportStory} onGainExp={gainExp} />}
          {tab==="shorts"     && <ShortsTab role={user.role} />}
          {tab==="library"    && <LibraryTab user={user} onGainExp={gainExp} />}
          {tab==="activities" && <ActivitiesTab activities={activities} onComplete={handleActivityComplete} exp={exp} />}
          {tab==="community"  && <CommunityTab user={user} onGainExp={gainExp} />}
          {tab==="agenda"     && <AgendaTab user={user} />}
          {tab==="progress"   && <ProgressTab exp={exp} expHistory={expHistory} user={user} />}
          {tab==="account"    && <AccountTab user={user} onLogout={onLogout} onShowGrades={() => setShowGrades(true)} />}
        </div>
      </div>

      <button onClick={() => setShowBot(b=>!b)} className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl hover:bg-[#085a30] transition-all hover:scale-105">
        {showBot ? <X className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
      </button>
      {showBot && <CePiBotPanel onClose={() => setShowBot(false)} user={user} />}

      {activeStory && <StoryViewer story={activeStory} all={stories} onClose={() => setActiveStory(null)} onNav={id => { const s=stories.find(x=>x.id===id); if(s) handleStory(s); }} onReport={() => { setReportStory(activeStory); setActiveStory(null); }} />}
      {commentPost && <CommentsModal post={commentPost} user={user} onClose={() => setCommentPost(null)} onAdd={handleAddComment} onGainExp={gainExp} />}
      {(reportPost||reportStory) && <ReportModal contentType={reportPost?"post":"story"} onClose={() => { setReportPost(null); setReportStory(null); }} />}
      {showCreate && isTeacher && <CreateModal onClose={() => setShowCreate(false)} onPost={handleCreate} teacherSubject={teacherData?.subj} />}
      {showGrades && <GradesModal user={user} onClose={() => setShowGrades(false)} />}

      {expToast && <ExpToast amount={expToast.amount} reason={expToast.reason} />}
      {levelUpInfo && <LevelUpModal oldLevel={levelUpInfo.oldLevel} newLevel={levelUpInfo.newLevel} exp={exp} onClose={() => setLevelUpInfo(null)} />}
    </div>
  );
}
