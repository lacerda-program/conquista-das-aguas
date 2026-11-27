import { Injectable, signal } from '@angular/core';
import { Gravidade, isOcorrencia, Ocorrencia } from './ocorrencia.model';

const CHAVE = 'conquista-das-aguas:ocorrencias';

const OCORRENCIAS_SEMENTE: Ocorrencia[] = [
  {
    id: 1,
    protocolo: 'VDC-2026-1042',
    tipo: 'Alagamento',
    bairro: 'Centro',
    descricao:
      'Canal do Rio Verruga transbordando próximo à Av. Bartolomeu de Gusmão. Água invadindo calçadas comerciais.',
    gravidade: 'alta',
    resolvida: false,
    data: '26/11/2026',
  },
  {
    id: 2,
    protocolo: 'VDC-2026-1043',
    tipo: 'Bueiro entupido',
    bairro: 'Bairro Brasil',
    descricao:
      'Boca de lobo na Av. Frei Benjamin totalmente obstruída com lixo e entulho, gerando enxurrada na calçada.',
    gravidade: 'media',
    resolvida: false,
    data: '27/11/2026',
  },
  {
    id: 3,
    protocolo: 'VDC-2026-1044',
    tipo: 'Esgoto a céu aberto',
    bairro: 'Jurema',
    descricao:
      'Vazamento de esgoto sanitário em frente à escola municipal com forte odor e risco à saúde pública.',
    gravidade: 'alta',
    resolvida: false,
    data: '25/11/2026',
  },
  {
    id: 4,
    protocolo: 'VDC-2026-1045',
    tipo: 'Descarte irregular',
    bairro: 'Bateias',
    descricao:
      'Descarte de entulho e sacos plásticos na orla da Lagoa das Bateias, ameaçando a drenagem da bacia.',
    gravidade: 'media',
    resolvida: false,
    data: '24/11/2026',
  },
  {
    id: 5,
    protocolo: 'VDC-2026-1039',
    tipo: 'Vazamento na rede de água',
    bairro: 'Candeias',
    descricao:
      'Adutora rompida com escoamento contínuo de água tratada pela rua. Notificado à concessionária.',
    gravidade: 'baixa',
    resolvida: true,
    resolvidaEm: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    data: '22/11/2026',
  },
];

@Injectable({ providedIn: 'root' })
export class OcorrenciaService {
  private readonly lista = signal<Ocorrencia[]>(this.carregar());
  readonly ocorrencias = this.lista.asReadonly();
  readonly persistenciaErro = signal(false);

  adicionar(tipo: string, bairro: string, descricao: string, gravidade: Gravidade): void {
    const id = Date.now();
    const protocolo = `VDC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nova: Ocorrencia = {
      id,
      protocolo,
      tipo,
      bairro,
      descricao,
      gravidade,
      resolvida: false,
      data: new Date().toLocaleDateString('pt-BR'),
    };
    this.lista.update((atual) => [nova, ...atual]);
    this.salvar();
  }

  concluir(id: number): void {
    this.lista.update((atual) =>
      atual.map((ocorrencia) =>
        ocorrencia.id === id
          ? {
              ...ocorrencia,
              resolvida: !ocorrencia.resolvida,
              resolvidaEm: ocorrencia.resolvida ? undefined : new Date().toISOString(),
            }
          : ocorrencia,
      ),
    );
    this.salvar();
  }

  remover(id: number): void {
    this.lista.update((atual) => atual.filter((ocorrencia) => ocorrencia.id !== id));
    this.salvar();
  }

  private salvar(): void {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(this.lista()));
      this.persistenciaErro.set(false);
    } catch {
      this.persistenciaErro.set(true);
    }
  }

  private carregar(): Ocorrencia[] {
    try {
      const texto = localStorage.getItem(CHAVE);
      if (!texto) {
        return OCORRENCIAS_SEMENTE;
      }
      const dados: unknown = JSON.parse(texto);
      if (!Array.isArray(dados) || dados.length === 0) {
        return OCORRENCIAS_SEMENTE;
      }
      const filtrados = dados.filter(isOcorrencia);
      return filtrados.length > 0 ? filtrados : OCORRENCIAS_SEMENTE;
    } catch {
      return OCORRENCIAS_SEMENTE;
    }
  }
}
