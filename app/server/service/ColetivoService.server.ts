import { ColetivoApi } from "@api/ColetivoApi.server";
import { getApiError } from "@common/apiError.server";
import type { CreateColetivoPayload, UpdateColetivoPayload } from "@types-api/Coletivo";

export class ColetivoService {
  static async getById(id: number, token: string) {
    try {
      return { success: true as const, coletivo: await ColetivoApi.getById(id, token) };
    } catch (error) {
      return { success: false as const, ...getApiError(error, "Não foi possível carregar o coletivo.") };
    }
  }

  static async update(id: number, payload: UpdateColetivoPayload, token: string) {
    try {
      await ColetivoApi.update(id, payload, token);
      return { success: true as const };
    } catch (error) {
      return { success: false as const, ...getApiError(error, "Não foi possível atualizar o coletivo.") };
    }
  }

  static async delete(id: number, token: string) {
    try {
      await ColetivoApi.delete(id, token);
      return { success: true as const };
    } catch (error) {
      return { success: false as const, ...getApiError(error, "Não foi possível deletar o coletivo.") };
    }
  }
  static async list(token: string) {
    try {
      return { success: true as const, coletivos: await ColetivoApi.list(token) };
    } catch (error) {
      return {
        success: false as const,
        ...getApiError(error, "Não foi possível carregar os coletivos. Tente novamente."),
      };
    }
  }

  static async create(payload: CreateColetivoPayload, token: string) {
    try {
      await ColetivoApi.create(payload, token);
      return { success: true as const };
    } catch (error) {
      return {
        success: false as const,
        ...getApiError(error, "Não foi possível criar o coletivo. Tente novamente."),
      };
    }
  }
}