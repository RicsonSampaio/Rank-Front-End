import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useFetcher } from "react-router";

export interface LazySelectData {
  options: { value: number; label: string }[];
  error: string | null;
}

interface LazySelectProps {
  labelId: string;
  // Rota de recurso que devolve { options, error }; só é chamada quando o usuário abre a lista
  url: string;
  value: number | null;
  // Texto do valor atual enquanto as opções ainda não foram carregadas
  currentLabel: string | null;
  placeholder: string;
  // Quando informado, a lista ganha uma opção para limpar o valor (ex.: "Nenhum")
  noneLabel?: string;
  inputClass: string;
  onChange: (value: number | null) => void;
  // Quando informado, o erro de carregamento é repassado (ex.: para um modal) em vez de aparecer na lista
  onError?: (message: string) => void;
}

const PANEL_MAX_HEIGHT = 240;
const optionClass = "block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none";

// Dropdown próprio: a lista fica em position fixed acima de tudo e não é cortada pela rolagem do drawer
export function LazySelect({ labelId, url, value, currentLabel, placeholder, noneLabel, inputClass, onChange, onError }: LazySelectProps) {
  const fetcher = useFetcher<LazySelectData>();
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const errorReported = useRef(true);
  const listId = useId();

  const options = fetcher.data?.options ?? [];
  const error = fetcher.state === "idle" ? fetcher.data?.error ?? null : null;
  const selected = options.find((option) => option.value === value);
  const label = value === null ? noneLabel ?? placeholder : selected?.label ?? currentLabel ?? "#" + value;
  const foraDaLista = value !== null && !selected;

  const close = (focusButton = false) => {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  };

  const toggle = () => {
    if (open) return close();
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const abreParaCima = window.innerHeight - rect.bottom < PANEL_MAX_HEIGHT && rect.top > window.innerHeight - rect.bottom;
      setPanelStyle(abreParaCima
        ? { left: rect.left, width: rect.width, bottom: window.innerHeight - rect.top + 4 }
        : { left: rect.left, width: rect.width, top: rect.bottom + 4 });
    }
    // Busca as opções no primeiro clique (de novo, se a última busca falhou)
    if (fetcher.state === "idle" && (!fetcher.data || fetcher.data.error)) {
      errorReported.current = false;
      void fetcher.load(url);
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!error || errorReported.current || !onError) return;
    errorReported.current = true;
    close();
    onError(error);
  }, [error, onError]);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) close();
    };
    // A posição é calculada na abertura; rolar ou redimensionar fecha a lista
    const onScroll = (event: Event) => { if (!panelRef.current?.contains(event.target as Node)) close(); };
    const onResize = () => close();
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const select = (next: number | null) => {
    onChange(next);
    close(true);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      // Fecha só a lista, sem fechar o drawer
      event.preventDefault();
      event.stopPropagation();
      close(true);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) return toggle();
      const items = [...(panelRef.current?.querySelectorAll<HTMLButtonElement>("[role=option]") ?? [])];
      const index = items.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.key === "ArrowDown" ? Math.min(index + 1, items.length - 1) : Math.max(index - 1, 0);
      items[next]?.focus();
    }
  };

  const option = (optionValue: number | null, text: string) => (
    <button
      type="button" role="option" aria-selected={value === optionValue} key={optionValue ?? "nenhum"}
      className={optionClass + (value === optionValue ? " font-semibold" : "")}
      onClick={() => select(optionValue)}
    >
      {text}
    </button>
  );

  return (
    <div onKeyDown={onKeyDown}>
      <button
        ref={buttonRef} type="button" aria-labelledby={labelId} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId}
        className={inputClass + " flex items-center justify-between bg-white text-left font-normal"}
        onClick={toggle}
      >
        <span className={"truncate" + (value === null && !noneLabel ? " text-gray-400" : "")}>{label}</span>
        <span aria-hidden="true" className="ml-2 text-gray-500">▾</span>
      </button>
      {open && (
        <div
          ref={panelRef} id={listId} role="listbox" aria-labelledby={labelId} style={{ ...panelStyle, maxHeight: PANEL_MAX_HEIGHT }}
          className="fixed z-[1000] overflow-y-auto rounded border border-gray-300 bg-white py-1 font-normal shadow-lg"
        >
          {noneLabel && option(null, noneLabel)}
          {foraDaLista && option(value, currentLabel ?? "#" + value)}
          {options.map((item) => option(item.value, item.label))}
          {fetcher.state !== "idle" && <p role="status" className="px-3 py-2 text-sm text-gray-500">Carregando...</p>}
          {error && !onError && (
            <p role="alert" className="px-3 py-2 text-sm text-red-700">{error} Feche e abra a lista para tentar novamente.</p>
          )}
          {fetcher.state === "idle" && fetcher.data && !error && options.length === 0 && (
            <p className="px-3 py-2 text-sm text-gray-500">Nenhuma opção disponível.</p>
          )}
        </div>
      )}
    </div>
  );
}
