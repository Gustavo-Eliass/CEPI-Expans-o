export function gradeColor(g: number|null) {
  if (g===null) return "text-muted-foreground";
  if (g>=9) return "text-green-700 font-black";
  if (g>=7) return "text-primary font-bold";
  if (g>=5) return "text-yellow-700 font-bold";
  return "text-red-600 font-bold";
}

export function average(grades: (number|null)[]) {
  const filled = grades.filter((g): g is number => g !== null);
  return filled.length ? filled.reduce((a, b) => a + b, 0) / filled.length : null;
}
