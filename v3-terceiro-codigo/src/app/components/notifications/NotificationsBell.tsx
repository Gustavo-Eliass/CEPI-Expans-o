import { Bell } from "lucide-react";
import { NotificationsPanel } from "@/app/components/notifications/NotificationsPanel";
import { useDropdown } from "@/app/hooks/useDropdown";
import type { AppNotification, Tab } from "@/app/types";

export function NotificationsBell({ notifications, onChange, onNavigate }: {
  notifications: AppNotification[];
  onChange: (notifications: AppNotification[]) => void;
  onNavigate?: (tab: Tab) => void;
}) {
  const panel = useDropdown<HTMLDivElement>();
  const unreadCount = notifications.filter(n => !n.read).length;
  const badgeText = unreadCount > 9 ? "9+" : String(unreadCount);

  function markAllAsRead() {
    onChange(notifications.map(n => ({ ...n, read: true })));
  }

  function openNotification(selected: AppNotification) {
    onChange(notifications.map(n => n.id === selected.id ? { ...n, read: true } : n));
    if (selected.goesTo && onNavigate) onNavigate(selected.goesTo);
    panel.close();
  }

  return (
    <div ref={panel.containerRef} className="relative">
      <button
        onClick={panel.toggle}
        aria-label={unreadCount > 0 ? `Notificações (${unreadCount} novas)` : "Notificações"}
        aria-expanded={panel.isOpen}
        className="relative w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-secondary transition-colors"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-white text-[10px] font-black flex items-center justify-center border-2 border-card">
            {badgeText}
          </span>
        )}
      </button>

      {panel.isOpen && (
        <NotificationsPanel
          notifications={notifications}
          hasUnread={unreadCount > 0}
          onSelect={openNotification}
          onMarkAllAsRead={markAllAsRead}
          onClose={panel.close}
        />
      )}
    </div>
  );
}
