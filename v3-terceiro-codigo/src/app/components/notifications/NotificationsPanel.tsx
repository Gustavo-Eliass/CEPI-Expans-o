import { CheckCheck, X } from "lucide-react";
import { NotificationItem } from "@/app/components/notifications/NotificationItem";
import type { AppNotification } from "@/app/types";

const FULL_SCREEN_ON_MOBILE = "fixed inset-0 z-50";
const DROPDOWN_ON_DESKTOP = "md:absolute md:inset-auto md:right-0 md:top-12 md:w-96 md:max-h-[480px] md:rounded-2xl md:border md:border-border md:shadow-2xl";

export function NotificationsPanel({ notifications, hasUnread, onSelect, onMarkAllAsRead, onClose }: {
  notifications: AppNotification[];
  hasUnread: boolean;
  onSelect: (notification: AppNotification) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}) {
  return (
    <div className={`${FULL_SCREEN_ON_MOBILE} ${DROPDOWN_ON_DESKTOP} bg-card flex flex-col overflow-hidden`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="font-black text-foreground">Notificações</p>

        <div className="flex items-center gap-1">
          {hasUnread && (
            <button onClick={onMarkAllAsRead} className="flex items-center gap-1 text-xs font-bold text-primary px-2 py-1 rounded-lg hover:bg-secondary">
              <CheckCheck className="w-4 h-4" /> Marcar como lidas
            </button>
          )}
          <button onClick={onClose} aria-label="Fechar" className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {notifications.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">Nenhuma notificação</p>
        )}
        {notifications.map(notification => (
          <NotificationItem key={notification.id} notification={notification} onClick={() => onSelect(notification)} />
        ))}
      </div>
    </div>
  );
}
