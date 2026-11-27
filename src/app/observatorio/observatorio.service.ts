import { Injectable, signal } from '@angular/core';
import { GuiaPratico, IndicadoresBacia, TrechoBacia } from './observatorio.model';

const TRECHOS_VERRUGA: TrechoBacia[] = [
  {
    id: 'poco-escuro',
    nome: 'Nascentes no Poço Escuro (Serra do Periperi)',
    subtitulo: 'Área de recarga da Bacia do Rio Verruga',
    condicao: 'preservado',
    extensaoKm: 4.2,
    descricao:
      'Remanescente de Mata Atlântica e Caatinga com nascentes vitais para Vitória da Conquista. Apresenta boa cobertura florestal, mas sofre com pressão de descarte irregular de entulho nos acessos periféricos.',
    vulnerabilidades: [
      'Queimadas e desmatamento clandestino nas bordas da reserva',
      'Descarte de restos de construção e pneus em trilhas',
    ],
    acoesEmAndamento: [
      'Mutirões de plantio com mudas nativas da Caatinga',
      'Vigilância comunitária e fiscalização ambiental da Guarda Municipal',
    ],
    indicadorQualidade: 82,
  },
  {
    id: 'canal-central',
    nome: 'Trecho Urbano Central (Bartolomeu de Gusmão e Integração)',
    subtitulo: 'Canal retificado e rede subterrânea de drenagem',
    condicao: 'critico',
    extensaoKm: 6.8,
    descricao:
      'Setor altamente impermeabilizado onde a velocidade da água aumenta bruscamente durante tempestades. Bueiros obstruídos por lixo plástico causam transbordamentos frequentes na Av. São Geraldo e Integração.',
    vulnerabilidades: [
      'Ligação clandestina de esgoto na rede pluvial',
      'Assoreamento por sedimentos vindos dos bairros altos',
      'Pontos crônicos de alagamento de veículos e pedestres',
    ],
    acoesEmAndamento: [
      'Cobrança de dragagem e limpeza das grades pela Seinfra',
      'Mapeamento colaborativo de bueiros sem tampa ou entupidos',
    ],
    indicadorQualidade: 36,
  },
  {
    id: 'lagoa-bateias',
    nome: 'Parque e Bacia da Lagoa das Bateias',
    subtitulo: 'Corpo d’água receptor e área de preservação urbana',
    condicao: 'atencao',
    extensaoKm: 5.5,
    descricao:
      'Grande bacia receptora das águas pluviais da Zona Oeste da cidade antes de seguir para a Bacia do Rio Pardo. Passa por obras de revitalização, mas requer monitoramento constante contra poluição difusa.',
    vulnerabilidades: [
      'Proliferação de plantas aquáticas devido ao excesso de matéria orgânica',
      'Erosão das margens pela força das enxurradas',
    ],
    acoesEmAndamento: [
      'Desassoreamento mecânico e recomposição paisagística',
      'Criação de anel de proteção comunitária com escolas da região',
    ],
    indicadorQualidade: 58,
  },
];

const GUIAS_PRATICOS: GuiaPratico[] = [
  {
    id: 'cisterna-chuva',
    titulo: 'Como montar uma mini cisterna doméstica para captar água de chuva',
    categoria: 'agua',
    tempoLeitura: '4 min',
    icone: '💧',
    resumo: 'Aprenda a reter a água das calhas para rega e limpeza, aliviando as galerias da rua nos temporais.',
    passos: [
      'Instale uma tela mosquiteiro fina na saída da calha para barrar folhas e insetos.',
      'Conecte um tubo de PVC a um tambor plástico atóxico de 100L a 200L com tampa rosqueável.',
      'Instale uma torneira plástica a 10cm do fundo e um cano de ' + 'ladrão' + ' no topo direcionado ao jardim.',
      'Use a água armazenada para lavar calçadas, carros e regar plantas, economizando água potável.',
    ],
    beneficioComunitario: 'Cada residência com retenção de chuva reduz até 300 litros de pico no bueiro da sua rua.',
  },
  {
    id: 'oleo-cozinha',
    titulo: 'Descarte correto de óleo de cozinha usado sem entupir a cidade',
    categoria: 'descarte',
    tempoLeitura: '3 min',
    icone: '🛢️',
    resumo: 'O óleo na pia cria blocos sólidos de gordura que rompem canos e contaminam os mananciais de Conquista.',
    passos: [
      'Espere o óleo de fritura esfriar totalmente na panela.',
      'Com um funil simples, despeje o líquido em uma garrafa PET transparente.',
      'Feche bem a garrafa e guarde em local arejado até enchê-la.',
      'Entregue nos pontos de coleta voluntária (Cooperativas de catadores ou Ecopontos municipais).',
    ],
    beneficioComunitario: '1 litro de óleo reciclado deixa de poluir 25 mil litros de água tratada.',
  },
  {
    id: 'bueiro-limpo',
    titulo: 'Guia do bueiro da sua calçada: como adotar e manter limpo',
    categoria: 'prevencao',
    tempoLeitura: '3 min',
    icone: '🛡️',
    resumo: 'Passos simples e seguros para garantir que a água da chuva escoe livremente sem inundar a vizinhança.',
    passos: [
      'Nunca varra terra, folhas secas ou restos de poda para dentro da boca de lobo.',
      'Mantenha sacos de lixo suspensos em lixeiras altas nos dias de coleta para que a chuva não os arraste.',
      'Com luvas e vassoura, recolha detritos acumulados sobre as grades antes do início da chuva.',
      'Se notar afundamento do asfalto ou grade quebrada, registre imediatamente pelo Conquista das Águas.',
    ],
    beneficioComunitario: 'Um bueiro 100% desobstruído drena até 40 litros por segundo, evitando alagamento da via.',
  },
  {
    id: 'denuncia-formal',
    titulo: 'Como usar a lei a favor do seu bairro (Direito ao Saneamento)',
    categoria: 'direitos',
    tempoLeitura: '4 min',
    icone: '⚖️',
    resumo: 'Conheça o Marco Legal do Saneamento e como protocolar pedidos oficiais que os órgãos são obrigados a responder.',
    passos: [
      'O Artigo 225 da Constituição e a Lei Federal 11.445 garantem drenagem urbana e saneamento a todo cidadão.',
      'Documente a situação com fotos nítidas e endereço preciso (rua, número e referências).',
      'Gere o ofício formal aqui no Conquista das Águas com o número de protocolo gerado.',
      'Envie para a Ouvidoria da Prefeitura (e-SIC) ou Defesa Civil com prazo legal de resposta de até 20 dias.',
    ],
    beneficioComunitario: 'Denúncias formais com fundamentação técnica e jurídica têm 4x mais taxa de atendimento rápido.',
  },
];

@Injectable({ providedIn: 'root' })
export class ObservatorioService {
  readonly trechos = signal<TrechoBacia[]>(TRECHOS_VERRUGA);
  readonly guias = signal<GuiaPratico[]>(GUIAS_PRATICOS);

  readonly indicadores = signal<IndicadoresBacia>({
    qualidadeGeral: 64,
    nascentesProtegidas: 12,
    pontosCriticosMapeados: 8,
    volumeRetidoMedioM3: '42.500 m³',
  });
}
