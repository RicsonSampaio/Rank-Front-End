import type { TaskColumn } from "@types-client/pages/TasksList";
import { RecordTableHeader } from "@components/RecordTable";

export function TasksTableHeader({ column }: { column: TaskColumn }) {
  return <RecordTableHeader column={column} />;
}
