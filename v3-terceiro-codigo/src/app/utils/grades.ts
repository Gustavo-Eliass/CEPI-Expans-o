export function gradeColor(g: number|null) {
  if (g===null) return "text-muted-foreground";
  if (g>=9) return "text-green-700 font-black";
  if (g>=7) return "text-primary font-bold";
  if (g>=5) return "text-yellow-700 font-bold";
  return "text-red-600 font-bold";
}
