import { OrganizationApi } from "@api/OrganizationApi.server";
import { getApiError } from "@common/apiError.server";
import type { UpdateOrganizationPayload } from "@types-api/Organization";

export class OrganizationService {
  static async list(token: string) {
    try {
      return { success: true as const, organizations: await OrganizationApi.list(token) };
    } catch (error) {
      return {
        success: false as const,
        ...getApiError(error, "Não foi possível carregar as organizações. Tente novamente."),
      };
    }
  }

  static async update(id: number, payload: UpdateOrganizationPayload, token: string) {
    try {
      await OrganizationApi.update(id, payload, token);
      return { success: true as const };
    } catch (error) {
      return { success: false as const, ...getApiError(error, "Não foi possível salvar a organização. Tente novamente.") };
    }
  }

  static async delete(id: number, token: string) {
    try {
      await OrganizationApi.delete(id, token);
      return { success: true as const };
    } catch (error) {
      return { success: false as const, ...getApiError(error, "Não foi possível excluir a organização. Tente novamente.") };
    }
  }
}