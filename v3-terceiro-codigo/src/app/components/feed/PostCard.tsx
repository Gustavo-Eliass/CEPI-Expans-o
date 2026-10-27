import { useState } from "react";
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Flag, Share2 } from "lucide-react";
import { Tag } from "@/app/components/common/Tag";
import { TeacherAvatar } from "@/app/components/common/TeacherAvatar";
import { unsplash } from "@/app/data/feed";
import type { Post } from "@/app/types";

export function PostCard({ post, onLike, onComment, onReport, onShare, readonly }: { post:Post; onLike:(id:number)=>void; onComment:(p:Post)=>void; onReport:(p:Post)=>void; onShare?:(p:Post)=>void; readonly?:boolean }) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <TeacherAvatar t={post.t} size="md" />
        <div className="flex-1 min-w-0"><p className="font-bold text-foreground text-sm">Prof. {post.t.name}</p><div className="flex items-center gap-2 mt-0.5"><Tag name={post.subj} col={post.t.col} /><span className="text-xs text-muted-foreground">{post.age}</span></div></div>
        <div className="relative">
          <button onClick={() => setShowMenu(s=>!s)} className="p-1 rounded-lg hover:bg-muted"><MoreHorizontal className="w-5 h-5 text-muted-foreground" /></button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-card border border-border rounded-xl shadow-lg z-10 py-1 min-w-[160px]">
              <button onClick={() => { onReport(post); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 text-left"><Flag className="w-4 h-4" /> Denunciar post</button>
              <button onClick={() => setShowMenu(false)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted text-left"><Bookmark className="w-4 h-4" /> Salvar</button>
            </div>
          )}
        </div>
      </div>
      <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.body}</p>
      {post.img && <div className="mx-4 mb-3 rounded-xl overflow-hidden bg-muted"><img src={unsplash(post.img, 680, 380)} alt="Conteúdo" className="w-full object-cover" /></div>}
      {!readonly && (
        <div className="flex items-center gap-1 px-4 py-2.5 border-t border-border/50">
          <button onClick={() => onLike(post.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"><Heart className={`w-5 h-5 ${post.liked ? "fill-current text-red-500" : "text-muted-foreground"}`} /><span className="text-xs font-semibold text-muted-foreground">{post.likes}</span></button>
          <button onClick={() => onComment(post)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"><MessageCircle className="w-5 h-5 text-muted-foreground" /><span className="text-xs font-semibold text-muted-foreground">{post.comments.length}</span></button>
          {onShare && <button onClick={() => onShare(post)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors ml-auto"><Share2 className="w-4 h-4 text-muted-foreground" /><span className="text-xs font-semibold text-muted-foreground">+8 EXP</span></button>}
        </div>
      )}
    </div>
  );
}
