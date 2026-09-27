import type { ColetivoResponse } from "@types-api/Coletivo";

const imagePlaceholder = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#f3f4f6"/><g fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"><circle cx="27" cy="24" r="7"/><path d="M14 47v-3a13 13 0 0 1 26 0v3H14ZM42 18a7 7 0 0 1 0 13M45 37a11 11 0 0 1 6 10"/></g></svg>',
);

export function ColetivoCardImage({ coletivo }: { coletivo: ColetivoResponse }) {
  return (
    <img
      alt={"Logo de " + coletivo.nome}
      src={coletivo.logo || imagePlaceholder}
      loading="lazy"
      onError={(event) => {
        if (event.currentTarget.getAttribute("src") !== imagePlaceholder) {
          event.currentTarget.src = imagePlaceholder;
        }
      }}
      className="aspect-square h-16 w-16 shrink-0 rounded border-2 border-gray-300 object-contain object-center p-0.5"
    />
  );
}