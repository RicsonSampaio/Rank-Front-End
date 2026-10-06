export interface TarefaResponse {
  id: number;
  idColetivo: number;
  idEspaco: number;
  idEscopo: number | null;
  idStatus: number;
  idCategoria: number;
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
export type TarefaPayload = Omit<TarefaResponse, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'nomeResponsavel'>;
