import { useEffect } from "react";
import { useFetcher } from "react-router";
import { RecordModal } from "@components/RecordModal";
import type { action } from "../../../../routes/home";

interface ColetivoCreateModalProps {
  requestId: string;
  onClose: () => void;
  onCreated: (message: string) => void;
}

const coletivoTypes = [
  { id: 1, label: "Guilda" },
  { id: 2, label: "Guilda especial" },
  { id: 3, label: "Grupo" },
  { id: 4, label: "Aliança" },
  { id: 5, label: "Coalizão" },
];

export function ColetivoCreateModal({ requestId, onClose, onCreated }: ColetivoCreateModalProps) {
  const fetcher = useFetcher<typeof action>();
  const busy = fetcher.state !== "idle";
  const feedback = fetcher.data?.requestId === requestId ? fetcher.data : undefined;

  useEffect(() => {
    if (fetcher.state === "idle" && feedback?.success) {
      onCreated(feedback.message);
    }
  }, [fetcher.state, feedback, onCreated]);

  return (
    <RecordModal title="Criar coletivo" busy={busy} onClose={onClose}>
      <fetcher.Form method="post" action="/home" className="flex flex-col gap-4">
        <input type="hidden" name="requestId" value={requestId} />
        <label className="flex flex-col gap-1">
          Nome
          <input autoFocus className="rounded border p-2" type="text" name="nome" maxLength={150} required disabled={busy} />
        </label>
        <label className="flex flex-col gap-1">
          Tipo do coletivo
          <select className="rounded border bg-white p-2" name="idTipoColetivo" defaultValue="1" required disabled={busy}>
            {coletivoTypes.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          URL da logo (opcional)
          <input className="rounded border p-2" type="url" name="logo" placeholder="https://exemplo.com/logo.png" maxLength={2048} disabled={busy} />
        </label>
        {feedback && !feedback.success && <p role="alert" className="text-red-700">{feedback.message}</p>}
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={busy} className="rounded border px-4 py-2 disabled:opacity-50">Cancelar</button>
          <button type="submit" disabled={busy} className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50">
            {busy ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </fetcher.Form>
    </RecordModal>
  );
}