export interface OrganizationResponse {
  id: number;
  nome: string;
  dataCriacao: string;
  logo: string | null;
}

export interface UpdateOrganizationPayload {
  nome: string;
  logo: string | null;
}