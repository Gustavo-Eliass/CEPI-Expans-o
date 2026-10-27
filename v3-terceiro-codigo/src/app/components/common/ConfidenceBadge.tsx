export function ConfidenceBadge({ c }: { c:"baixa confiança"|"ambíguo"|"risco alto" }) {
  const cfg = { "baixa confiança":"bg-yellow-100 text-yellow-800 border-yellow-300", "ambíguo":"bg-orange-100 text-orange-800 border-orange-300", "risco alto":"bg-red-100 text-red-800 border-red-300" }[c];
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg}`}>{c}</span>;
}
