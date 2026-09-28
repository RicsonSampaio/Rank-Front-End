import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface RecordMenuProps {
  label: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function RecordMenu({ label, onEdit, onDelete }: RecordMenuProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!position) return;
    menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const close = () => { setPosition(null); buttonRef.current?.focus({ preventScroll: true }); };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
        setPosition(null);
      }
    };
    const scroll = (event: Event) => {
      if (!(event.target instanceof Node) || !menuRef.current?.contains(event.target)) close();
    };
    window.addEventListener("pointerdown", outside);
    window.addEventListener("scroll", scroll, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("pointerdown", outside);
      window.removeEventListener("scroll", scroll, true);
      window.removeEventListener("resize", close);
    };
  }, [position]);

  const select = (callback: () => void) => {
    setPosition(null);
    buttonRef.current?.focus({ preventScroll: true });
    callback();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={"Ações " + label}
        aria-haspopup="menu"
        aria-expanded={position !== null}
        aria-controls={position ? menuId : undefined}
        className="rank-icon-action p-1.5"
        onClick={() => {
          if (position) { setPosition(null); return; }
          const rect = buttonRef.current?.getBoundingClientRect();
          if (!rect) return;
          setPosition({
            left: Math.max(8, Math.min(rect.right - 160, window.innerWidth - 168)),
            top: rect.bottom + 100 < window.innerHeight ? rect.bottom + 4 : Math.max(8, rect.top - 100),
          });
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
        </svg>
      </button>
      {position && createPortal(
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={"Ações " + label}
          style={position}
          className="fixed z-50 w-40 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setPosition(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" || event.key === "Tab") {
              setPosition(null);
              if (event.key === "Escape") { event.preventDefault(); buttonRef.current?.focus(); }
            }
            if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
              event.preventDefault();
              const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
              const index = items.indexOf(document.activeElement as HTMLButtonElement);
              const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1
                : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
              items[next]?.focus();
            }
          }}
        >
          <button type="button" role="menuitem" className="w-full rounded px-3 py-2 text-left text-sm text-amber-800 hover:bg-amber-50 focus:bg-amber-50" onClick={() => select(onEdit)}>Editar</button>
          <button type="button" role="menuitem" className="w-full rounded px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50 focus:bg-red-50" onClick={() => select(onDelete)}>Excluir</button>
        </div>, document.body,
      )}
    </>
  );
}
