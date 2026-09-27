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
  idFase: number | null;
  idRelevancia: number;
}
export type TarefaPayload = Omit<TarefaResponse, 'id' | 'dataCriacao' | 'dataAtualizacao'>;
