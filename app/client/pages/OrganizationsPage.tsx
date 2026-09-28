import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { AppLayout } from "@layouts/AppLayout";
import { RecordActions } from "@components/RecordActions";
import { RecordModal } from "@components/RecordModal";
import type { OrganizationResponse } from "@types-api/Organization";
import type { action } from "../../routes/organizations";

interface OrganizationsPageProps {
  organizations: OrganizationResponse[];
  error: string | null;
  admin: boolean;
}

interface OrganizationOperation {
  kind: "update" | "delete";
  organization: OrganizationResponse;
  requestId: string;
}

function formatCreationDate(value: string) {
  const date = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.split("-").reverse().join("/") : value;
}

export function OrganizationsPage({ organizations, error, admin }: OrganizationsPageProps) {
  const fetcher = useFetcher<typeof action>();
  const [operation, setOperation] = useState<OrganizationOperation | null>(null);
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

  const openOperation = (kind: OrganizationOperation["kind"], organization: OrganizationResponse) => {
    setMessage("");
    setOperation({ kind, organization, requestId: crypto.randomUUID() });
  };

  return (
    <AppLayout admin={admin}>
      <h1 className="mb-6 text-2xl font-semibold">Organizações</h1>
      {message && <p role="status" className="mb-4 rounded bg-green-50 p-3 text-green-700">{message}</p>}
      {error ? (
        <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>
      ) : organizations.length === 0 ? (
        <p>Nenhuma organização cadastrada.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">ID</th>
                <th scope="col" className="px-4 py-3">Nome</th>
                <th scope="col" className="px-4 py-3">Data de criação</th>
                <th scope="col" className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((organization) => (
                <tr key={organization.id} className="border-t border-gray-200">
                  <td className="px-4 py-3">{organization.id}</td>
                  <td className="px-4 py-3">{organization.nome}</td>
                  <td className="px-4 py-3">{formatCreationDate(organization.dataCriacao)}</td>
                  <td className="px-4 py-3">
                    <RecordActions name={organization.nome} disabled={busy} onEdit={() => openOperation("update", organization)} onDelete={() => openOperation("delete", organization)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {operation && (
        <RecordModal key={operation.requestId} title={operation.kind === "update" ? "Editar organização" : "Excluir organização"} busy={busy} onClose={() => setOperation(null)}>
          <fetcher.Form method="post" action="/organizations" className="flex flex-col gap-4">
            <input type="hidden" name="id" value={operation.organization.id} />
            <input type="hidden" name="intent" value={operation.kind} />
            <input type="hidden" name="requestId" value={operation.requestId} />
            {operation.kind === "update" ? (
              <>
                <label className="flex flex-col gap-1">
                  Nome
                  <input autoFocus className="rounded border p-2" type="text" name="nome" defaultValue={operation.organization.nome} maxLength={150} required disabled={busy} />
                </label>
                <label className="flex flex-col gap-1">
                  Logo (opcional)
                  <input className="rounded border p-2" type="text" name="logo" defaultValue={operation.organization.logo ?? ""} maxLength={2048} disabled={busy} />
                </label>
              </>
            ) : (
              <p>Excluir a organização <strong>{operation.organization.nome}</strong>? Esta ação não pode ser desfeita.</p>
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