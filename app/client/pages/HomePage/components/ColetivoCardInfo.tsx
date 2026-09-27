import type { ColetivoResponse } from "@types-api/Coletivo";

export function ColetivoCardInfo({ coletivo }: { coletivo: ColetivoResponse }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center">
      <h2 className="truncate text-lg font-semibold text-gray-900" title={coletivo.nome}>
        {coletivo.nome}
      </h2>
    </div>
  );
}