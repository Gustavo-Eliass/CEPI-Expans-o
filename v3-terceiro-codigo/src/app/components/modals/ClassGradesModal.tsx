import { useState } from "react";
import { X, Users } from "lucide-react";
import { CLASS_GRADEBOOKS } from "@/app/data/school";
import { average, gradeColor } from "@/app/utils/grades";

const BIMESTERS = ["1º Bim", "2º Bim", "3º Bim", "4º Bim"];

export function ClassGradesModal({ subject, onClose }: { subject:string; onClose:()=>void }) {
  const [turma, setTurma] = useState(CLASS_GRADEBOOKS[0].turma);
  const gradebook = CLASS_GRADEBOOKS.find(c => c.turma === turma) ?? CLASS_GRADEBOOKS[0];
  const classAverage = average(gradebook.students.map(s => average([s.b1, s.b2, s.b3, s.b4])));
  const belowSeven = gradebook.students.filter(s => (average([s.b1, s.b2, s.b3, s.b4]) ?? 10) < 7).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
            <div><h3 className="font-black text-foreground">Notas das turmas</h3><p className="text-xs text-muted-foreground">{subject} · 2025</p></div>
          </div>
          <button onClick={onClose} aria-label="Fechar"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CLASS_GRADEBOOKS.map(c => (
              <button key={c.turma} onClick={() => setTurma(c.turma)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${turma===c.turma ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary"}`}>
                {c.turma}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/40 rounded-xl px-4 py-3"><p className="text-xs text-muted-foreground">Alunos</p><p className="text-xl font-black text-foreground">{gradebook.students.length}</p></div>
            <div className="bg-muted/40 rounded-xl px-4 py-3"><p className="text-xs text-muted-foreground">Média da turma</p><p className={`text-xl ${gradeColor(classAverage)}`}>{classAverage?.toFixed(1) ?? "—"}</p></div>
            <div className="bg-muted/40 rounded-xl px-4 py-3"><p className="text-xs text-muted-foreground">Abaixo de 7</p><p className="text-xl font-black text-foreground">{belowSeven}</p></div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-3 pr-4 font-black text-foreground">Aluno</th>{[...BIMESTERS, "Média"].map(h => <th key={h} className="text-center py-3 px-3 font-black text-foreground min-w-[70px]">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">
                {gradebook.students.map(student => {
                  const grades = [student.b1, student.b2, student.b3, student.b4];
                  const studentAverage = average(grades);
                  return (
                    <tr key={student.name} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 pr-4 font-semibold whitespace-nowrap">{student.name}</td>
                      {grades.map((g, i) => <td key={i} className={`text-center py-3 px-3 ${gradeColor(g)}`}>{g !== null ? g.toFixed(1) : <span className="text-muted-foreground text-xs">—</span>}</td>)}
                      <td className={`text-center py-3 px-3 ${gradeColor(studentAverage)}`}>{studentAverage?.toFixed(1) ?? <span className="text-muted-foreground text-xs">—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
