export const FIRE_LEVELS = [
  { level:1, name:"Fogo Normal", color:"#f97316", bg:"#fff7ed", minExp:0,    nextExp:100 },
  { level:2, name:"Fogo Azul",   color:"#3b82f6", bg:"#eff6ff", minExp:100,  nextExp:250 },
  { level:3, name:"Fogo Roxo",   color:"#a855f7", bg:"#faf5ff", minExp:250,  nextExp:500 },
  { level:4, name:"Fogo Verde",  color:"#22c55e", bg:"#f0fdf4", minExp:500,  nextExp:900 },
  { level:5, name:"Fogo Rosa",   color:"#ec4899", bg:"#fdf2f8", minExp:900,  nextExp:1500 },
  { level:6, name:"Fogo Dourado",color:"#f59e0b", bg:"#fffbeb", minExp:1500, nextExp:Infinity },
];

export function getFireLevel(exp:number) {
  for (let i=FIRE_LEVELS.length-1; i>=0; i--) {
    if (exp >= FIRE_LEVELS[i].minExp) return FIRE_LEVELS[i];
  }
  return FIRE_LEVELS[0];
}

export function getExpPct(exp:number) {
  const lvl = getFireLevel(exp);
  if (lvl.nextExp === Infinity) return 100;
  return Math.min(100, Math.round(((exp - lvl.minExp) / (lvl.nextExp - lvl.minExp)) * 100));
}

export const CONFETTI_POS = [
  {top:"8%",left:"12%"},{top:"6%",left:"40%"},{top:"4%",left:"70%"},{top:"9%",left:"88%"},
  {top:"90%",left:"10%"},{top:"92%",left:"38%"},{top:"88%",left:"65%"},{top:"91%",left:"85%"},
  {top:"48%",left:"4%"},{top:"52%",left:"93%"},{top:"22%",left:"6%"},{top:"72%",left:"90%"},
];

export const CONFETTI_COLORS = ["#0a6b38","#f97316","#3b82f6","#a855f7","#22c55e","#f59e0b","#ec4899","#ef4444","#14b8a6","#8b5cf6","#f43f5e","#84cc16"];
