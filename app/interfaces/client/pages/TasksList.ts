import type { TarefaResponse } from "@types-api/Tarefa";

export interface TaskColumn {
  id: keyof TarefaResponse;
  label: string;
  width: number;
  type: "text" | "date" | "identifier" | "visibility" | "number" | "relevancia";
  // Coluna de nome vindo do backend: sem o nome, mostra este ID (ex.: "#5")
  fallbackId?: keyof TarefaResponse;
}