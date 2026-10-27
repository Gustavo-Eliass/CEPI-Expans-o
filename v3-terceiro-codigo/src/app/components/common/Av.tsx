export function Av({ ini, col, size="md" }: { ini:string; col:string; size?:"sm"|"md"|"lg" }) {
  const sz = { sm:"w-8 h-8 text-xs", md:"w-10 h-10 text-sm", lg:"w-12 h-12 text-base" }[size];
  return <div className={`${sz} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`} style={{ backgroundColor:col }}>{ini}</div>;
}
