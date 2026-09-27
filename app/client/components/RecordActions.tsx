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
      <button type="button" aria-label={"Editar " + name} title="Editar" disabled={disabled} onClick={onEdit} className="rounded p-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50">
        <PencilIcon className="h-5 w-5" />
      </button>
      <button type="button" aria-label={"Excluir " + name} title="Excluir" disabled={disabled} onClick={onDelete} className="rounded p-2 text-red-600 hover:bg-red-50 disabled:opacity-50">
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
}