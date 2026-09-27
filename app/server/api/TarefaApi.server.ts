import axios from "axios";
import { getEnv } from "@common/getEnv.server";
import { getApiRequestConfig } from "@common/apiTls.server";
import type { TarefaResponse, TarefaPayload } from "@types-api/Tarefa";

export class TarefaApi {
  private static config(token: string) {
    return { ...getApiRequestConfig(), headers: { Authorization: "Bearer " + token } };
  }

  static async list(idColetivo: number, token: string): Promise<TarefaResponse[]> {
    const response = await axios.get<TarefaResponse[]>(getEnv().API_URL + "/api/Tarefa", {
      ...this.config(token), params: { idColetivo },
    });
    return response.data;
  }

  static async getById(id: number, token: string): Promise<TarefaResponse> {
    const response = await axios.get<TarefaResponse>(getEnv().API_URL + "/api/Tarefa/" + id, this.config(token));
    return response.data;
  }

  static async create(payload: TarefaPayload, token: string): Promise<TarefaResponse> {
    const response = await axios.post<TarefaResponse>(getEnv().API_URL + "/api/Tarefa", payload, this.config(token));
    return response.data;
  }

  static async update(id: number, payload: TarefaPayload, token: string): Promise<TarefaResponse> {
    const response = await axios.put<TarefaResponse>(getEnv().API_URL + "/api/Tarefa/" + id, payload, this.config(token));
    return response.data;
  }

  static async delete(id: number, token: string): Promise<void> {
    await axios.delete(getEnv().API_URL + "/api/Tarefa/" + id, this.config(token));
  }
}
