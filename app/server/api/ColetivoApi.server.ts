import axios from "axios";
import { getEnv } from "@common/getEnv.server";
import { getApiRequestConfig } from "@common/apiTls.server";
import type { ColetivoResponse, CreateColetivoPayload, UpdateColetivoPayload } from "@types-api/Coletivo";

export class ColetivoApi {
  static async getById(id: number, token: string): Promise<ColetivoResponse> {
    const response = await axios.get<ColetivoResponse>(getEnv().API_URL + "/api/Coletivo/" + id, {
      ...getApiRequestConfig(), headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  }

  static async update(id: number, payload: UpdateColetivoPayload, token: string): Promise<ColetivoResponse> {
    const response = await axios.put<ColetivoResponse>(getEnv().API_URL + "/api/Coletivo/" + id, payload, {
      ...getApiRequestConfig(), headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  }

  static async delete(id: number, token: string): Promise<void> {
    await axios.delete(getEnv().API_URL + "/api/Coletivo/" + id, {
      ...getApiRequestConfig(), headers: { Authorization: "Bearer " + token },
    });
  }
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