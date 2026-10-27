export function Tag({ name, col }: { name:string; col:string }) {
  return <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor:col+"22", color:col }}>{name}</span>;
}
