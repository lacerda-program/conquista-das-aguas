export type Gravidade = 'baixa' | 'media' | 'alta';

export const GRAVIDADES: readonly Gravidade[] = ['baixa', 'media', 'alta'];

export const TIPOS_OCORRENCIA = [
  'Esgoto a céu aberto',
  'Bueiro entupido',
  'Alagamento',
  'Descarte irregular',
  'Queimada perto de nascente',
] as const;

export type TipoOcorrencia = (typeof TIPOS_OCORRENCIA)[number];

export type FiltroOcorrencia = 'abertas' | 'resolvidas' | 'todas';

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

export function isGravidade(value: unknown): value is Gravidade {
  return value === 'baixa' || value === 'media' || value === 'alta';
}

export function isOcorrencia(value: unknown): value is Ocorrencia {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    typeof item['id'] === 'number' &&
    Number.isFinite(item['id']) &&
    typeof item['tipo'] === 'string' &&
    typeof item['bairro'] === 'string' &&
    typeof item['descricao'] === 'string' &&
    isGravidade(item['gravidade']) &&
    typeof item['resolvida'] === 'boolean' &&
    typeof item['data'] === 'string' &&
    (item['resolvidaEm'] === undefined || typeof item['resolvidaEm'] === 'string')
  );
}
