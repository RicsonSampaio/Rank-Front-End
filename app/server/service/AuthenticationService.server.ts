import { AuthenticationApi } from "@api/AuthenticationApi.server";
import { getApiError } from "@common/apiError.server";

export class AuthenticationService {
  static async login(email: string, password: string) {
    try {
      return { success: true as const, token: await AuthenticationApi.login(email, password) };
    } catch (error) {
      return {
        success: false as const,
        ...getApiError(error, "Não foi possível entrar. Tente novamente."),
      };
    }
  }
}
