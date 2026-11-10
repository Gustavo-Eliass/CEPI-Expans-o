import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

const AUTO_CLOSE_MS = 5000;

export function useSidebarDrawer() {
  const [open, setOpen] = useState(false);
  const timer = useRef<number>();

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen(o => !o), []);
  const resetTimer = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), AUTO_CLOSE_MS);
  }, []);

  useEffect(() => {
    if (!open) return;
    resetTimer();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { window.clearTimeout(timer.current); window.removeEventListener("keydown", onKey); };
  }, [open, resetTimer]);

  return { open, toggle, close, resetTimer };
}

type DrawerState = ReturnType<typeof useSidebarDrawer>;

export function SidebarToggle({ open, toggle }: Pick<DrawerState, "open" | "toggle">) {
  return (
    <button
      onClick={toggle}
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      aria-expanded={open}
      aria-controls="sidebar-drawer"
      className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-secondary transition-colors flex-shrink-0"
    >
      <Menu className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}

export function SidebarDrawer({ open, close, resetTimer, children }: Omit<DrawerState, "toggle"> & { children: ReactNode }) {
  return (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-[45] bg-black/40 transition-opacity duration-300 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        id="sidebar-drawer"
        onPointerEnter={resetTimer}
        onPointerMove={resetTimer}
        onPointerDown={resetTimer}
        onTouchStart={resetTimer}
        onKeyDown={resetTimer}
        onFocus={resetTimer}
        onWheel={resetTimer}
        onScrollCapture={resetTimer}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card w-56 xl:w-64 max-w-[85vw] transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none ${open ? "translate-x-0 visible shadow-2xl" : "-translate-x-full invisible"}`}
      >
        <button
          onClick={close}
          aria-label="Fechar menu"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
        {children}
      </aside>
    </>
  );
}
