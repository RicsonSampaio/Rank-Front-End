import { MembroApi } from "@api/MembroApi.server";
import { getApiError } from "@common/apiError.server";
import type { MembroPayload } from "@types-api/Membro";

export class MembroService {
  private static async execute<T>(operation: () => Promise<T>, message: string) {
    try {
      return { success: true as const, value: await operation() };
    } catch (error) {
      return { success: false as const, ...getApiError(error, message) };
    }
  }

  static list(idColetivo: number, token: string) {
    return this.execute(() => MembroApi.list(idColetivo, token), "Não foi possível carregar os membros.");
  }

  static getById(id: number, token: string) {
    return this.execute(() => MembroApi.getById(id, token), "Não foi possível carregar o membro.");
  }

  static create(payload: MembroPayload, token: string) {
    return this.execute(() => MembroApi.create(payload, token), "Não foi possível adicionar o membro.");
  }

  static update(id: number, payload: MembroPayload, token: string) {
    return this.execute(() => MembroApi.update(id, payload, token), "Não foi possível atualizar o membro.");
  }

  static delete(id: number, token: string) {
    return this.execute(() => MembroApi.delete(id, token), "Não foi possível remover o membro.");
  }
}
