import { Award, BookOpen, CalendarDays, ClipboardList, Flame } from "lucide-react";
import type { AppNotification, NotificationKind } from "@/app/types";

const ICON_BY_KIND: Record<NotificationKind, React.ElementType> = {
  post: BookOpen,
  activity: ClipboardList,
  agenda: CalendarDays,
  grade: Award,
  level: Flame,
};

export function NotificationItem({ notification, onClick }: {
  notification: AppNotification;
  onClick: () => void;
}) {
  const Icon = ICON_BY_KIND[notification.kind];
  const unreadBackground = notification.read ? "" : "bg-secondary/40";

  return (
    <button onClick={onClick} className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted transition-colors ${unreadBackground}`}>
      <div className="w-9 h-9 rounded-xl bg-secondary text-primary flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground">{notification.title}</p>
        <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{notification.time}</p>
      </div>

      {!notification.read && <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
    </button>
  );
}
