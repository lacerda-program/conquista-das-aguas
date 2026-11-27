import { Component, computed, input, output } from '@angular/core';
import { Ocorrencia } from '../ocorrencia.model';

interface ZonaMapa {
  id: string;
  nome: string;
  apelido: string;
  regiao: 'Centro' | 'Oeste' | 'Leste' | 'Sul' | 'Norte';
  descricao: string;
  x: number; // % no grid visual
  y: number; // %
}

const ZONAS_CONQUISTA: ZonaMapa[] = [
  {
    id: 'Centro',
    nome: 'Centro',
    apelido: 'Canal do Rio Verruga / Comércio',
    regiao: 'Centro',
    descricao: 'Ponto de convergência das galerias pluviais centrais e feira.',
    x: 48,
    y: 42,
  },
  {
    id: 'Bairro Brasil',
    nome: 'Bairro Brasil',
    apelido: 'Zona Oeste / Av. Frei Benjamin',
    regiao: 'Oeste',
    descricao: 'Topografia com fluxo forte de enxurrada em direção à Lagoa.',
    x: 24,
    y: 40,
  },
  {
    id: 'Bateias',
    nome: 'Bateias',
    apelido: 'Parque da Lagoa das Bateias',
    regiao: 'Oeste',
    descricao: 'Espelho d’água receptor da bacia, ponto crítico de assoreamento.',
    x: 18,
    y: 22,
  },
  {
    id: 'Alto Maron',
    nome: 'Alto Maron',
    apelido: 'Encostas da Serra do Periperi',
    regiao: 'Norte',
    descricao: 'Área com declive acentuado e nascentes florestais do Poço Escuro.',
    x: 58,
    y: 20,
  },
  {
    id: 'Candeias',
    nome: 'Candeias',
    apelido: 'Zona Leste / Av. Olívia Flores',
    regiao: 'Leste',
    descricao: 'Região universitária e residencial com rede de drenagem em expansão.',
    x: 74,
    y: 45,
  },
  {
    id: 'Jurema',
    nome: 'Jurema',
    apelido: 'Zona Sul / Av. Bartolomeu',
    regiao: 'Sul',
    descricao: 'Bairro populoso com pontos de extravasamento e galerias antigas.',
    x: 46,
    y: 68,
  },
  {
    id: 'Patagônia',
    nome: 'Patagônia',
    apelido: 'Entorno da Rodoviária',
    regiao: 'Oeste',
    descricao: 'Área mista residencial e comercial com fluxo pluvial intenso.',
    x: 26,
    y: 60,
  },
  {
    id: 'Recreio',
    nome: 'Recreio',
    apelido: 'Praça do Gil / Raul Ferraz',
    regiao: 'Leste',
    descricao: 'Região central tradicional com pontos de abrigo e assistência.',
    x: 64,
    y: 56,
  },
];

