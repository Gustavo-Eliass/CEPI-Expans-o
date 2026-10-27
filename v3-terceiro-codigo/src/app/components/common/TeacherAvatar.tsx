import { unsplash } from "@/app/data/feed";
import type { Teacher } from "@/app/types";

export function TeacherAvatar({ t, size="md" }: { t: Teacher; size?: "sm"|"md"|"lg" }) {
  const sz = { sm:"w-8 h-8", md:"w-10 h-10", lg:"w-14 h-14" }[size];
  return (
    <div className={`${sz} rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm`}>
      <img src={unsplash(t.photo, 120, 120)} alt={t.name} className="w-full h-full object-cover" />
    </div>
  );
}
