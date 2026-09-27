import { Link } from "react-router";
import type { ColetivoResponse } from "@types-api/Coletivo";
import { ColetivoCardImage } from "./ColetivoCardImage";
import { ColetivoCardInfo } from "./ColetivoCardInfo";

function formatCreationDate(value: string) {
  const date = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.split("-").reverse().join("/") : value;
}

export function ColetivoCard({ coletivo }: { coletivo: ColetivoResponse }) {
  return (
    <Link
      to={"/" + coletivo.id + "/Tasks/List"}
      aria-label={"Ver tarefas de " + coletivo.nome}
      className="flex min-h-[132px] w-full flex-col gap-4 rounded-lg border-2 border-gray-100 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
    >
      <div className="flex gap-2">
        <ColetivoCardImage coletivo={coletivo} />
        <ColetivoCardInfo coletivo={coletivo} />
      </div>
      <p className="text-xs text-gray-500">
        Criado em {formatCreationDate(coletivo.dataCriacao)}
      </p>
    </Link>
  );
}