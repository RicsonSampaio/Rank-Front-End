import axios from "axios";
import { getEnv } from "@common/getEnv.server";
import { getApiRequestConfig } from "@common/apiTls.server";
import type { CreateUserPayload, UserResponse } from "@types-api/User";

export class UserApi {
  static async create(payload: CreateUserPayload): Promise<UserResponse> {
    const { API_URL } = getEnv();
    const response = await axios.post<UserResponse>(API_URL + "/api/users", payload, getApiRequestConfig());
    return response.data;
  }

  static async list(token: string): Promise<UserResponse[]> {
    const { API_URL } = getEnv();
    const response = await axios.get<UserResponse[]>(API_URL + "/api/users", {
      ...getApiRequestConfig(),
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  }
}