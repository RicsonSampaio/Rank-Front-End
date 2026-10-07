export interface TarefaResponse {
  id: number;
  idColetivo: number;
  idEspaco: number;
  idEscopo: number | null;
  idStatus: number;
  // Opcional até o backend passar a devolver o nome do status
  nomeStatus?: string | null;
  // 0 = sem categoria
  idCategoria: number;
  // Opcional até o backend passar a devolver o nome da categoria
  nomeCategoria?: string | null;
  idUsuarioCriacao: number;
  titulo: string;
  privada: boolean;
  descricao: string | null;
  dataCriacao: string;
  dataAtualizacao: string | null;
  lastDoneDate: string | null;
  idTarefaPai: number | null;
  userListMarcados: string | null;
  userListParticipantes: string;
  idDocumento: number | null;
  prazoInicial: string | null;
  prazoFinal: string | null;
  idResponsavel: number | null;
  // Opcional até o backend passar a devolver o nome do responsável
  nomeResponsavel?: string | null;
  idFase: number | null;
  idRelevancia: number;
}
export interface RelevanciaOption {
  valor: number;
  nome: string;
}
export interface TarefaStatusOption {
  id: number;
  nome: string;
}
export interface TarefaCategoriaResponse {
  id: number;
  idColetivo: number;
  nome: string;
  dataCriacao: string;
  dataAtualizacao: string | null;
}
export type TarefaPayload = Omit<TarefaResponse, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'nomeResponsavel' | 'nomeStatus' | 'nomeCategoria'>;
