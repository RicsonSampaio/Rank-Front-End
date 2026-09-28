import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { AppLayout } from "@layouts/AppLayout";
import { RecordActions } from "@components/RecordActions";
import { RecordModal } from "@components/RecordModal";
import type { UserResponse } from "@types-api/User";
import type { action } from "../../routes/people";

interface PeoplePageProps {
  users: UserResponse[];
  admin: boolean;
  error: string | null;
}

interface UserOperation {
  kind: "update" | "delete";
  user: UserResponse;
  requestId: string;
}

export function PeoplePage({ users, error, admin }: PeoplePageProps) {
  const fetcher = useFetcher<typeof action>();
  const [operation, setOperation] = useState<UserOperation | null>(null);
  const [message, setMessage] = useState("");
  const busy = fetcher.state !== "idle";
  const feedback = fetcher.data?.requestId === operation?.requestId ? fetcher.data : undefined;

  useEffect(() => {
    if (operation && fetcher.state === "idle" && fetcher.data?.success &&
        fetcher.data.requestId === operation.requestId) {
      setMessage(fetcher.data.message);
      setOperation(null);
    }
  }, [fetcher.state, fetcher.data, operation]);

  const openOperation = (kind: UserOperation["kind"], user: UserResponse) => {
    setMessage("");
    setOperation({ kind, user, requestId: crypto.randomUUID() });
  };

  return (
    <AppLayout admin={admin}>
      <h1 className="mb-6 text-2xl font-semibold">Pessoas</h1>
      {message && <p role="status" className="mb-4 rounded bg-green-50 p-3 text-green-700">{message}</p>}
      {error ? (
        <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>
      ) : users.length === 0 ? (
        <p>Nenhum usuário cadastrado.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">Nome</th>
                <th scope="col" className="px-4 py-3">Email</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-200">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.isActive ? "Ativo" : "Inativo"}</td>
                  <td className="px-4 py-3">
                    <RecordActions name={user.name} disabled={busy} onEdit={() => openOperation("update", user)} onDelete={() => openOperation("delete", user)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {operation && (
        <RecordModal key={operation.requestId} title={operation.kind === "update" ? "Editar pessoa" : "Excluir pessoa"} busy={busy} onClose={() => setOperation(null)}>
          <fetcher.Form method="post" action="/people" className="flex flex-col gap-4">
            <input type="hidden" name="id" value={operation.user.id} />
            <input type="hidden" name="intent" value={operation.kind} />
            <input type="hidden" name="requestId" value={operation.requestId} />
            {operation.kind === "update" ? (
              <>
                <label className="flex flex-col gap-1">
                  Nome
                  <input autoFocus className="rounded border p-2" type="text" name="name" defaultValue={operation.user.name} minLength={2} maxLength={150} required disabled={busy} />
                </label>
                <label className="flex flex-col gap-1">
                  Email
                  <input className="rounded border p-2" type="email" name="email" defaultValue={operation.user.email} maxLength={320} required disabled={busy} />
                </label>
                <label className="flex flex-col gap-1">
                  Nova senha (opcional)
                  <input className="rounded border p-2" type="password" name="password" autoComplete="new-password" disabled={busy} />
                </label>
                <p className="text-sm text-gray-500">Deixe a senha em branco para manter a atual.</p>
              </>
            ) : (
              <p>Excluir a pessoa <strong>{operation.user.name}</strong>? Esta ação não pode ser desfeita.</p>
            )}
            {feedback && !feedback.success && <p role="alert" className="text-red-700">{feedback.message}</p>}
            <div className="mt-2 flex justify-end gap-2">
              <button type="button" onClick={() => setOperation(null)} disabled={busy} className="rank-btn rank-btn-cancel">Cancelar</button>
              <button type="submit" disabled={busy} className={"rank-btn " + (operation.kind === "delete" ? "rank-btn-danger" : "rank-btn-primary")}>
                {busy ? "Aguarde..." : operation.kind === "delete" ? "Excluir" : "Salvar"}
              </button>
            </div>
          </fetcher.Form>
        </RecordModal>
      )}
    </AppLayout>
  );
}