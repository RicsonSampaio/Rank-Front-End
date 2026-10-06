import type { RelevanciaOption, TarefaResponse } from "@types-api/Tarefa";
import { RecordTable } from "@components/RecordTable";
import { BASE_COLUMNS } from "../config";
import { TasksTableRow } from "./TasksTableRow";

interface TasksTableProps {
  tarefas: TarefaResponse[];
  relevancias: RelevanciaOption[];
  onEdit: (task: TarefaResponse) => void;
  onDelete: (task: TarefaResponse) => void;
}

export function TasksTable({ tarefas, relevancias, onEdit, onDelete }: TasksTableProps) {
  return (
    <RecordTable label="Tarefas" columns={BASE_COLUMNS} rowCount={tarefas.length}>
      {tarefas.map((task) => <TasksTableRow key={task.id} task={task} relevancias={relevancias} visibleColumns={BASE_COLUMNS} onEdit={onEdit} onDelete={onDelete} />)}
    </RecordTable>
  );
}
