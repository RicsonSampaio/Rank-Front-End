import { UserApi } from "@api/UserApi.server";
import { getApiError } from "@common/apiError.server";
import type { CreateUserPayload } from "@types-api/User";

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
}