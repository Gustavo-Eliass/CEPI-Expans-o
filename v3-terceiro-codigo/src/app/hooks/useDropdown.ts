import { useEffect, useRef, useState } from "react";

export function useDropdown<T extends HTMLElement>() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<T>(null);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(current => !current);

  useEffect(() => {
    if (!isOpen) return;

    function closeWhenClickingOutside(event: MouseEvent) {
      const container = containerRef.current;
      const clickedOutside = container && !container.contains(event.target as Node);
      if (clickedOutside) setIsOpen(false);
    }

    function closeWhenPressingEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", closeWhenClickingOutside);
    document.addEventListener("keydown", closeWhenPressingEscape);
    return () => {
      document.removeEventListener("mousedown", closeWhenClickingOutside);
      document.removeEventListener("keydown", closeWhenPressingEscape);
    };
  }, [isOpen]);

  return { isOpen, close, toggle, containerRef };
}
