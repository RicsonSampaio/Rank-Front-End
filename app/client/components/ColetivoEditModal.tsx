import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { RecordModal } from "./RecordModal";
import type { action, loader } from "../../routes/api.coletivos.$id";

interface ColetivoEditModalProps {
  idColetivo: number;
  requestId: string;
  onClose: () => void;
  onUpdated: (message: string) => void;
}

const coletivoTypes = [
  { id: 1, label: "Guilda" },
  { id: 2, label: "Guilda especial" },
  { id: 3, label: "Grupo" },
  { id: 4, label: "Aliança" },
  { id: 5, label: "Coalizão" },
];

export function ColetivoEditModal({ idColetivo, requestId, onClose, onUpdated }: ColetivoEditModalProps) {
  const detail = useFetcher<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [fields, setFields] = useState<{ nome: string; logo: string; idTipoColetivo: number } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const initialized = useRef(false);
  const completed = useRef(false);
  const url = "/api/coletivos/" + idColetivo;
  const load = detail.load;
  const busy = fetcher.state !== "idle";
  const feedback = fetcher.data?.requestId === requestId ? fetcher.data : undefined;

  useEffect(() => { void load(url); }, [load, url]);

  useEffect(() => {
    if (detail.data?.coletivo && !initialized.current) {
      initialized.current = true;
      const coletivo = detail.data.coletivo;
      setFields({ nome: coletivo.nome, logo: coletivo.logo ?? "", idTipoColetivo: coletivo.idTipoColetivo });
    }
  }, [detail.data]);

  useEffect(() => {
    if (fetcher.state === "idle" && feedback?.success && !completed.current) {
      completed.current = true;
      onUpdated(feedback.message);
    }
  }, [fetcher.state, feedback, onUpdated]);

  const remove = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    void fetcher.submit({ intent: "delete", requestId }, { method: "post", action: url });
  };

  return (
    <RecordModal title="Editar coletivo" busy={busy} onClose={onClose}>
      {!fields ? (
        detail.state === "idle" && detail.data?.error ? (
          <div role="alert" className="space-y-4">
            <p className="text-red-700">{detail.data.error}</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="rounded border px-4 py-2">Cancelar</button>
              <button type="button" onClick={() => void detail.load(url)} className="rounded bg-blue-700 px-4 py-2 text-white">Tentar novamente</button>
            </div>
          </div>
        ) : <p role="status" className="text-gray-600">Carregando dados do coletivo...</p>
      ) : (
        <fetcher.Form method="post" action={url} className="flex flex-col gap-4">
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="requestId" value={requestId} />
          <label className="flex flex-col gap-1">
            Nome
            <input autoFocus className="rounded border p-2" type="text" name="nome" value={fields.nome} onChange={(event) => setFields({ ...fields, nome: event.target.value })} maxLength={150} required disabled={busy} />
          </label>
          <label className="flex flex-col gap-1">
            Tipo do coletivo
            <select className="rounded border bg-white p-2" name="idTipoColetivo" value={fields.idTipoColetivo} onChange={(event) => setFields({ ...fields, idTipoColetivo: Number(event.target.value) })} required disabled={busy}>
              {coletivoTypes.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            URL da logo (opcional)
            <input className="rounded border p-2" type="text" inputMode="url" name="logo" value={fields.logo} onChange={(event) => setFields({ ...fields, logo: event.target.value })} placeholder="https://exemplo.com/logo.png" maxLength={2048} disabled={busy} />
          </label>
          {feedback && !feedback.success && <p role="alert" className="text-red-700">{feedback.message}</p>}
          {confirmDelete && (
            <div role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Deseja deletar este coletivo? Essa ação não pode ser desfeita. Clique em “Confirmar exclusão” para continuar.
              <button type="button" disabled={busy} onClick={() => setConfirmDelete(false)} className="mt-2 block underline disabled:opacity-50">Voltar à edição</button>
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <button type="button" disabled={busy} onClick={remove} className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50">
              {busy && confirmDelete ? "Deletando..." : confirmDelete ? "Confirmar exclusão" : "Deletar"}
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} disabled={busy} className="rounded border px-3 py-2 text-sm disabled:opacity-50">Cancelar</button>
              <button type="submit" disabled={busy || confirmDelete} className="rounded bg-blue-700 px-3 py-2 text-sm text-white disabled:opacity-50">
                {busy && !confirmDelete ? "Atualizando..." : "Atualizar"}
              </button>
            </div>
          </div>
        </fetcher.Form>
      )}
    </RecordModal>
  );
}
