import { X, ArrowLeft, Flag } from "lucide-react";
import { TeacherAvatar } from "@/app/components/common/TeacherAvatar";
import { unsplash } from "@/app/data/feed";
import type { Story } from "@/app/types";

export function StoryViewer({ story, all, onClose, onNav, onReport }: { story:Story; all:Story[]; onClose:()=>void; onNav:(id:number)=>void; onReport:()=>void }) {
  const idx = all.findIndex(s => s.id===story.id);
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-14 text-white/70 hover:text-white z-10"><X className="w-7 h-7" /></button>
      <button onClick={onReport} className="absolute top-4 right-4 text-white/70 hover:text-orange-400 z-10 transition-colors" title="Denunciar story"><Flag className="w-6 h-6" /></button>
      <div className="absolute top-4 left-4 right-28 flex gap-1 z-10">
        {all.map((s,i) => <div key={s.id} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"><div className={`h-full bg-white rounded-full ${i<idx?"w-full":i===idx?"animate-[grow_5s_linear_forwards]":"w-0"}`} /></div>)}
      </div>
      <div className="absolute top-10 left-4 z-10 flex items-center gap-3 mt-2"><TeacherAvatar t={story.t} size="md" /><div><p className="text-white font-bold text-sm drop-shadow">Prof. {story.t.name}</p><p className="text-white/70 text-xs">{story.t.subj}</p></div></div>
      <img src={unsplash(story.img, 600, 900)} alt={story.caption} className="h-full max-h-[90vh] rounded-2xl object-cover" />
      <div className="absolute bottom-8 left-0 right-0 px-6"><div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4"><p className="text-white font-semibold text-sm leading-relaxed">{story.caption}</p></div></div>
      {idx>0 && <button onClick={() => onNav(all[idx-1].id)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white"><ArrowLeft className="w-5 h-5" /></button>}
      {idx<all.length-1 && <button onClick={() => onNav(all[idx+1].id)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white rotate-180"><ArrowLeft className="w-5 h-5" /></button>}
    </div>
  );
}
