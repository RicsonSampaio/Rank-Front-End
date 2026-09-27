import { useState } from "react";
import { AppLayout } from "@layouts/AppLayout";
import { PlusIcon, SearchIcon } from "@components/NavigationIcons";
import type { ColetivoResponse } from "@types-api/Coletivo";
import { ColetivoCard } from "./HomePage/components/ColetivoCard";
import { ColetivoCreateModal } from "./HomePage/components/ColetivoCreateModal";

interface HomePageProps {
  coletivos: ColetivoResponse[];
  error: string | null;
  admin: boolean;
}

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
}

export function HomePage({ coletivos, error, admin }: HomePageProps) {
  const [query, setQuery] = useState("");
  const [createRequestId, setCreateRequestId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const normalizedQuery = normalizeSearch(query);
  const filteredColetivos = coletivos.filter((coletivo) => normalizeSearch(coletivo.nome).includes(normalizedQuery));

  return (
    <AppLayout admin={admin}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Coletivos</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative">
            <span className="sr-only">Pesquisar coletivos</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              name="search"
              placeholder="Pesquisar coletivos..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded border py-2 pl-10 pr-3 sm:w-64"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setMessage("");
              setCreateRequestId(crypto.randomUUID());
            }}
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
          >
            <PlusIcon className="h-5 w-5" />
            Criar coletivo
          </button>
        </div>
      </div>
      {message && <p role="status" className="mb-4 rounded bg-green-50 p-3 text-green-700">{message}</p>}
      {error ? (
        <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>
      ) : coletivos.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-gray-600">
          Nenhum coletivo disponível.
        </div>
      ) : filteredColetivos.length === 0 ? (
        <p className="text-gray-600">Nenhum coletivo encontrado para esta pesquisa.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {filteredColetivos.map((coletivo) => <ColetivoCard key={coletivo.id} coletivo={coletivo} />)}
        </div>
      )}
      {createRequestId && (
        <ColetivoCreateModal
          key={createRequestId}
          requestId={createRequestId}
          onClose={() => setCreateRequestId(null)}
          onCreated={(resultMessage) => {
            setMessage(resultMessage);
            setQuery("");
            setCreateRequestId(null);
          }}
        />
      )}
    </AppLayout>
  );
}