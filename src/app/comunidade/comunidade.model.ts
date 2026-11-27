export type CategoriaMutirao = 'limpeza' | 'plantio' | 'prevencao' | 'conscientizacao';

export interface Mutirao {
  id: number;
  titulo: string;
  bairro: string;
  localExato: string;
  data: string;
  horario: string;
  categoria: CategoriaMutirao;
  descricao: string;
  voluntariosConfirmados: number;
  metaVoluntarios: number;
  jaInscrito?: boolean;
  organizador: string;
}

export type TipoPontoAcolhimento = 'abrigo' | 'arrecadacao' | 'apoio_social';

export interface PontoAcolhimento {
  id: number;
  nome: string;
  bairro: string;
  endereco: string;
  telefone: string;
  tipo: TipoPontoAcolhimento;
  status: 'aberto' | 'plantao_alerta';
  capacidade: string;
  itensPrioritarios: string[];
}
