import { ActionMenu } from "./ActionMenu";

interface RecordMenuProps {
  label: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function RecordMenu({ label, onEdit, onDelete }: RecordMenuProps) {
  return (
    <ActionMenu
      label={label}
      items={[
        { label: "Editar", onSelect: onEdit, toneClassName: "text-amber-800 hover:bg-amber-50 focus:bg-amber-50" },
        { label: "Excluir", onSelect: onDelete, toneClassName: "text-red-700 hover:bg-red-50 focus:bg-red-50" },
      ]}
    />
  );
}
