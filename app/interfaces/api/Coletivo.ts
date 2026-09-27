export interface ColetivoResponse {
  id: number;
  nome: string;
  dataCriacao: string;
  dataAtualizacao: string;
  idOrganizacao: number;
  idTipoColetivo: number;
  logo: string | null;
}

export interface CreateColetivoPayload {
  nome: string;
  idTipoColetivo: number;
  logo: string | null;
}
export type UpdateColetivoPayload = CreateColetivoPayload;
