import type { TarefaPayload } from "@types-api/Tarefa";

export function isTarefaId(value: number) {
  return Number.isInteger(value) && value > 0 && value <= 2147483647;
}

export function parseTarefaPayload(raw: FormDataEntryValue | null): TarefaPayload {
  if (typeof raw !== "string") throw new Error("Dados da tarefa inválidos.");
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw new Error("Dados da tarefa inválidos."); }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Dados da tarefa inválidos.");
  const value = parsed as Record<string, unknown>;
  const integer = (key: string, nullable = false): number | null => {
    const field = value[key];
    if (nullable && field === null) return null;
    if (typeof field !== "number" || !Number.isInteger(field) || field < 0 || field > 2147483647) {
      throw new Error("Informe um ID ou número válido no campo " + key + ".");
    }
    return field;
  };
  const text = (key: string, nullable = false): string | null => {
    const field = value[key];
    if (nullable && field === null) return null;
    if (typeof field !== "string") throw new Error("Valor inválido no campo " + key + ".");
    return field;
  };
  const date = (key: string) => {
    const field = text(key, true);
    if (field !== null && !Number.isFinite(Date.parse(field))) throw new Error("Data inválida no campo " + key + ".");
    return field;
  };
  const titulo = text("titulo")!.trim();
  if (!titulo) throw new Error("Informe o título da tarefa.");
  if (typeof value.privada !== "boolean") throw new Error("Visibilidade inválida.");
  return {
    idColetivo: integer("idColetivo")!, idEspaco: integer("idEspaco")!,
    idEscopo: integer("idEscopo", true), idStatus: integer("idStatus")!,
    idCategoria: integer("idCategoria")!, idUsuarioCriacao: integer("idUsuarioCriacao")!,
    titulo, privada: value.privada, descricao: text("descricao", true),
    lastDoneDate: date("lastDoneDate"), idTarefaPai: integer("idTarefaPai", true),
    userListMarcados: text("userListMarcados", true), userListParticipantes: text("userListParticipantes")!,
    idDocumento: integer("idDocumento", true), prazoInicial: date("prazoInicial"),
    prazoFinal: date("prazoFinal"), idResponsavel: integer("idResponsavel", true),
    idFase: integer("idFase", true), idRelevancia: integer("idRelevancia")!,
  };
}
