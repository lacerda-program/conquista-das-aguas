export type CondicaoTrecho = 'preservado' | 'atencao' | 'critico';

export interface TrechoBacia {
  id: string;
  nome: string;
  subtitulo: string;
  condicao: CondicaoTrecho;
  extensaoKm: number;
  descricao: string;
  vulnerabilidades: string[];
  acoesEmAndamento: string[];
  indicadorQualidade: number; // 0 a 100
}

export interface GuiaPratico {
  id: string;
  titulo: string;
  categoria: 'prevencao' | 'agua' | 'descarte' | 'direitos';
  tempoLeitura: string;
  icone: string;
  resumo: string;
  passos: string[];
  beneficioComunitario: string;
}

export interface IndicadoresBacia {
  qualidadeGeral: number; // %
  nascentesProtegidas: number;
  pontosCriticosMapeados: number;
  volumeRetidoMedioM3: string;
}
