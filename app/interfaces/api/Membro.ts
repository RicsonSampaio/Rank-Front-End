export interface MembroResponse {
  id: number;
  idColetivo: number;
  idUsuario: number;
  email: string | null;
  nome: string | null;
  fotoAccount: string | null;
}

export interface MembroPayload {
  idColetivo: number;
  email: string;
}
