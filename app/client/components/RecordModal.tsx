import { useEffect, useId, useRef, type PropsWithChildren } from "react";

interface RecordModalProps extends PropsWithChildren {
  title: string;
  busy: boolean;
  onClose: () => void;
}

export function RecordModal({ title, busy, onClose, children }: RecordModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="m-auto w-[calc(100%_-_2rem)] max-w-md rounded-lg p-0 shadow-xl backdrop:bg-black/40"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      <div className="p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id={titleId} className="text-xl font-semibold">{title}</h2>
          <button type="button" aria-label="Fechar modal" disabled={busy} onClick={onClose} className="rounded px-2 py-1 text-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50">×</button>
        </div>
        {children}
      </div>
    </dialog>
  );
}