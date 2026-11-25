export type Gravidade = 'baixa' | 'media' | 'alta';

export interface Ocorrencia {
  id: number;
  tipo: string;
  bairro: string;
  descricao: string;
  gravidade: Gravidade;
  resolvida: boolean;
  resolvidaEm?: string;
  data: string;
}
