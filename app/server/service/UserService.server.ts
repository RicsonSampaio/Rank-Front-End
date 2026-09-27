import { UserApi } from "@api/UserApi.server";
import { getApiError } from "@common/apiError.server";
import type { CreateUserPayload, UpdateUserPayload } from "@types-api/User";

export class UserService {
  static async register(payload: CreateUserPayload) {
    try {
      return { success: true as const, user: await UserApi.create(payload) };
    } catch (error) {
      return {
        success: false as const,
        ...getApiError(error, "Não foi possível cadastrar. Tente novamente."),
      };
    }
  }

  static async list(token: string) {
    try {
      return { success: true as const, users: await UserApi.list(token) };
    } catch (error) {
      return {
        success: false as const,
        ...getApiError(error, "Não foi possível carregar as pessoas. Tente novamente."),
      };
    }
  }

  static async update(id: number, payload: UpdateUserPayload, token: string) {
    try {
      await UserApi.update(id, payload, token);
      return { success: true as const };
    } catch (error) {
      return { success: false as const, ...getApiError(error, "Não foi possível salvar a pessoa. Tente novamente.") };
    }
  }

  static async delete(id: number, token: string) {
    try {
      await UserApi.delete(id, token);
      return { success: true as const };
    } catch (error) {
      return { success: false as const, ...getApiError(error, "Não foi possível excluir a pessoa. Tente novamente.") };
    }
  }
}