@Component({
  selector: 'app-mapa-conquista',
  template: `
    <section class="card-mapa" aria-labelledby="mapa-titulo">
      <div class="mapa-header">
        <div>
          <span class="badge-geo">Georreferenciamento Cívico</span>
          <h3 id="mapa-titulo">Mapa de Risco Hídrico por Bairros</h3>
          <p class="mapa-sub">Clique em um bairro para filtrar as ocorrências comunitárias correspondentes.</p>
        </div>
        @if (bairroFiltro()) {
          <button type="button" class="btn-limpar-filtro" (click)="selecionarBairro.emit('')">
            ✕ Limpar filtro ({{ bairroFiltro() }})
          </button>
        }
      </div>

      <div class="mapa-container">
        <!-- SVG visual estilizado de Vitória da Conquista com o Rio Verruga atravessando -->
        <svg class="mapa-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <!-- Curso esquemático do Rio Verruga e da Bacia -->
          <path
            d="M 60 12 Q 54 28 48 42 T 36 50 Q 24 35 18 22"
            fill="none"
            stroke="#a7d7c5"
            stroke-width="3"
            stroke-linecap="round"
            stroke-dasharray="2, 2"
          />
          <text x="56" y="16" font-size="2.6" fill="#2d6a4f" font-weight="bold">Nascente Poço Escuro</text>
          <text x="14" y="18" font-size="2.6" fill="#2d6a4f" font-weight="bold">Lagoa das Bateias</text>
          <text x="38" y="38" font-size="2.4" fill="#52796f" font-style="italic">Bacia do Rio Verruga</text>
        </svg>

        <div class="pin-grid">
          @for (zona of zonasComDados(); track zona.id) {
            <button
              type="button"
              class="pin-bairro"
              [class.ativo]="bairroFiltro() === zona.id"
              [class.com-risco-alto]="zona.temAlta"
              [style.left.%]="zona.x"
              [style.top.%]="zona.y"
              (click)="alternarBairro(zona.id)"
              [attr.aria-pressed]="bairroFiltro() === zona.id"
            >
              <div class="pin-ponto">
                <span class="pin-pulso" [class.ativo]="zona.abertas > 0"></span>
                <span class="pin-numero">{{ zona.abertas }}</span>
              </div>
              <div class="pin-rotulo">
                <strong>{{ zona.nome }}</strong>
                <small>{{ zona.abertas === 1 ? '1 problema' : zona.abertas + ' problemas' }}</small>
              </div>
            </button>
          }
        </div>
      </div>

      <div class="mapa-legenda">
        <div class="legenda-item">
          <span class="legenda-cor cor-alta"></span>
          <span>Gravidade Alta / Alagamento</span>
        </div>
        <div class="legenda-item">
          <span class="legenda-cor cor-media"></span>
          <span>Gravidade Média / Bueiro</span>
        </div>
        <div class="legenda-item">
          <span class="legenda-cor cor-baixa"></span>
          <span>Sem risco iminente</span>
        </div>
        <div class="legenda-item">
          <span class="legenda-linha"></span>
          <span>Leito do Rio Verruga</span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .card-mapa {
      background: #ffffff;
      border: 1px solid #d8e5df;
      border-radius: 14px;
      padding: 1.25rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px -2px rgba(27, 73, 101, 0.05);
    }
    .mapa-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .badge-geo {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      background: #eaf5f0;
      color: #2d6a4f;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
    }
    .card-mapa h3 {
      margin: 0.3rem 0 0.15rem;
      color: #1b4332;
      font-size: 1.25rem;
    }
    .mapa-sub {
      margin: 0;
      font-size: 0.88rem;
      color: #4a5850;
    }
    .btn-limpar-filtro {
      background: #faedcd;
      border: 1px solid #d4a373;
      color: #7f4f24;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      cursor: pointer;
    }
    .btn-limpar-filtro:hover {
      background: #f4d59f;
    }
    .mapa-container {
      position: relative;
      height: 310px;
      background: linear-gradient(135deg, #f4faf6 0%, #ebf5f0 100%);
      border-radius: 12px;
      border: 1px solid #d8e6df;
      overflow: hidden;
    }
    .mapa-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .pin-grid {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .pin-bairro {
      position: absolute;
      transform: translate(-50%, -50%);
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0;
      z-index: 5;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .pin-bairro:hover {
      transform: translate(-50%, -50%) scale(1.08);
      z-index: 10;
    }
    .pin-ponto {
      position: relative;
      width: 32px;
      height: 32px;
      background: #2d6a4f;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      border: 2px solid #fff;
      transition: background 0.2s ease;
    }
    .pin-bairro.com-risco-alto .pin-ponto {
      background: #c93b2b;
    }
    .pin-bairro.ativo .pin-ponto {
      background: #bc6c25;
      outline: 3px solid #dda15e;
      outline-offset: 2px;
    }
    .pin-pulso {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: rgba(201, 59, 43, 0.4);
      opacity: 0;
      pointer-events: none;
    }
    .pin-bairro.com-risco-alto .pin-pulso.ativo {
      animation: pulso 2s infinite ease-out;
      opacity: 1;
    }
    @keyframes pulso {
      0% { transform: scale(0.9); opacity: 0.8; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    .pin-rotulo {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(4px);
      border: 1px solid #cadcd4;
      border-radius: 6px;
      padding: 0.15rem 0.5rem;
      margin-top: 0.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      white-space: nowrap;
    }
    .pin-rotulo strong {
      font-size: 0.76rem;
      color: #1b4332;
    }
    .pin-rotulo small {
      font-size: 0.65rem;
      color: #52796f;
    }
    .mapa-legenda {
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
      margin-top: 0.9rem;
      padding-top: 0.75rem;
      border-top: 1px solid #e8f0ec;
      font-size: 0.78rem;
      color: #4a5850;
    }
    .legenda-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .legenda-cor {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .cor-alta { background: #c93b2b; }
    .cor-media { background: #d97706; }
    .cor-baixa { background: #2d6a4f; }
    .legenda-linha {
      width: 16px;
      height: 3px;
      background: #a7d7c5;
      border-radius: 2px;
    }
    @media (max-width: 600px) {
      .mapa-container {
        height: 280px;
      }
      .pin-rotulo {
        display: none;
      }
    }
  `],
})
export class MapaConquista {
  ocorrencias = input.required<readonly Ocorrencia[]>();
  bairroFiltro = input<string>('');
  selecionarBairro = output<string>();

  readonly zonasComDados = computed(() => {
    const abertas = this.ocorrencias().filter((o) => !o.resolvida);
    return ZONAS_CONQUISTA.map((zona) => {
      const ocDaZona = abertas.filter((o) =>
        o.bairro.toLowerCase().includes(zona.nome.toLowerCase()),
      );
      const temAlta = ocDaZona.some((o) => o.gravidade === 'alta');
      return {
        ...zona,
        abertas: ocDaZona.length,
        temAlta,
      };
    });
  });

  alternarBairro(id: string): void {
    if (this.bairroFiltro() === id) {
      this.selecionarBairro.emit('');
    } else {
      this.selecionarBairro.emit(id);
    }
  }
}
