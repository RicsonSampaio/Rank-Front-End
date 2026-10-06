import { memo } from "react";
import type { RelevanciaOption, TarefaResponse } from "@types-api/Tarefa";
import type { TaskColumn } from "@types-client/pages/TasksList";
import { RecordTableRow, RecordTableActions } from "@components/RecordTable";
import { TasksTableCell } from "./TasksTableCell";

interface TasksTableRowProps {
  task: TarefaResponse;
  relevancias: RelevanciaOption[];
  visibleColumns: TaskColumn[];
  onEdit: (task: TarefaResponse) => void;
  onDelete: (task: TarefaResponse) => void;
}

function Row({ task, relevancias, visibleColumns, onEdit, onDelete }: TasksTableRowProps) {
  return (
    <RecordTableRow>
      {visibleColumns.map((column) => <TasksTableCell key={column.id} task={task} relevancias={relevancias} column={column} />)}
      <RecordTableActions label={"da tarefa " + task.titulo} onEdit={() => onEdit(task)} onDelete={() => onDelete(task)} />
    </RecordTableRow>
  );
}

export const TasksTableRow = memo(Row);
