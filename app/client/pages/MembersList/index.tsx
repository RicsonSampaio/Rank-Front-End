import { useCallback, useState } from "react";
import { Link } from "react-router";
import { AppLayout } from "@layouts/AppLayout";
import { PlusIcon } from "@components/NavigationIcons";
import type { MembroResponse } from "@types-api/Membro";
import { MembersTable } from "./components/MembersTable";
import { MemberFormDrawer } from "./components/MemberFormDrawer";
import { MemberDeleteModal } from "./components/MemberDeleteModal";

interface MembersListPageProps {
  membros: MembroResponse[];
  idColetivo: number;
  error: string | null;
  admin: boolean;
}

type MemberOperation =
  | { mode: "create"; requestId: string }
  | { mode: "update" | "delete"; membro: MembroResponse; requestId: string };

export function MembersListPage({ membros, idColetivo, error, admin }: MembersListPageProps) {
  const [operation, setOperation] = useState<MemberOperation | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const close = useCallback(() => setOperation(null), []);
  const success = useCallback((text: string) => {
    setOperation(null);
    setMessage(text);
  }, []);
  const edit = useCallback((membro: MembroResponse) => {
    setMessage(null);
    setOperation({ mode: "update", membro, requestId: crypto.randomUUID() });
  }, []);
  const remove = useCallback((membro: MembroResponse) => {
    setMessage(null);
    setOperation({ mode: "delete", membro, requestId: crypto.randomUUID() });
  }, []);

  return (
    <AppLayout admin={admin} idColetivo={idColetivo}>
      <nav aria-label="Caminho da página" className="mb-4 text-sm text-gray-500">
        <Link to="/home" className="underline hover:text-gray-900">Coletivos</Link>
        <span> / </span>
        <Link to={"/" + idColetivo + "/Tasks/List"} className="underline hover:text-gray-900">Coletivo #{idColetivo}</Link>
        <span> / Membros</span>
      </nav>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Membros</h1>
          {!error && <p className="text-sm text-gray-500">{membros.length} {membros.length === 1 ? "membro" : "membros"}</p>}
        </div>
        <button type="button" className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" onClick={() => {
          setMessage(null);
          setOperation({ mode: "create", requestId: crypto.randomUUID() });
        }}>
          <PlusIcon className="h-5 w-5" />
          Adicionar membro
        </button>
      </div>
      {message && <p role="status" className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}</p>}
      {error ? (
        <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>
      ) : membros.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-gray-600">Nenhum membro vinculado a este coletivo.</div>
      ) : <MembersTable membros={membros} onEdit={edit} onDelete={remove} />}
      {operation && operation.mode !== "delete" && (
        <MemberFormDrawer key={operation.requestId} mode={operation.mode} memberId={operation.mode === "update" ? operation.membro.id : undefined} idColetivo={idColetivo} requestId={operation.requestId} onClose={close} onSuccess={success} />
      )}
      {operation?.mode === "delete" && (
        <MemberDeleteModal key={operation.requestId} membro={operation.membro} idColetivo={idColetivo} requestId={operation.requestId} onClose={close} onSuccess={success} />
      )}
    </AppLayout>
  );
}
