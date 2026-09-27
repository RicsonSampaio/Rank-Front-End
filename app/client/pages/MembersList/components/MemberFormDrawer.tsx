import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { Drawer } from "@components/Drawer";
import type { action } from "../../../../routes/$idColetivo.Members.List";
import type { loader as detailLoader } from "../../../../routes/api.membros.$id";

interface MemberFormDrawerProps {
  mode: "create" | "update";
  memberId?: number;
  idColetivo: number;
  requestId: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function MemberFormDrawer({ mode, memberId, idColetivo, requestId, onClose, onSuccess }: MemberFormDrawerProps) {
  const fetcher = useFetcher<typeof action>();
  const detail = useFetcher<typeof detailLoader>();
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(mode === "create");
  const initialized = useRef(false);
  const completed = useRef(false);
  const busy = fetcher.state !== "idle";
  const response = fetcher.data?.requestId === requestId ? fetcher.data : undefined;
  const detailUrl = "/api/membros/" + memberId + "?idColetivo=" + idColetivo;
  const load = detail.load;

  useEffect(() => {
    if (mode === "update") void load(detailUrl);
  }, [mode, load, detailUrl]);

  useEffect(() => {
    if (detail.data?.membro && !initialized.current) {
      initialized.current = true;
      setEmail(detail.data.membro.email ?? "");
      setReady(true);
    }
  }, [detail.data]);

  useEffect(() => {
    if (fetcher.state === "idle" && response?.success && !completed.current) {
      completed.current = true;
      onSuccess(response.message);
    }
  }, [fetcher.state, response, onSuccess]);

  return (
    <Drawer title={mode === "create" ? "Adicionar membro" : "Editar membro"} busy={busy} onClose={onClose}>
      {!ready ? (
        <div className="flex-1 overflow-y-auto p-6">
          {detail.state === "idle" && detail.data?.error ? (
            <div role="alert" className="space-y-4 text-red-700">
              <p>{detail.data.error}</p>
              <button type="button" onClick={() => void detail.load(detailUrl)} className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Tentar novamente</button>
            </div>
          ) : <p role="status" className="text-gray-600">Carregando dados do membro...</p>}
        </div>
      ) : (
        <fetcher.Form method="post" action={"/" + idColetivo + "/Members/List"} className="flex min-h-0 flex-1 flex-col">
          <input type="hidden" name="intent" value={mode} />
          <input type="hidden" name="requestId" value={requestId} />
          {memberId !== undefined && <input type="hidden" name="id" value={memberId} />}
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <p className="text-sm text-gray-600">
              {mode === "create"
                ? "Informe o email de um usuário já cadastrado para adicioná-lo ao coletivo."
                : "Informe o email do usuário que ficará vinculado ao coletivo."}
            </p>
            {response && !response.success && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{response.message}</p>}
            <label className="block text-sm font-medium text-gray-700">
              Email
              <input autoFocus type="email" name="email" autoComplete="email" required maxLength={320} disabled={busy} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100" />
            </label>
          </div>
          <footer className="flex shrink-0 justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button type="button" disabled={busy} onClick={onClose} className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={busy} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {busy ? "Salvando..." : mode === "create" ? "Adicionar" : "Atualizar"}
            </button>
          </footer>
        </fetcher.Form>
      )}
    </Drawer>
  );
}
