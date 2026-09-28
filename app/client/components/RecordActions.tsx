import { PencilIcon, TrashIcon } from "@components/NavigationIcons";

interface RecordActionsProps {
  name: string;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function RecordActions({ name, disabled, onEdit, onDelete }: RecordActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-label={"Editar " + name} title="Editar" disabled={disabled} onClick={onEdit} className="rank-icon-action p-2 disabled:opacity-50">
        <PencilIcon className="h-5 w-5" />
      </button>
      <button type="button" aria-label={"Excluir " + name} title="Excluir" disabled={disabled} onClick={onDelete} className="rank-icon-action rank-icon-action-danger p-2 disabled:opacity-50">
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
}