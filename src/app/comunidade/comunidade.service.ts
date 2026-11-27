import { Injectable, signal } from '@angular/core';
import { Mutirao, PontoAcolhimento } from './comunidade.model';

const CHAVE_MUTIROES = 'conquista-das-aguas:mutiroes';

const MUTIROES_INICIAIS: Mutirao[] = [
  {
    id: 1,
    titulo: 'Desobstrução Preventiva de Galerias e Bueiros',
    bairro: 'Bairro Brasil',
    localExato: 'Av. Frei Benjamin cruzamento com Av. Alagoas',
    data: 'Sábado próximo',
    horario: '08:00 às 11:30',
    categoria: 'prevencao',
    descricao:
      'Ação comunitária com apoio de moradores para retirada de lixo e galhos das grades pluviais antes das chuvas de verão, evitando transbordamento.',
    voluntariosConfirmados: 14,
    metaVoluntarios: 20,
    organizador: 'Associação Comunitária da Zona Oeste',
  },
  {
    id: 2,
    titulo: 'Preservação das Margens da Lagoa das Bateias',
    bairro: 'Bateias',
    localExato: 'Parque da Lagoa das Bateias - Pista de caminhada',
    data: 'Domingo',
    horario: '07:30 às 11:00',
    categoria: 'limpeza',
    descricao:
      'Coleta de resíduos plásticos e pneus descartados nas margens da bacia que deságua no Rio Verruga, protegendo a fauna e o espelho d’água.',
    voluntariosConfirmados: 28,
    metaVoluntarios: 35,
    organizador: 'Coletivo Amigos das Bateias',
  },
  {
    id: 3,
    titulo: 'Plantio de Mudas Nativas e Contenção de Encosta',
    bairro: 'Alto Maron',
    localExato: 'Acesso à Reserva do Poço Escuro / Serra do Periperi',
    data: '12 de Dezembro',
    horario: '08:30 às 12:00',
    categoria: 'plantio',
    descricao:
      'Reflorestamento de áreas de recarga hídrica e estabilização de taludes para prevenir desmoronamentos de terra durante tempestades.',
    voluntariosConfirmados: 19,
    metaVoluntarios: 25,
    organizador: 'Guardiões do Poço Escuro & Estudantes UESB/UFBA',
  },
];

const PONTOS_ACOLHIMENTO_INICIAIS: PontoAcolhimento[] = [
  {
    id: 101,
    nome: 'Ginásio de Esportes Raul Ferraz',
    bairro: 'Recreio / Centro',
    endereco: 'Rua São Pedro, s/n',
    telefone: '(77) 3424-8500',
    tipo: 'abrigo',
    status: 'plantao_alerta',
    capacidade: 'Até 120 famílias em situações de enchente',
    itensPrioritarios: ['Colchões', 'Água mineral', 'Cobertores e agasalhos', 'Kits de higiene pessoal'],
  },
  {
    id: 102,
    nome: 'Centro Social Urbano (CSU) - Ponto de Arrecadação',
    bairro: 'Brasil',
    endereco: 'Av. Brumado, 1020',
    telefone: '(77) 3422-4112',
    tipo: 'arrecadacao',
    status: 'aberto',
    capacidade: 'Central logística comunitária',
    itensPrioritarios: ['Alimentos não perecíveis', 'Fraldas descartáveis', 'Água sanitária e desinfetante'],
  },
  {
    id: 103,
    nome: 'Paróquia Nossa Senhora das Graças',
    bairro: 'Recreio',
    endereco: 'Praça Gerson Sales',
    telefone: '(77) 3421-2280',
    tipo: 'apoio_social',
    status: 'aberto',
    capacidade: 'Refeitório comunitário e triagem de auxílio',
    itensPrioritarios: ['Roupas de cama', 'Calçados', 'Alimentos para marmitas solidárias'],
  },
];

@Injectable({ providedIn: 'root' })
export class ComunidadeService {
  private readonly mutiroesSignal = signal<Mutirao[]>(this.carregarMutiroes());
  readonly mutiroes = this.mutiroesSignal.asReadonly();
  readonly pontosAcolhimento = signal<PontoAcolhimento[]>(PONTOS_ACOLHIMENTO_INICIAIS);

  alternarInscricao(id: number): void {
    this.mutiroesSignal.update((lista) =>
      lista.map((m) => {
        if (m.id === id) {
          const jaInscrito = !m.jaInscrito;
          const voluntariosConfirmados = jaInscrito
            ? m.voluntariosConfirmados + 1
            : Math.max(0, m.voluntariosConfirmados - 1);
          return { ...m, jaInscrito, voluntariosConfirmados };
        }
        return m;
      }),
    );
    this.salvarMutiroes();
  }

  proporMutirao(dados: Omit<Mutirao, 'id' | 'voluntariosConfirmados' | 'jaInscrito'>): void {
    const novo: Mutirao = {
      ...dados,
      id: Date.now(),
      voluntariosConfirmados: 1,
      jaInscrito: true,
    };
    this.mutiroesSignal.update((lista) => [novo, ...lista]);
    this.salvarMutiroes();
  }

  private carregarMutiroes(): Mutirao[] {
    try {
      const salvo = localStorage.getItem(CHAVE_MUTIROES);
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignora erro e usa dados padrão
    }
    return MUTIROES_INICIAIS;
  }

  private salvarMutiroes(): void {
    try {
      localStorage.setItem(CHAVE_MUTIROES, JSON.stringify(this.mutiroesSignal()));
    } catch {
      // Silencia erro de quota
    }
  }
}
