import { memo } from "react";
import type { TarefaResponse } from "@types-api/Tarefa";
import type { TaskColumn } from "@types-client/pages/TasksList";
import { RecordTableRow, RecordTableActions } from "@components/RecordTable";
import { TasksTableCell } from "./TasksTableCell";

interface TasksTableRowProps {
  task: TarefaResponse;
  visibleColumns: TaskColumn[];
  onEdit: (task: TarefaResponse) => void;
  onDelete: (task: TarefaResponse) => void;
}

function Row({ task, visibleColumns, onEdit, onDelete }: TasksTableRowProps) {
  return (
    <RecordTableRow>
      {visibleColumns.map((column) => <TasksTableCell key={column.id} task={task} column={column} />)}
      <RecordTableActions label={"da tarefa " + task.titulo} onEdit={() => onEdit(task)} onDelete={() => onDelete(task)} />
    </RecordTableRow>
  );
}

export const TasksTableRow = memo(Row);
