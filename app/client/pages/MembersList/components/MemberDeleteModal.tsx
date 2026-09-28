import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { RecordModal } from "@components/RecordModal";
import type { MembroResponse } from "@types-api/Membro";
import type { action } from "../../../../routes/$idColetivo.Members.List";

interface MemberDeleteModalProps {
  membro: MembroResponse;
  idColetivo: number;
  requestId: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function MemberDeleteModal({ membro, idColetivo, requestId, onClose, onSuccess }: MemberDeleteModalProps) {
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
    <RecordModal title="Remover membro" busy={busy} onClose={onClose}>
      <fetcher.Form method="post" action={"/" + idColetivo + "/Members/List"}>
        <input type="hidden" name="intent" value="delete" />
        <input type="hidden" name="id" value={membro.id} />
        <input type="hidden" name="requestId" value={requestId} />
        <p className="mb-3 text-gray-700">Deseja remover “{membro.nome ?? membro.email ?? ("Membro #" + membro.id)}” deste coletivo?</p>
        <p className="mb-5 text-sm text-gray-600">Apenas o vínculo será excluído. A conta do usuário continuará cadastrada no sistema.</p>
        {response && !response.success && <p role="alert" className="mb-5 rounded bg-red-50 p-3 text-sm text-red-700">{response.message}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" disabled={busy} onClick={onClose} className="rank-btn rank-btn-cancel">Cancelar</button>
          <button type="submit" disabled={busy} className="rank-btn rank-btn-danger">{busy ? "Removendo..." : "Remover"}</button>
        </div>
      </fetcher.Form>
    </RecordModal>
  );
}
