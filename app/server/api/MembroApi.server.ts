import axios from "axios";
import { getEnv } from "@common/getEnv.server";
import { getApiRequestConfig } from "@common/apiTls.server";
import type { MembroPayload, MembroResponse } from "@types-api/Membro";

export class MembroApi {
  private static config(token: string) {
    return { ...getApiRequestConfig(), headers: { Authorization: "Bearer " + token } };
  }

  private static normalize(membro: MembroResponse): MembroResponse {
    let fotoAccount: string | null = null;
    if (membro.fotoAccount?.trim()) {
      try {
        const url = new URL(membro.fotoAccount.trim(), getEnv().API_URL.replace(/\/$/, "") + "/");
        if (url.protocol === "http:" || url.protocol === "https:") fotoAccount = url.href;
      } catch { /* Invalid images use the avatar placeholder. */ }
    }
    return { ...membro, fotoAccount };
  }

  static async list(idColetivo: number, token: string): Promise<MembroResponse[]> {
    const response = await axios.get<MembroResponse[]>(getEnv().API_URL + "/api/membro", {
      ...this.config(token), params: { idColetivo },
    });
    return response.data.map((membro) => this.normalize(membro));
  }

  static async getById(id: number, token: string): Promise<MembroResponse> {
    const response = await axios.get<MembroResponse>(getEnv().API_URL + "/api/membro/" + id, this.config(token));
    return this.normalize(response.data);
  }

  static async create(payload: MembroPayload, token: string): Promise<MembroResponse> {
    const response = await axios.post<MembroResponse>(getEnv().API_URL + "/api/membro", payload, this.config(token));
    return this.normalize(response.data);
  }

  static async update(id: number, payload: MembroPayload, token: string): Promise<MembroResponse> {
    const response = await axios.put<MembroResponse>(getEnv().API_URL + "/api/membro/" + id, payload, this.config(token));
    return this.normalize(response.data);
  }

  static async delete(id: number, token: string): Promise<void> {
    await axios.delete(getEnv().API_URL + "/api/membro/" + id, this.config(token));
  }
}
