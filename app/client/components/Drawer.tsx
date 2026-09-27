import { useEffect, useId, useRef, type PropsWithChildren } from "react";

interface DrawerProps extends PropsWithChildren {
  title: string;
  busy: boolean;
  onClose: () => void;
}

export function Drawer({ title, busy, onClose, children }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="task-drawer fixed inset-y-0 left-auto right-0 m-0 h-[100dvh] max-h-none w-full max-w-[540px] flex-col bg-white p-0 shadow-xl backdrop:bg-black/40"
      onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}
    >
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 px-6 py-4">
        <h2 id={titleId} className="text-xl font-semibold">{title}</h2>
        <button type="button" disabled={busy} onClick={onClose} aria-label="Fechar formulário" className="rounded px-2 py-1 text-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50">×</button>
      </header>
      {children}
    </dialog>
  );
}
