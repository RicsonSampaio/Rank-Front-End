import type { RelevanciaOption, TarefaResponse } from "@types-api/Tarefa";
import type { TaskColumn } from "@types-client/pages/TasksList";
import { RecordTableCell } from "@components/RecordTable";

interface TasksTableCellProps {
  task: TarefaResponse;
  relevancias: RelevanciaOption[];
  column: TaskColumn;
}

function formatValue(task: TarefaResponse, relevancias: RelevanciaOption[], column: TaskColumn) {
  const value = task[column.id];
  // Sem nome (backend antigo ou usuário inexistente): mostra o ID do responsável
  if (column.id === "nomeResponsavel" && !value && task.idResponsavel) return "#" + String(task.idResponsavel);
  if (value === null || value === undefined || value === "") return "—";
  if (column.type === "visibility") return value ? "Privada" : "Pública";
  if (column.type === "identifier") return "#" + String(value);
  // Sem opção correspondente (ex.: endpoint de relevâncias indisponível), mostra o número
  if (column.type === "relevancia") return relevancias.find((relevancia) => relevancia.valor === value)?.nome ?? String(value);
  if (column.type === "date" && typeof value === "string") {
    const date = value.slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.split("-").reverse().join("/") : value;
  }
  return String(value);
}

export function TasksTableCell({ task, relevancias, column }: TasksTableCellProps) {
  const text = formatValue(task, relevancias, column);
  return <RecordTableCell width={column.width} title={text} primary={column.id === "titulo"}>{text}</RecordTableCell>;
}
