import type { TarefaResponse } from "@types-api/Tarefa";

export interface TaskColumn {
  id: keyof TarefaResponse;
  label: string;
  width: number;
  type: "text" | "date" | "identifier" | "visibility" | "number" | "relevancia";
}