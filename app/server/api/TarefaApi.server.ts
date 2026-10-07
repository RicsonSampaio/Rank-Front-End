import axios from "axios";
import { getEnv } from "@common/getEnv.server";
import { getApiRequestConfig } from "@common/apiTls.server";
import type { RelevanciaOption, TarefaCategoriaResponse, TarefaResponse, TarefaPayload, TarefaStatusOption } from "@types-api/Tarefa";

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

  static async relevancias(token: string): Promise<RelevanciaOption[]> {
    const response = await axios.get<RelevanciaOption[]>(getEnv().API_URL + "/api/Tarefa/relevancias", this.config(token));
    return response.data;
  }

  static async status(token: string): Promise<TarefaStatusOption[]> {
    const response = await axios.get<TarefaStatusOption[]>(getEnv().API_URL + "/api/Tarefa/status", this.config(token));
    return response.data;
  }

  static async listCategorias(idColetivo: number, token: string): Promise<TarefaCategoriaResponse[]> {
    const response = await axios.get<TarefaCategoriaResponse[]>(getEnv().API_URL + "/api/Tarefa/categorias", {
      ...this.config(token), params: { idColetivo },
    });
    return response.data;
  }

  static async getCategoriaById(id: number, token: string): Promise<TarefaCategoriaResponse> {
    const response = await axios.get<TarefaCategoriaResponse>(getEnv().API_URL + "/api/Tarefa/categorias/" + id, this.config(token));
    return response.data;
  }

  static async createCategoria(idColetivo: number, nome: string, token: string): Promise<TarefaCategoriaResponse> {
    const response = await axios.post<TarefaCategoriaResponse>(getEnv().API_URL + "/api/Tarefa/categorias", { idColetivo, nome }, this.config(token));
    return response.data;
  }

  static async updateCategoria(id: number, nome: string, token: string): Promise<TarefaCategoriaResponse> {
    const response = await axios.put<TarefaCategoriaResponse>(getEnv().API_URL + "/api/Tarefa/categorias/" + id, { nome }, this.config(token));
    return response.data;
  }

  static async deleteCategoria(id: number, token: string): Promise<void> {
    await axios.delete(getEnv().API_URL + "/api/Tarefa/categorias/" + id, this.config(token));
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
