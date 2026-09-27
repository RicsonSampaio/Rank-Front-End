import type { ColetivoResponse } from "@types-api/Coletivo";
import { ColetivoCardImage } from "./ColetivoCardImage";
import { ColetivoCardInfo } from "./ColetivoCardInfo";

function formatCreationDate(value: string) {
  const date = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.split("-").reverse().join("/") : value;
}

export function ColetivoCard({ coletivo }: { coletivo: ColetivoResponse }) {
  return (
    <article className="flex min-h-[132px] w-full flex-col gap-4 rounded-lg border-2 border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex gap-2">
        <ColetivoCardImage coletivo={coletivo} />
        <ColetivoCardInfo coletivo={coletivo} />
      </div>
      <p className="text-xs text-gray-500">
        Criado em {formatCreationDate(coletivo.dataCriacao)}
      </p>
    </article>
  );
}