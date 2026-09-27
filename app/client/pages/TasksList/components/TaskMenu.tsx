import { RecordMenu } from "@components/RecordMenu";

export function TaskMenu({ title, onEdit, onDelete }: { title: string; onEdit: () => void; onDelete: () => void }) {
  return <RecordMenu label={"da tarefa " + title} onEdit={onEdit} onDelete={onDelete} />;
}
