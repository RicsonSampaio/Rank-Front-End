import { useEffect, useRef, useState, type FormEvent } from "react";
import { useFetcher } from "react-router";
import { RecordModal } from "@components/RecordModal";
import type { action, loader } from "../../../../routes/api.coletivos.$id_.categorias";

interface TaskCategoriesModalProps {
  idColetivo: number;
  onClose: () => void;
}

const NOME_MAX_LENGTH = 100;
const inputClass = "w-full rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100";
const smallButton = "rank-btn px-3 py-1.5 text-sm";

export function TaskCategoriesModal({ idColetivo, onClose }: TaskCategoriesModalProps) {
  const list = useFetcher<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [novoNome, setNovoNome] = useState("");
  const [editing, setEditing] = useState<{ id: number; nome: string } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const lastRequest = useRef<string | null>(null);
  const url = "/api/coletivos/" + idColetivo + "/categorias";
  const load = list.load;
  const busy = fetcher.state !== "idle";
  const categorias = list.data?.categorias ?? [];

  useEffect(() => { void load(url); }, [load, url]);

  // Resultado da última criação, renomeação ou exclusão
  useEffect(() => {
    const result = fetcher.data;
    if (fetcher.state !== "idle" || !result || result.requestId !== lastRequest.current) return;
    lastRequest.current = null;
    setFeedback({ success: result.success, message: result.message });
    if (result.success) {
      setNovoNome("");
      setEditing(null);
      setConfirmDeleteId(null);
      void load(url);
    }
  }, [fetcher.state, fetcher.data, load, url]);

  const submit = (fields: Record<string, string>) => {
    const requestId = crypto.randomUUID();
    lastRequest.current = requestId;
    setFeedback(null);
    void fetcher.submit({ ...fields, requestId }, { method: "post", action: url });
  };

  const create = (event: FormEvent) => {
    event.preventDefault();
    if (novoNome.trim()) submit({ intent: "create", nome: novoNome.trim() });
  };

  const rename = (event: FormEvent) => {
    event.preventDefault();
    if (editing?.nome.trim()) submit({ intent: "update", id: String(editing.id), nome: editing.nome.trim() });
  };

  return (
    <RecordModal title="Gerenciar categorias" busy={busy} onClose={onClose}>
      <p className="mb-4 text-sm text-gray-600">As categorias são usadas nas tarefas deste coletivo.</p>

      <form onSubmit={create} className="mb-4 flex gap-2">
        <label className="sr-only" htmlFor="nova-categoria">Nova categoria</label>
        <input
          id="nova-categoria" type="text" required maxLength={NOME_MAX_LENGTH} placeholder="Nova categoria"
          disabled={busy} className={inputClass} value={novoNome} onChange={(event) => setNovoNome(event.target.value)}
        />
        <button type="submit" disabled={busy || !novoNome.trim()} className={smallButton + " rank-btn-primary shrink-0"}>Adicionar</button>
      </form>

      {feedback && (
        <p role={feedback.success ? "status" : "alert"} className={"mb-4 rounded p-3 text-sm " + (feedback.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700")}>
          {feedback.message}
        </p>
      )}

      {!list.data ? (
        <p role="status" className="text-sm text-gray-600">Carregando categorias...</p>
      ) : list.data?.error ? (
        <div role="alert" className="space-y-3 text-sm text-red-700">
          <p>{list.data.error}</p>
          <button type="button" className={smallButton + " rank-btn-primary"} onClick={() => void load(url)}>Tentar novamente</button>
        </div>
      ) : categorias.length === 0 ? (
        <p className="rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">Nenhuma categoria cadastrada neste coletivo.</p>
      ) : (
        <ul className="max-h-80 divide-y divide-gray-200 overflow-y-auto rounded border border-gray-200">
          {categorias.map((categoria) => (
            <li key={categoria.id} className="p-3">
              {editing?.id === categoria.id ? (
                <form onSubmit={rename} className="flex gap-2">
                  <label className="sr-only" htmlFor={"categoria-" + categoria.id}>Nome da categoria</label>
                  <input
                    id={"categoria-" + categoria.id} type="text" required autoFocus maxLength={NOME_MAX_LENGTH}
                    disabled={busy} className={inputClass} value={editing.nome}
                    onChange={(event) => setEditing({ id: categoria.id, nome: event.target.value })}
                    onKeyDown={(event) => {
                      // Esc cancela só a edição, sem fechar o modal
                      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setEditing(null); }
                    }}
                  />
                  <button type="submit" disabled={busy || !editing.nome.trim()} className={smallButton + " rank-btn-primary shrink-0"}>Salvar</button>
                  <button type="button" disabled={busy} onClick={() => setEditing(null)} className={smallButton + " rank-btn-cancel shrink-0"}>Cancelar</button>
                </form>
              ) : confirmDeleteId === categoria.id ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    Excluir “{categoria.nome}”? As tarefas com esta categoria ficarão sem categoria.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button type="button" disabled={busy} onClick={() => setConfirmDeleteId(null)} className={smallButton + " rank-btn-cancel"}>Cancelar</button>
                    <button type="button" disabled={busy} onClick={() => submit({ intent: "delete", id: String(categoria.id) })} className={smallButton + " rank-btn-danger"}>
                      {busy ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm text-gray-800" title={categoria.nome}>{categoria.nome}</span>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button" disabled={busy} className={smallButton + " rank-btn-cancel"}
                      onClick={() => { setFeedback(null); setConfirmDeleteId(null); setEditing({ id: categoria.id, nome: categoria.nome }); }}
                    >
                      Renomear
                    </button>
                    <button
                      type="button" disabled={busy} className={smallButton + " rank-btn-danger"}
                      onClick={() => { setFeedback(null); setEditing(null); setConfirmDeleteId(categoria.id); }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex justify-end">
        <button type="button" disabled={busy} onClick={onClose} className="rank-btn rank-btn-cancel">Fechar</button>
      </div>
    </RecordModal>
  );
}
