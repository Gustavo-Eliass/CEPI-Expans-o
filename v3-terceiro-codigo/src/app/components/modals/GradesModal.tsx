import { X, Award } from "lucide-react";
import { GRADES_DATA } from "@/app/data/school";
import type { AppUser } from "@/app/types";
import { gradeColor } from "@/app/utils/grades";

export function GradesModal({ user, onClose }: { user:AppUser; onClose:()=>void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center"><Award className="w-5 h-5 text-primary" /></div>
            <div><h3 className="font-black text-foreground">Boletim Escolar</h3><p className="text-xs text-muted-foreground">{user.role==="guardian" ? user.guardianOf : user.name} · {user.grade} {user.turma} · 2025</p></div>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-3 pr-4 font-black text-foreground">Matéria</th>{["1º Bim","2º Bim","3º Bim","4º Bim","Média"].map(h => <th key={h} className="text-center py-3 px-3 font-black text-foreground min-w-[70px]">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">
                {GRADES_DATA.map(g => {
                  const filled = [g.b1,g.b2,g.b3,g.b4].filter(v => v!==null) as number[];
                  const media = filled.length ? (filled.reduce((a,b)=>a+b,0)/filled.length).toFixed(1) : null;
                  return (
                    <tr key={g.subj} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 pr-4"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor:g.col }} /><span className="font-semibold">{g.subj}</span></div></td>
                      {[g.b1,g.b2,g.b3,g.b4].map((v,i) => <td key={i} className={`text-center py-3 px-3 ${gradeColor(v)}`}>{v!==null ? v.toFixed(1) : <span className="text-muted-foreground text-xs">—</span>}</td>)}
                      <td className={`text-center py-3 px-3 ${gradeColor(media ? parseFloat(media) : null)}`}>{media ?? <span className="text-muted-foreground text-xs">—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><span className="text-green-700 font-black">●</span> Excelente (≥9)</span>
            <span className="flex items-center gap-1"><span className="text-primary font-bold">●</span> Aprovado (≥7)</span>
            <span className="flex items-center gap-1"><span className="text-yellow-700 font-bold">●</span> Recuperação (5–6.9)</span>
            <span className="flex items-center gap-1"><span className="text-red-600 font-bold">●</span> Reprovado (&lt;5)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
