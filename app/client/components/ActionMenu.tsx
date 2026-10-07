import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface ActionMenuItem {
  label: string;
  onSelect: () => void;
  // Classes de cor do item (texto e fundo no hover/foco)
  toneClassName?: string;
}

interface ActionMenuProps {
  label: string;
  items: ActionMenuItem[];
  orientation?: "horizontal" | "vertical";
  // Largura do menu em px
  width?: number;
  buttonClassName?: string;
}

const defaultTone = "text-gray-800 hover:bg-gray-100 focus:bg-gray-100";

// Menu de três pontinhos: a lista abre em um portal com position fixed, acima do restante da página
export function ActionMenu({ label, items, orientation = "horizontal", width = 160, buttonClassName = "rank-icon-action p-1.5" }: ActionMenuProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const menuHeight = items.length * 40 + 12;

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
        className={buttonClassName}
        onClick={() => {
          if (position) { setPosition(null); return; }
          const rect = buttonRef.current?.getBoundingClientRect();
          if (!rect) return;
          setPosition({
            left: Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8)),
            top: rect.bottom + menuHeight < window.innerHeight ? rect.bottom + 4 : Math.max(8, rect.top - menuHeight),
          });
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {orientation === "vertical"
            ? <><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></>
            : <><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></>}
        </svg>
      </button>
      {position && createPortal(
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={"Ações " + label}
          style={{ ...position, width }}
          className="fixed z-50 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
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
              const buttons = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
              const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
              const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1
                : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
              buttons[next]?.focus();
            }
          }}
        >
          {items.map((item) => (
            <button
              key={item.label} type="button" role="menuitem"
              className={"w-full rounded px-3 py-2 text-left text-sm " + (item.toneClassName ?? defaultTone)}
              onClick={() => select(item.onSelect)}
            >
              {item.label}
            </button>
          ))}
        </div>, document.body,
      )}
    </>
  );
}
