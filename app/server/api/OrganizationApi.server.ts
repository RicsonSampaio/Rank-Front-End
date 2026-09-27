import axios from "axios";
import { getEnv } from "@common/getEnv.server";
import { getApiRequestConfig } from "@common/apiTls.server";
import type { OrganizationResponse, UpdateOrganizationPayload } from "@types-api/Organization";

export class OrganizationApi {
  static async list(token: string): Promise<OrganizationResponse[]> {
    const { API_URL } = getEnv();
    const response = await axios.get<OrganizationResponse[]>(API_URL + "/api/Organizacao", {
      ...getApiRequestConfig(),
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  }

  static async update(id: number, payload: UpdateOrganizationPayload, token: string): Promise<OrganizationResponse> {
    const { API_URL } = getEnv();
    const response = await axios.put<OrganizationResponse>(API_URL + "/api/Organizacao/" + id, payload, {
      ...getApiRequestConfig(),
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  }

  static async delete(id: number, token: string): Promise<void> {
    const { API_URL } = getEnv();
    await axios.delete(API_URL + "/api/Organizacao/" + id, {
      ...getApiRequestConfig(),
      headers: { Authorization: "Bearer " + token },
    });
  }
}