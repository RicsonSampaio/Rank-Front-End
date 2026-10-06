import { TarefaApi } from "@api/TarefaApi.server";
import { getApiError } from "@common/apiError.server";
import type { TarefaPayload } from "@types-api/Tarefa";

export class TarefaService {
  private static async execute<T>(operation: () => Promise<T>, message: string) {
    try {
      return { success: true as const, value: await operation() };
    } catch (error) {
      return { success: false as const, ...getApiError(error, message) };
    }
  }

  static async list(idColetivo: number, token: string) {
    const result = await this.execute(() => TarefaApi.list(idColetivo, token), "Não foi possível carregar as tarefas.");
    return result.success ? { success: true as const, tarefas: result.value } : result;
  }

  static relevancias(token: string) {
    return this.execute(() => TarefaApi.relevancias(token), "Não foi possível carregar as relevâncias.");
  }

  static getById(id: number, token: string) {
    return this.execute(() => TarefaApi.getById(id, token), "Não foi possível carregar a tarefa.");
  }

  static create(payload: TarefaPayload, token: string) {
    return this.execute(() => TarefaApi.create(payload, token), "Não foi possível criar a tarefa.");
  }

  static update(id: number, payload: TarefaPayload, token: string) {
    return this.execute(() => TarefaApi.update(id, payload, token), "Não foi possível atualizar a tarefa.");
  }

  static delete(id: number, token: string) {
    return this.execute(() => TarefaApi.delete(id, token), "Não foi possível excluir a tarefa.");
  }
}
