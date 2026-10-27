import { Shield } from "lucide-react";
import { Tag } from "@/app/components/common/Tag";
import { TeacherAvatar } from "@/app/components/common/TeacherAvatar";
import { PostCard } from "@/app/components/feed/PostCard";
import { unsplash, TEACHERS } from "@/app/data/feed";
import { AGENDA_DATA } from "@/app/data/school";
import type { AppUser, Story, Post } from "@/app/types";

export function FeedTab({ user, posts, stories, onLike, onComment, onStory, onReport, onReportStory, onGainExp }: {
  user:AppUser; posts:Post[]; stories:Story[];
  onLike:(id:number)=>void; onComment:(p:Post)=>void; onStory:(s:Story)=>void;
  onReport:(p:Post)=>void; onReportStory:(s:Story)=>void;
  onGainExp?:(amount:number, reason:string)=>void;
}) {
  const isReadonly = user.role==="guardian";
  const handleShare = (p:Post) => onGainExp?.(8, `Compartilhou post de ${p.t.name.split(" ")[0]}`);
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[640px] mx-auto py-6 px-4 space-y-5">
          {user.role==="guardian" && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-3 flex items-center gap-3">
              <Shield className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <p className="text-sm text-orange-800 font-medium">Você está vendo o feed de <strong>{user.guardianOf}</strong> ({user.grade} {user.turma})</p>
            </div>
          )}
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Stories dos professores</p>
            <div className="flex gap-5 overflow-x-auto pb-1">
              {stories.map(s => (
                <button key={s.id} onClick={() => onStory(s)} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
                  <div className={`p-0.5 rounded-full transition-all ${s.viewed ? "bg-border" : "bg-gradient-to-tr from-[#0a6b38] to-[#3a9d5c]"} group-hover:scale-105`}>
                    <div className="bg-white p-0.5 rounded-full"><div className="w-14 h-14 rounded-full overflow-hidden"><img src={unsplash(s.t.photo, 120, 120)} alt={s.t.name} className="w-full h-full object-cover" /></div></div>
                  </div>
                  <span className="text-xs font-semibold text-foreground max-w-[64px] truncate">{s.t.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
          {posts.map(p => <PostCard key={p.id} post={p} onLike={onLike} onComment={onComment} onReport={onReport} onShare={isReadonly ? undefined : handleShare} readonly={isReadonly} />)}
        </div>
      </div>
      <div className="hidden xl:block w-72 border-l border-border overflow-y-auto p-4 space-y-4 flex-shrink-0">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Professores</p>
          <div className="space-y-3">
            {TEACHERS.map(t => <div key={t.id} className="flex items-center gap-3"><TeacherAvatar t={t} size="sm" /><div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{t.name}</p><Tag name={t.subj} col={t.col} /></div></div>)}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Próximas datas</p>
          <div className="space-y-2">
            {AGENDA_DATA.events.slice(0,4).map(({ date, name:n, col }) => (
              <div key={n} className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ backgroundColor:col }}>{date.split("/")[0]}</div><div><p className="text-xs font-semibold text-foreground">{n}</p><p className="text-xs text-muted-foreground">{date}</p></div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
