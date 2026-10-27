import { AGENDA_DATA } from "@/app/data/school";
import type { AppUser } from "@/app/types";

export function AgendaTab({ user }: { user:AppUser }) {
  const subjectColors: Record<string,string> = {
    Matemática:"#0a6b38", Português:"#003087", Ciências:"#3a9d5c", História:"#c0392b",
    Geografia:"#1a5276", Artes:"#7d5a00", "Ed. Física":"#0891b2", Inglês:"#65a30d", Intervalo:"#9ca3af",
  };
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1000px] mx-auto py-6 px-4 space-y-6">
        <div><h2 className="text-2xl font-black text-foreground">Agenda Semanal</h2><p className="text-sm text-muted-foreground mt-1">Semana de 15 a 19 de Setembro · {user.role==="guardian" ? `${user.guardianOf} (${user.grade} ${user.turma})` : `${user.grade} ${user.turma}`}</p></div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead><tr className="border-b border-border bg-muted/30"><th className="text-left py-3 px-4 font-black text-muted-foreground w-28">Horário</th>{AGENDA_DATA.days.map(d => <th key={d} className="text-center py-3 px-2 font-black text-foreground">{d}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">
                {AGENDA_DATA.schedule.map((row, ri) => (
                  <tr key={ri} className={row.classes[0]==="Intervalo" ? "bg-muted/20" : ""}>
                    <td className="py-3 px-4 text-xs font-semibold text-muted-foreground whitespace-nowrap">{row.time}</td>
                    {row.classes.map((cls, ci) => <td key={ci} className="py-2 px-2 text-center">{cls==="Intervalo" ? <span className="text-xs text-muted-foreground font-medium">Intervalo</span> : <span className="inline-block px-2 py-1.5 rounded-xl text-white text-xs font-bold leading-tight" style={{ backgroundColor:subjectColors[cls]||"#6b7280" }}>{cls}</span>}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="font-black text-foreground text-lg mb-3">Próximas datas importantes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {AGENDA_DATA.events.map(ev => (
              <div key={ev.name} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white flex-shrink-0" style={{ backgroundColor:ev.col }}><span className="text-lg font-black leading-none">{ev.date.split("/")[0]}</span><span className="text-xs opacity-80">/{ev.date.split("/")[1]}</span></div>
                <div className="flex-1 min-w-0"><p className="font-bold text-foreground text-sm leading-tight">{ev.name}</p><span className="text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor:ev.col+"22", color:ev.col }}>{ev.type}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
