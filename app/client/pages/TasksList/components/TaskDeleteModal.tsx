import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { RecordModal } from "@components/RecordModal";
import type { TarefaResponse } from "@types-api/Tarefa";
import type { action } from "../../../../routes/$idColetivo.Tasks.List";

interface TaskDeleteModalProps {
  task: TarefaResponse;
  idColetivo: number;
  requestId: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function TaskDeleteModal({ task, idColetivo, requestId, onClose, onSuccess }: TaskDeleteModalProps) {
  const fetcher = useFetcher<typeof action>();
  const completed = useRef(false);
  const busy = fetcher.state !== "idle";
  const response = fetcher.data?.requestId === requestId ? fetcher.data : undefined;
  useEffect(() => {
    if (fetcher.state === "idle" && response?.success && !completed.current) {
      completed.current = true;
      onSuccess(response.message);
    }
  }, [fetcher.state, response, onSuccess]);
  return (
    <RecordModal title="Excluir tarefa" busy={busy} onClose={onClose}>
      <fetcher.Form method="post" action={"/" + idColetivo + "/Tasks/List"}>
        <input type="hidden" name="intent" value="delete" />
        <input type="hidden" name="id" value={task.id} />
        <input type="hidden" name="requestId" value={requestId} />
        <p className="mb-5 text-gray-700">Deseja excluir a tarefa “{task.titulo}”? Essa ação não pode ser desfeita.</p>
        {response && !response.success && <p role="alert" className="mb-5 rounded bg-red-50 p-3 text-sm text-red-700">{response.message}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" disabled={busy} onClick={onClose} className="rank-btn rank-btn-cancel">Cancelar</button>
          <button type="submit" disabled={busy} className="rank-btn rank-btn-danger">{busy ? "Excluindo..." : "Excluir"}</button>
        </div>
      </fetcher.Form>
    </RecordModal>
  );
}
