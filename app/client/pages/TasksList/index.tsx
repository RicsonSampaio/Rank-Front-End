import { useCallback, useState } from "react";
import { Link } from "react-router";
import { AppLayout } from "@layouts/AppLayout";
import type { RelevanciaOption, TarefaResponse } from "@types-api/Tarefa";
import { TasksTable } from "./components/TasksTable";
import { TaskFormDrawer } from "./components/TaskFormDrawer";
import { TaskDeleteModal } from "./components/TaskDeleteModal";
import { TaskCategoriesModal } from "./components/TaskCategoriesModal";
import { ActionMenu } from "@components/ActionMenu";

interface TasksListPageProps {
  tarefas: TarefaResponse[];
  relevancias: RelevanciaOption[];
  idColetivo: number;
  error: string | null;
  admin: boolean;
}

type TaskOperation =
  | { mode: "create"; requestId: string }
  | { mode: "update" | "delete"; task: TarefaResponse; requestId: string };

export function TasksListPage({ tarefas, relevancias, idColetivo, error, admin }: TasksListPageProps) {
  const [operation, setOperation] = useState<TaskOperation | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const close = useCallback(() => setOperation(null), []);
  const success = useCallback((text: string) => {
    setOperation(null);
    setMessage(text);
  }, []);
  const edit = useCallback((task: TarefaResponse) => {
    setMessage(null);
    setOperation({ mode: "update", task, requestId: crypto.randomUUID() });
  }, []);
  const remove = useCallback((task: TarefaResponse) => {
    setMessage(null);
    setOperation({ mode: "delete", task, requestId: crypto.randomUUID() });
  }, []);

  return (
    <AppLayout admin={admin} idColetivo={idColetivo}>
      <nav aria-label="Caminho da página" className="mb-4 text-sm text-gray-500">
        <Link to="/home" className="underline hover:text-gray-900">Coletivos</Link>
        <span> / Coletivo #{idColetivo} / Tarefas</span>
      </nav>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Tarefas</h1>
          {!error && <p className="text-sm text-gray-500">{tarefas.length} {tarefas.length === 1 ? "tarefa" : "tarefas"}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rank-btn rank-btn-primary"
            onClick={() => {
              setMessage(null);
              setOperation({ mode: "create", requestId: crypto.randomUUID() });
            }}
          >
            <span aria-hidden="true" className="text-lg leading-none">+</span>
            Criar tarefa
          </button>
          {/* Opções da lista de tarefas; novas opções entram neste menu */}
          <ActionMenu
            label="da lista de tarefas" orientation="vertical" width={200} buttonClassName="rank-icon-action p-2"
            items={[{ label: "Gerenciar categorias", onSelect: () => { setMessage(null); setCategoriesOpen(true); } }]}
          />
        </div>
      </div>
      {message && <p role="status" className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}</p>}
      {error ? (
        <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>
      ) : tarefas.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-gray-600">
          Nenhuma tarefa disponível neste coletivo.
        </div>
      ) : (
        <TasksTable tarefas={tarefas} relevancias={relevancias} onEdit={edit} onDelete={remove} />
      )}
      {operation && operation.mode !== "delete" && (
        <TaskFormDrawer
          key={operation.requestId}
          mode={operation.mode}
          taskId={operation.mode === "update" ? operation.task.id : undefined}
          idColetivo={idColetivo}
          relevancias={relevancias}
          requestId={operation.requestId}
          onClose={close}
          onSuccess={success}
        />
      )}
      {categoriesOpen && <TaskCategoriesModal idColetivo={idColetivo} onClose={() => setCategoriesOpen(false)} />}
      {operation?.mode === "delete" && (
        <TaskDeleteModal key={operation.requestId} task={operation.task} idColetivo={idColetivo} requestId={operation.requestId} onClose={close} onSuccess={success} />
      )}
    </AppLayout>
  );
}
