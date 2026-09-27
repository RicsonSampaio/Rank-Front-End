import { useState } from "react";
import { MemberIcon } from "@components/NavigationIcons";
import { RecordTable, RecordTableRow, RecordTableCell, RecordTableActions, type RecordTableColumn } from "@components/RecordTable";
import type { MembroResponse } from "@types-api/Membro";

const COLUMNS: RecordTableColumn[] = [
  { id: "fotoAccount", label: "Foto", width: 64 },
  { id: "id", label: "ID do vínculo", width: 112 },
  { id: "nome", label: "Nome", width: 240 },
  { id: "email", label: "Email", width: 300 },
  { id: "idUsuario", label: "ID do usuário", width: 120 },
  { id: "idColetivo", label: "ID do coletivo", width: 120 },
];

function MemberAvatar({ membro }: { membro: MembroResponse }) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const src = membro.fotoAccount;
  return src && failedImage !== src ? (
    <img src={src} alt={"Foto de " + (membro.nome ?? membro.email ?? "membro")} loading="lazy" referrerPolicy="no-referrer" className="h-7 w-7 rounded-full object-cover" onError={() => setFailedImage(src)} />
  ) : (
    <span role="img" aria-label="Membro sem foto" className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500">
      <MemberIcon className="h-4 w-4" />
    </span>
  );
}

interface MembersTableProps {
  membros: MembroResponse[];
  onEdit: (membro: MembroResponse) => void;
  onDelete: (membro: MembroResponse) => void;
}

export function MembersTable({ membros, onEdit, onDelete }: MembersTableProps) {
  return (
    <RecordTable label="Membros" columns={COLUMNS} rowCount={membros.length}>
      {membros.map((membro) => (
        <RecordTableRow key={membro.id}>
          <RecordTableCell width={64}><MemberAvatar membro={membro} /></RecordTableCell>
          <RecordTableCell width={112}>{"#" + membro.id}</RecordTableCell>
          <RecordTableCell width={240} primary title={membro.nome ?? undefined}>{membro.nome || "—"}</RecordTableCell>
          <RecordTableCell width={300} title={membro.email ?? undefined}>{membro.email || "—"}</RecordTableCell>
          <RecordTableCell width={120}>{"#" + membro.idUsuario}</RecordTableCell>
          <RecordTableCell width={120}>{"#" + membro.idColetivo}</RecordTableCell>
          <RecordTableActions label={"do membro " + (membro.nome ?? membro.email ?? membro.id)} onEdit={() => onEdit(membro)} onDelete={() => onDelete(membro)} />
        </RecordTableRow>
      ))}
    </RecordTable>
  );
}
