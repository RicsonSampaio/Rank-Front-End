import axios from "axios";
import { getEnv } from "@common/getEnv.server";
import { getApiRequestConfig } from "@common/apiTls.server";
import type { AuthenticationResponse } from "@types-api/Authentication";

export class AuthenticationApi {
  static async login(email: string, password: string): Promise<string> {
    const { API_URL } = getEnv();
    const response = await axios.post<AuthenticationResponse>(
      `${API_URL}/api/auth/authenticate`,
      { email, password },
      getApiRequestConfig(),
    );
    const token = response.data?.access_token;
    if (!token) throw new Error("Resposta de autenticação sem access_token");
    return token;
  }
}
