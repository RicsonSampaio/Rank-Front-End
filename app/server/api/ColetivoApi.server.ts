import axios from "axios";
import { getEnv } from "@common/getEnv.server";
import { getApiRequestConfig } from "@common/apiTls.server";
import type { ColetivoResponse, CreateColetivoPayload } from "@types-api/Coletivo";

export class ColetivoApi {
  static async create(payload: CreateColetivoPayload, token: string): Promise<ColetivoResponse> {
    const { API_URL } = getEnv();
    const response = await axios.post<ColetivoResponse>(API_URL + "/api/Coletivo", payload, {
      ...getApiRequestConfig(),
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  }
  static async list(token: string): Promise<ColetivoResponse[]> {
    const { API_URL } = getEnv();
    const response = await axios.get<ColetivoResponse[]>(API_URL + "/api/Coletivo", {
      ...getApiRequestConfig(),
      headers: { Authorization: "Bearer " + token },
    });

    return response.data.map((coletivo) => {
      let logo: string | null = null;
      if (coletivo.logo?.trim()) {
        try {
          logo = new URL(coletivo.logo.trim(), API_URL + "/").href;
        } catch {
          logo = null;
        }
      }
      return { ...coletivo, logo };
    });
  }
}