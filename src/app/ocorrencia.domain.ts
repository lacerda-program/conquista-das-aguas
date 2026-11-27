import { Gravidade, Ocorrencia } from './ocorrencia.model';

export const PESO_GRAVIDADE: Record<Gravidade, number> = {
  baixa: 1,
  media: 2,
  alta: 3,
};

export const ROTULO_GRAVIDADE: Record<Gravidade, string> = {
  baixa: 'baixa',
  media: 'média',
  alta: 'alta',
};

export const META_SEMANAL = 5;
export const SEMANA_MS = 7 * 24 * 60 * 60 * 1000;

export interface RankingLocal {
  local: string;
  pontos: number;
  pct: number;
}

export function rotuloGravidade(gravidade: Gravidade): string {
  return ROTULO_GRAVIDADE[gravidade];
}

export function rankingPorLocal(abertas: readonly Ocorrencia[]): RankingLocal[] {
  const soma = new Map<string, number>();
  for (const ocorrencia of abertas) {
    soma.set(ocorrencia.bairro, (soma.get(ocorrencia.bairro) ?? 0) + PESO_GRAVIDADE[ocorrencia.gravidade]);
  }
  const lista = [...soma]
    .map(([local, pontos]) => ({ local, pontos }))
    .sort((a, b) => b.pontos - a.pontos || a.local.localeCompare(b.local, 'pt-BR'));
  const maior = lista[0]?.pontos ?? 1;
  return lista.map((item) => ({ ...item, pct: (item.pontos / maior) * 100 }));
}

export function contarResolvidasNaSemana(
  ocorrencias: readonly Ocorrencia[],
  agoraMs = Date.now(),
  janelaMs = SEMANA_MS,
): number {
  return ocorrencias.filter((ocorrencia) => {
    if (!ocorrencia.resolvida || ocorrencia.resolvidaEm === undefined) {
      return false;
    }
    const marcadaEm = Date.parse(ocorrencia.resolvidaEm);
    if (!Number.isFinite(marcadaEm)) {
      return false;
    }
    const decorrido = agoraMs - marcadaEm;
    return decorrido >= 0 && decorrido < janelaMs;
  }).length;
}

export function percentualMeta(resolvidas: number, meta: number): number {
  if (meta <= 0) {
    return 0;
  }
  return Math.min(100, (resolvidas / meta) * 100);
}

export function dicaDoDia(dicas: readonly string[], agoraMs: number): string {
  if (dicas.length === 0) {
    return '';
  }
  return dicas[Math.floor(agoraMs / 86400000) % dicas.length] ?? '';
}
