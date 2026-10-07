import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { Drawer } from "@components/Drawer";
import { RecordModal } from "@components/RecordModal";
import type { RelevanciaOption, TarefaPayload, TarefaResponse } from "@types-api/Tarefa";
import type { action } from "../../../../routes/$idColetivo.Tasks.List";
import type { loader as detailLoader } from "../../../../routes/api.tarefas.$id";
import { LazySelect } from "./LazySelect";

interface TaskFormDrawerProps {
  mode: "create" | "update";
  taskId?: number;
  idColetivo: number;
  relevancias: RelevanciaOption[];
  requestId: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const inputClass = "mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100";
const primaryClass = "rank-btn rank-btn-primary";

// No formulário status e relevância começam sem valor; o usuário precisa escolher antes de salvar
type TaskForm = Omit<TarefaPayload, "idStatus" | "idRelevancia"> & { idStatus: number | null; idRelevancia: number | null };
type OptionsField = "status" | "relevancia" | "categoria";

const OPTIONS_ERROR_TITLE: Record<OptionsField, string> = {
  status: "Não foi possível carregar os status",
  categoria: "Não foi possível carregar as categorias",
  relevancia: "Não foi possível carregar as relevâncias",
};

function emptyTask(idColetivo: number): TaskForm {
  return {
    idColetivo, idEspaco: 0, idEscopo: 0, idStatus: null, idCategoria: 0, idUsuarioCriacao: 0,
    titulo: "", privada: false, descricao: null, lastDoneDate: null, idTarefaPai: null,
    userListMarcados: null, userListParticipantes: "", idDocumento: 0, prazoInicial: null,
    prazoFinal: null, idResponsavel: null, idFase: 0, idRelevancia: null,
  };
}

function editableTask(task: TarefaResponse): TaskForm {
  const { id: _id, dataCriacao: _created, dataAtualizacao: _updated, nomeResponsavel: _nome, nomeStatus: _status, nomeCategoria: _categoria, ...payload } = task;
  // Status 0 (tarefa antiga, sem status cadastrado) obriga a escolher um status válido
  return { ...payload, idStatus: payload.idStatus || null };
}

type NumberField = "idEspaco" | "idEscopo" | "idTarefaPai" | "idDocumento" | "idFase";
type DateField = "prazoInicial" | "prazoFinal" | "lastDoneDate";

export function TaskFormDrawer({ mode, taskId, idColetivo, relevancias, requestId, onClose, onSuccess }: TaskFormDrawerProps) {
  const fetcher = useFetcher<typeof action>();
  const detail = useFetcher<typeof detailLoader>();
  const [payload, setPayload] = useState<TaskForm | null>(() => mode === "create" ? emptyTask(idColetivo) : null);
  const [nomeResponsavelAtual, setNomeResponsavelAtual] = useState<string | null>(null);
  const [nomeStatusAtual, setNomeStatusAtual] = useState<string | null>(null);
  const [nomeCategoriaAtual, setNomeCategoriaAtual] = useState<string | null>(null);
  const [optionsError, setOptionsError] = useState<{ field: OptionsField; message: string } | null>(null);
  const [faltando, setFaltando] = useState<Record<OptionsField, boolean>>({ status: false, relevancia: false });
  const showStatusError = useCallback((message: string) => setOptionsError({ field: "status", message }), []);
  const showCategoriaError = useCallback((message: string) => setOptionsError({ field: "categoria", message }), []);
  const showRelevanciaError = useCallback((message: string) => setOptionsError({ field: "relevancia", message }), []);
  const initialized = useRef(false);
  const completed = useRef(false);
  const busy = fetcher.state !== "idle";
  const response = fetcher.data?.requestId === requestId ? fetcher.data : undefined;
  const detailUrl = "/api/tarefas/" + taskId + "?idColetivo=" + idColetivo;
  const load = detail.load;

  useEffect(() => {
    if (mode === "update") void load(detailUrl);
  }, [mode, load, detailUrl]);

  useEffect(() => {
    if (detail.data?.tarefa && !initialized.current) {
      initialized.current = true;
      setPayload(editableTask(detail.data.tarefa));
      setNomeResponsavelAtual(detail.data.tarefa.nomeResponsavel ?? null);
      setNomeStatusAtual(detail.data.tarefa.nomeStatus ?? null);
      setNomeCategoriaAtual(detail.data.tarefa.nomeCategoria ?? null);
    }
  }, [detail.data]);

  // Nome da relevância atual (das opções já carregadas pela página) enquanto o dropdown não busca as suas
  const relevanciaAtual = payload?.idRelevancia == null ? null
    : relevancias.find((relevancia) => relevancia.valor === payload.idRelevancia)?.nome ?? "Relevância " + payload.idRelevancia;

  useEffect(() => {
    if (fetcher.state === "idle" && response?.success && !completed.current) {
      completed.current = true;
      onSuccess(response.message);
    }
  }, [fetcher.state, response, onSuccess]);

  const numberField = (key: NumberField, label: string, nullable = false) => (
    <label className="block text-sm font-medium text-gray-700" key={key}>
      {label}
      <input
        type="number" min="0" max="2147483647" step="1" required={!nullable}
        className={inputClass} value={payload?.[key] ?? ""}
        onChange={(event) => setPayload((current) => current && {
          ...current, [key]: event.target.value === "" && nullable ? null : Number(event.target.value),
        })}
      />
    </label>
  );
  const dateField = (key: DateField, label: string) => (
    <label className="block text-sm font-medium text-gray-700" key={key}>
      {label}
      <input
        type="datetime-local" step="any" className={inputClass}
        value={(payload?.[key] ?? "").replace(/Z$|[+-]\d{2}:\d{2}$/, "").replace(/(\.\d{3})\d+$/, "$1")}
        onChange={(event) => {
          const value = event.target.value;
          const date = value.length === 16 ? value + ":00" : value;
          setPayload((current) => current && { ...current, [key]: date || null });
        }}
      />
    </label>
  );

  return (
    <>
      <Drawer title={mode === "create" ? "Criar tarefa" : "Editar tarefa"} busy={busy} onClose={onClose}>
        {!payload ? (
          <div className="flex-1 overflow-y-auto p-6">
            {detail.state === "idle" && detail.data?.error ? (
              <div role="alert" className="space-y-4 text-red-700">
                <p>{detail.data.error}</p>
                <button type="button" className={primaryClass} onClick={() => void detail.load(detailUrl)}>Tentar novamente</button>
              </div>
            ) : <p role="status" className="text-gray-600">Carregando dados da tarefa...</p>}
          </div>
        ) : (
          <fetcher.Form
            method="post" action={"/" + idColetivo + "/Tasks/List"} className="flex min-h-0 flex-1 flex-col"
            onSubmit={(event) => {
              const missing = { status: payload.idStatus === null, relevancia: payload.idRelevancia === null };
              if (missing.status || missing.relevancia) {
                event.preventDefault();
                setFaltando(missing);
              }
            }}
          >
            <input type="hidden" name="intent" value={mode} />
            <input type="hidden" name="requestId" value={requestId} />
            {taskId !== undefined && <input type="hidden" name="id" value={taskId} />}
            <input type="hidden" name="payload" value={JSON.stringify(payload)} />
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <fieldset disabled={busy} className="space-y-5">
                {response && !response.success && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{response.message}</p>}
                <label className="block text-sm font-medium text-gray-700">
                  Título
                  <input autoFocus type="text" required className={inputClass} value={payload.titulo} onChange={(event) => setPayload({ ...payload, titulo: event.target.value })} />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                  <textarea rows={4} className={inputClass} value={payload.descricao ?? ""} onChange={(event) => setPayload({ ...payload, descricao: event.target.value || null })} />
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={payload.privada} onChange={(event) => setPayload({ ...payload, privada: event.target.checked })} />
                  Tarefa privada
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {dateField("prazoInicial", "Prazo inicial")}
                  {dateField("prazoFinal", "Prazo final")}
                  <div className="block text-sm font-medium text-gray-700">
                    <span id="task-status-label">Status</span>
                    <LazySelect
                      labelId="task-status-label" url="/api/tarefas/status" inputClass={inputClass}
                      value={payload.idStatus} currentLabel={nomeStatusAtual ?? "Status #" + payload.idStatus}
                      placeholder="Selecione o status"
                      onChange={(idStatus) => {
                        setFaltando((current) => ({ ...current, status: false }));
                        setPayload({ ...payload, idStatus });
                      }}
                      onError={showStatusError}
                    />
                    {faltando.status && <span role="alert" className="mt-1 block text-xs font-normal text-red-700">Escolha o status da tarefa.</span>}
                  </div>
                  <div className="block text-sm font-medium text-gray-700">
                    <span id="task-categoria-label">Categoria</span>
                    {/* Categoria é opcional: "Nenhuma" envia idCategoria 0 */}
                    <LazySelect
                      labelId="task-categoria-label" url={"/api/coletivos/" + idColetivo + "/categorias"} inputClass={inputClass}
                      value={payload.idCategoria || null} currentLabel={nomeCategoriaAtual ?? "Categoria #" + payload.idCategoria}
                      placeholder="Nenhuma" noneLabel="Nenhuma"
                      onChange={(idCategoria) => setPayload({ ...payload, idCategoria: idCategoria ?? 0 })}
                      onError={showCategoriaError}
                    />
                  </div>
                  <div className="block text-sm font-medium text-gray-700">
                    <span id="task-responsavel-label">Responsável</span>
                    <LazySelect
                      labelId="task-responsavel-label" url={"/api/coletivos/" + idColetivo + "/membros"} inputClass={inputClass}
                      value={payload.idResponsavel || null} currentLabel={nomeResponsavelAtual ?? "Usuário #" + payload.idResponsavel}
                      placeholder="Nenhum" noneLabel="Nenhum"
                      onChange={(idResponsavel) => setPayload({ ...payload, idResponsavel })}
                    />
                  </div>
                  <div className="block text-sm font-medium text-gray-700">
                    <span id="task-relevancia-label">Relevância</span>
                    <LazySelect
                      labelId="task-relevancia-label" url="/api/tarefas/relevancias" inputClass={inputClass}
                      value={payload.idRelevancia} currentLabel={relevanciaAtual} placeholder="Selecione a relevância"
                      onChange={(idRelevancia) => {
                        setFaltando((current) => ({ ...current, relevancia: false }));
                        setPayload({ ...payload, idRelevancia });
                      }}
                      onError={showRelevanciaError}
                    />
                    {faltando.relevancia &&<span role="alert" className="mt-1 block text-xs font-normal text-red-700">Escolha a relevância da tarefa.</span>}
                  </div>
                </div>
                <details className="rounded border border-gray-200 p-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">Outros dados da tarefa</summary>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {numberField("idEspaco", "ID do espaço")}
                    {numberField("idEscopo", "ID do escopo", true)}
                    {numberField("idTarefaPai", "ID da tarefa pai", true)}
                    {numberField("idDocumento", "ID do documento", true)}
                    {numberField("idFase", "ID da fase", true)}
                    {dateField("lastDoneDate", "Última conclusão")}
                  </div>
                  <label className="mt-4 block text-sm font-medium text-gray-700">
                    Lista de participantes
                    <input type="text" className={inputClass} value={payload.userListParticipantes} onChange={(event) => setPayload({ ...payload, userListParticipantes: event.target.value })} />
                  </label>
                  <label className="mt-4 block text-sm font-medium text-gray-700">
                    Lista de usuários marcados
                    <input type="text" className={inputClass} value={payload.userListMarcados ?? ""} onChange={(event) => setPayload({ ...payload, userListMarcados: event.target.value || null })} />
                  </label>
                </details>
              </fieldset>
            </div>
            <footer className="flex shrink-0 justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button type="button" disabled={busy} onClick={onClose} className="rank-btn rank-btn-cancel">Cancelar</button>
              <button type="submit" disabled={busy} className={primaryClass}>
                {busy ? "Salvando..." : mode === "create" ? "Criar" : "Atualizar"}
              </button>
            </footer>
          </fetcher.Form>
        )}
      </Drawer>
      {/* Fora do Drawer para o Esc do modal não fechar o drawer junto; abre por cima por ser aberto depois */}
      {optionsError && (
        <RecordModal title={OPTIONS_ERROR_TITLE[optionsError.field]} busy={false} onClose={() => setOptionsError(null)}>
          <p role="alert" className="mb-5 text-gray-700">{optionsError.message}</p>
          <div className="flex justify-end">
            <button type="button" autoFocus className={primaryClass} onClick={() => setOptionsError(null)}>Entendi</button>
          </div>
        </RecordModal>
      )}
    </>
  );
}
