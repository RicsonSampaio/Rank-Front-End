import type { TarefaResponse } from "@types-api/Tarefa";
import type { TaskColumn } from "@types-client/pages/TasksList";
import { RecordTableCell } from "@components/RecordTable";

interface TasksTableCellProps {
  task: TarefaResponse;
  column: TaskColumn;
}

function formatValue(task: TarefaResponse, column: TaskColumn) {
  const value = task[column.id];
  if (value === null || value === undefined || value === "") return "—";
  if (column.type === "visibility") return value ? "Privada" : "Pública";
  if (column.type === "identifier") return "#" + String(value);
  if (column.type === "date" && typeof value === "string") {
    const date = value.slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.split("-").reverse().join("/") : value;
  }
  return String(value);
}

export function TasksTableCell({ task, column }: TasksTableCellProps) {
  const text = formatValue(task, column);
  return <RecordTableCell width={column.width} title={text} primary={column.id === "titulo"}>{text}</RecordTableCell>;
}
