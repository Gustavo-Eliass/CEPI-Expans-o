import { useState, useRef, useCallback } from "react";
import { Play, Heart, Eye, Bookmark, Lock, ChevronDown, ChevronUp, Volume2, VolumeX } from "lucide-react";
import { Tag } from "@/app/components/common/Tag";
import { TeacherAvatar } from "@/app/components/common/TeacherAvatar";
import { unsplash, SHORTS_DATA } from "@/app/data/feed";
import type { Role } from "@/app/types";

export function ShortsTab({ role }: { role:Role }) {
  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);
  const lastWheelTime = useRef(0);
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now-lastWheelTime.current < 700) return;
    lastWheelTime.current = now;
    if (e.deltaY>30) setIdx(i => Math.min(SHORTS_DATA.length-1, i+1));
    else if (e.deltaY<-30) setIdx(i => Math.max(0, i-1));
  }, []);
  const s = SHORTS_DATA[idx];
  return (
    <div className="flex-1 overflow-hidden bg-black relative" onWheel={handleWheel}>
      <div className="absolute inset-0 transition-all duration-500">
        <img src={unsplash(s.img, 800, 1200)} alt={s.title} className="w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
      </div>
      {(role==="student"||role==="guardian") && <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5"><Lock className="w-3 h-3 text-yellow-400" /><span className="text-white text-xs font-semibold">Só professores postam</span></div>}
      <button onClick={() => setMuted(m=>!m)} className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">{muted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}</button>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"><Play className="w-7 h-7 text-white fill-white ml-1" /></div></div>
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-5">
        <button onClick={() => setLiked(l => l.includes(s.id) ? l.filter(x=>x!==s.id) : [...l,s.id])} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center"><Heart className={`w-6 h-6 ${liked.includes(s.id) ? "fill-red-500 text-red-500" : "text-white"}`} /></div>
          <span className="text-white text-xs font-bold">{liked.includes(s.id) ? s.likes+1 : s.likes}</span>
        </button>
        <button className="flex flex-col items-center gap-1"><div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center"><Eye className="w-6 h-6 text-white" /></div><span className="text-white text-xs font-bold">{s.views}</span></button>
        <button className="flex flex-col items-center gap-1"><div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center"><Bookmark className="w-6 h-6 text-white" /></div><span className="text-white text-xs font-bold">Salvar</span></button>
      </div>
      <div className="absolute bottom-0 left-0 right-16 p-5 pb-8">
        <div className="flex items-center gap-3 mb-3"><TeacherAvatar t={s.t} size="sm" /><div><p className="text-white font-bold text-sm drop-shadow">Prof. {s.t.name}</p><Tag name={s.t.subj} col="#ffffff" /></div></div>
        <p className="text-white font-semibold text-base leading-snug mb-2">{s.title}</p>
        <p className="text-white/70 text-xs">{s.dur} · {s.views} visualizações</p>
      </div>
      <div className="absolute right-1/2 translate-x-1/2 bottom-3 flex flex-col items-center gap-1">
        {idx>0 && <ChevronUp className="w-5 h-5 text-white/60 animate-bounce" />}
        <div className="flex gap-1">{SHORTS_DATA.map((_,i) => <button key={i} onClick={() => setIdx(i)} className={`rounded-full transition-all ${i===idx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`} />)}</div>
        {idx<SHORTS_DATA.length-1 && <ChevronDown className="w-5 h-5 text-white/60 animate-bounce" />}
      </div>
    </div>
  );
}
