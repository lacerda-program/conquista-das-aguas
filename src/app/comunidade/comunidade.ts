import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaMutirao, Mutirao } from './comunidade.model';
import { ComunidadeService } from './comunidade.service';

@Component({
  selector: 'app-comunidade',
  imports: [FormsModule],
  template: `
    <div class="comunidade-pagina">
      <header class="hero-comunidade">
        <div class="hero-int">
          <div>
            <span class="badge-comunidade">Solidariedade & Cidadania Ativa</span>
            <h1>Rede Comunitária pelas Águas de Conquista</h1>
            <p>
              O cuidado com nossa cidade começa na união dos vizinhos. Participe de mutirões de desobstrução preventiva,
              recuperação de bacias e saiba onde encontrar acolhimento e doar em períodos de chuva intensa.
            </p>
          </div>
          <div class="comunidade-stats">
            <div class="stat-box">
              <strong>{{ totalVoluntarios() }}</strong>
              <span>Voluntários engajados</span>
            </div>
            <div class="stat-box">
              <strong>{{ mutiroes().length }}</strong>
              <span>Ações comunitárias</span>
            </div>
          </div>
        </div>
      </header>

      <main class="comunidade-layout">
        <!-- SEÇÃO 1: MUTIRÕES COMUNITÁRIOS -->
        <section aria-labelledby="titulo-mutiroes" class="secao-mutiroes">
          <div class="secao-header">
            <div>
              <h2 id="titulo-mutiroes">Mutirões e Ações Colaborativas</h2>
              <p class="secao-sub">Inscreva-se com um clique para ajudar seu bairro antes que a chuva chegue.</p>
            </div>
            <button type="button" class="btn btn-propor" (click)="mostrarFormPropor.set(!mostrarFormPropor())">
              {{ mostrarFormPropor() ? '✕ Cancelar Proposta' : '+ Propor Ação no Meu Bairro' }}
            </button>
          </div>

          @if (mostrarFormPropor()) {
            <form class="form-proposta" (ngSubmit)="salvarProposta()" novalidate>
              <h3>Propor Novo Mutirão Comunitário</h3>
              <div class="grid-form">
                <div>
                  <label for="titulo">Nome da Ação</label>
                  <input id="titulo" [(ngModel)]="novoTitulo" name="titulo" placeholder="Ex: Limpeza de bueiros na Rua X" required />
                </div>
                <div>
                  <label for="bairro">Bairro</label>
                  <input id="bairro" [(ngModel)]="novoBairro" name="bairro" placeholder="Ex: Bairro Brasil, Jurema, Candeias" required />
                </div>
                <div>
                  <label for="local">Local Exato / Ponto de Encontro</label>
                  <input id="local" [(ngModel)]="novoLocal" name="local" placeholder="Ex: Praça principal em frente à padaria" required />
                </div>
                <div>
                  <label for="dataHora">Data e Horário</label>
                  <input id="dataHora" [(ngModel)]="novaData" name="data" placeholder="Ex: Sábado às 08:00" required />
                </div>
                <div>
                  <label for="categoria">Categoria</label>
                  <select id="categoria" [(ngModel)]="novaCategoria" name="categoria">
                    <option value="prevencao">Prevenção / Desobstrução</option>
                    <option value="limpeza">Limpeza de Bacia / Rio</option>
                    <option value="plantio">Plantio / Contenção de Encosta</option>
                    <option value="conscientizacao">Conscientização Porta a Porta</option>
                  </select>
                </div>
                <div>
                  <label for="meta">Meta de Voluntários</label>
                  <input id="meta" type="number" [(ngModel)]="novaMeta" name="meta" min="3" max="100" />
                </div>
              </div>
              <div>
                <label for="desc">Descrição / O que levar</label>
                <textarea id="desc" rows="2" [(ngModel)]="novaDescricao" name="desc" placeholder="Ex: Levar luvas, sacos de lixo e disposição!"></textarea>
              </div>
              <div class="form-acoes">
                <button type="submit" class="btn btn-principal">Publicar no Mural Comunitário</button>
              </div>
            </form>
          }

          <div class="lista-mutiroes">
            @for (m of mutiroes(); track m.id) {
              <article class="card-mutirao" [class.inscrito]="m.jaInscrito">
                <div class="mutirao-topo">
                  <span class="tag-categoria" [attr.data-cat]="m.categoria">
                    {{ rotuloCategoria(m.categoria) }}
                  </span>
                  <span class="mutirao-data">📅 {{ m.data }} • {{ m.horario }}</span>
                </div>
                <h3>{{ m.titulo }}</h3>
                <p class="mutirao-local">
                  <strong>📍 {{ m.bairro }}:</strong> {{ m.localExato }}
                </p>
                <p class="mutirao-desc">{{ m.descricao }}</p>
                <p class="mutirao-org"><small>Organizado por: {{ m.organizador }}</small></p>

                <div class="barra-meta-voluntarios">
                  <div class="barra-info">
                    <span>Voluntários: <strong>{{ m.voluntariosConfirmados }} de {{ m.metaVoluntarios }}</strong></span>
                    <span>{{ calcularPct(m.voluntariosConfirmados, m.metaVoluntarios) }}%</span>
                  </div>
                  <div class="trilho-voluntarios">
                    <div class="nivel-voluntarios" [style.width.%]="calcularPct(m.voluntariosConfirmados, m.metaVoluntarios)"></div>
                  </div>
                </div>

                <div class="mutirao-rodape">
                  <button
                    type="button"
                    class="btn btn-inscrever"
                    [class.confirmado]="m.jaInscrito"
                    (click)="alternarInscricao(m.id)"
                  >
                    {{ m.jaInscrito ? '✓ Inscrito(a) como Voluntário(a)' : '🤝 Quero Ajudar Neste Mutirão' }}
                  </button>
                </div>
              </article>
            }
          </div>
        </section>

        <!-- SEÇÃO 2: PONTOS DE ACOLHIMENTO E ABRIGO EM TEMPORAIS -->
        <section aria-labelledby="titulo-abrigos" class="secao-abrigos">
          <div class="secao-header">
            <div>
              <h2 id="titulo-abrigos">Pontos de Acolhimento e Doações</h2>
              <p class="secao-sub">Locais de referência seguros em Vitória da Conquista durante enchentes e emergências.</p>
            </div>
            <div class="aviso-emergencia">
              <span>Plantão Defesa Civil:</span>
              <a href="tel:199"><strong>Ligue 199</strong></a>
            </div>
          </div>

          <div class="grid-abrigos">
            @for (ponto of pontosAcolhimento(); track ponto.id) {
              <div class="card-abrigo">
                <div class="abrigo-topo">
                  <span class="selo-tipo-abrigo" [attr.data-tipo]="ponto.tipo">
                    {{ rotuloTipoAbrigo(ponto.tipo) }}
                  </span>
                  <span class="status-abrigo" [class.alerta]="ponto.status === 'plantao_alerta'">
                    ● {{ ponto.status === 'plantao_alerta' ? 'Plantão de Chuva' : 'Aberto para Apoio' }}
                  </span>
                </div>
                <h3>{{ ponto.nome }}</h3>
                <p class="abrigo-endereco">📍 {{ ponto.endereco }} - {{ ponto.bairro }}</p>
                <p class="abrigo-telefone">📞 Telefone: <a [href]="'tel:' + ponto.telefone">{{ ponto.telefone }}</a></p>
                <p class="abrigo-capacidade">ℹ️ {{ ponto.capacidade }}</p>

                <div class="itens-doacao">
                  <strong>Itens prioritários para doação:</strong>
                  <ul>
                    @for (item of ponto.itensPrioritarios; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                </div>
              </div>
            }
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .comunidade-pagina {
      padding-bottom: 4rem;
    }
    .hero-comunidade {
      background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%);
      color: #fff;
      padding: 3rem 1.25rem;
    }
    .hero-int {
      max-width: 1100px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 2rem;
      align-items: center;
    }
    .badge-comunidade {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: #d8f3dc;
      color: #1b4332;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      margin-bottom: 0.6rem;
    }
    .hero-comunidade h1 {
      font-size: clamp(2rem, 4vw, 3rem);
      margin: 0;
      color: #ffffff;
    }
    .hero-comunidade p {
      max-width: 60ch;
      color: #d8f3dc;
      margin-top: 0.75rem;
      font-size: 1.05rem;
    }
    .comunidade-stats {
      display: flex;
      gap: 1.25rem;
    }
    .stat-box {
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      text-align: center;
    }
    .stat-box strong {
      display: block;
      font-size: 2.5rem;
      font-family: 'Outfit', sans-serif;
      line-height: 1;
      color: #fff;
    }
    .stat-box span {
      font-size: 0.85rem;
      color: #b7e4c7;
    }
    .comunidade-layout {
      max-width: 1100px;
      margin: 2.5rem auto 0;
      padding: 0 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }
    .secao-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    .secao-header h2 {
      margin: 0;
      font-size: 1.6rem;
      color: #1b4332;
    }
    .secao-sub {
      margin: 0.3rem 0 0;
      color: #4a5850;
      font-size: 0.95rem;
    }
    .btn-propor {
      background: #faedcd;
      color: #7f4f24;
      border: 1px solid #d4a373;
      padding: 0.6rem 1.2rem;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
    }
    .btn-propor:hover {
      background: #f4d59f;
    }
    .form-proposta {
      background: #fff;
      border: 1px solid #b7d5ca;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    }
    .form-proposta h3 {
      margin-top: 0;
      color: #1b4332;
    }
    .grid-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .grid-form label, .form-proposta label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 0.3rem;
      color: #1b4332;
    }
    .form-acoes {
      margin-top: 1rem;
      text-align: right;
    }
    .lista-mutiroes {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .card-mutirao {
      background: #ffffff;
      border: 1px solid #d8e6df;
      border-radius: 14px;
      padding: 1.4rem;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 16px -2px rgba(27, 73, 101, 0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .card-mutirao:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px -4px rgba(27, 73, 101, 0.1);
    }
    .card-mutirao.inscrito {
      border-color: #52b788;
      background: #f7fdf9;
    }
    .mutirao-topo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .tag-categoria {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.2rem 0.55rem;
      border-radius: 999px;
      background: #d8f3dc;
      color: #1b4332;
    }
    .tag-categoria[data-cat='limpeza'] { background: #caf0f8; color: #0077b6; }
    .tag-categoria[data-cat='plantio'] { background: #d8f3dc; color: #2d6a4f; }
    .tag-categoria[data-cat='prevencao'] { background: #faedcd; color: #7f4f24; }
    .mutirao-data {
      font-size: 0.8rem;
      font-weight: 600;
      color: #52796f;
    }
    .card-mutirao h3 {
      font-size: 1.15rem;
      margin: 0 0 0.5rem;
      color: #1b4332;
    }
    .mutirao-local {
      font-size: 0.9rem;
      color: #2d6a4f;
      margin: 0 0 0.5rem;
    }
    .mutirao-desc {
      font-size: 0.9rem;
      color: #4a5850;
      line-height: 1.5;
      margin: 0 0 0.75rem;
      flex-grow: 1;
    }
    .mutirao-org {
      margin: 0 0 1rem;
      color: #748cab;
    }
    .barra-meta-voluntarios {
      margin-bottom: 1.25rem;
    }
    .barra-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      margin-bottom: 0.3rem;
      color: #4a5850;
    }
    .trilho-voluntarios {
      height: 10px;
      background: #e8f3ed;
      border-radius: 5px;
      overflow: hidden;
    }
    .nivel-voluntarios {
      height: 100%;
      background: #2d6a4f;
      border-radius: 5px;
      transition: width 0.3s ease;
    }
    .btn-inscrever {
      width: 100%;
      background: #2d6a4f;
      color: #fff;
      font-weight: 700;
      border: none;
      padding: 0.75rem;
      border-radius: 10px;
      cursor: pointer;
      font-size: 0.95rem;
      transition: background 0.15s ease;
    }
    .btn-inscrever:hover {
      background: #1b4332;
    }
    .btn-inscrever.confirmado {
      background: #52b788;
    }
    .aviso-emergencia {
      background: #faedcd;
      border: 1px solid #d4a373;
      padding: 0.5rem 0.9rem;
      border-radius: 8px;
      font-size: 0.9rem;
      color: #7f4f24;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .aviso-emergencia a {
      color: #b3261e;
      text-decoration: underline;
    }
    .grid-abrigos {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .card-abrigo {
      background: #fff;
      border: 1px solid #d8e6df;
      border-radius: 14px;
      padding: 1.4rem;
      box-shadow: 0 4px 16px -2px rgba(27, 73, 101, 0.05);
    }
    .abrigo-topo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.6rem;
    }
    .selo-tipo-abrigo {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      background: #e2ece9;
      color: #1b4332;
    }
    .status-abrigo {
      font-size: 0.8rem;
      font-weight: 600;
      color: #2d6a4f;
    }
    .status-abrigo.alerta {
      color: #b3261e;
    }
    .card-abrigo h3 {
      margin: 0 0 0.5rem;
      font-size: 1.15rem;
      color: #1b4332;
    }
    .abrigo-endereco, .abrigo-telefone, .abrigo-capacidade {
      margin: 0.25rem 0;
      font-size: 0.9rem;
      color: #4a5850;
    }
    .itens-doacao {
      margin-top: 1rem;
      background: #f7f9f6;
      border: 1px solid #e1ebe6;
      border-radius: 8px;
      padding: 0.75rem 1rem;
    }
    .itens-doacao strong {
      font-size: 0.85rem;
      color: #1b4332;
      display: block;
      margin-bottom: 0.35rem;
    }
    .itens-doacao ul {
      margin: 0;
      padding-left: 1.2rem;
      font-size: 0.85rem;
      color: #4a5850;
    }
    @media (max-width: 860px) {
      .hero-int { grid-template-columns: 1fr; }
      .comunidade-stats { flex-wrap: wrap; }
    }
  `],
})
export class Comunidade {
  private readonly service = inject(ComunidadeService);

  readonly mutiroes = this.service.mutiroes;
  readonly pontosAcolhimento = this.service.pontosAcolhimento;

  readonly totalVoluntarios = computed(() =>
    this.mutiroes().reduce((soma, m) => soma + m.voluntariosConfirmados, 0),
  );

  mostrarFormPropor = signal(false);

  novoTitulo = '';
  novoBairro = '';
  novoLocal = '';
  novaData = '';
  novaCategoria: CategoriaMutirao = 'prevencao';
  novaMeta = 15;
  novaDescricao = '';

  rotuloCategoria(cat: CategoriaMutirao): string {
    switch (cat) {
      case 'limpeza': return 'Limpeza de Rio / Lagoa';
      case 'plantio': return 'Plantio de Mudas';
      case 'prevencao': return 'Prevenção de Bueiros';
      case 'conscientizacao': return 'Conscientização';
    }
  }

  rotuloTipoAbrigo(tipo: string): string {
    switch (tipo) {
      case 'abrigo': return 'Abrigo Temporário';
      case 'arrecadacao': return 'Ponto de Arrecadação';
      case 'apoio_social': return 'Apoio Comunitário';
      default: return 'Ponto de Apoio';
    }
  }

  calcularPct(atual: number, meta: number): number {
    if (meta <= 0) return 100;
    return Math.min(100, Math.round((atual / meta) * 100));
  }

  alternarInscricao(id: number): void {
    this.service.alternarInscricao(id);
  }

  salvarProposta(): void {
    if (!this.novoTitulo.trim() || !this.novoBairro.trim()) {
      return;
    }
    this.service.proporMutirao({
      titulo: this.novoTitulo.trim(),
      bairro: this.novoBairro.trim(),
      localExato: this.novoLocal.trim() || 'A definir',
      data: this.novaData.trim() || 'A definir',
      horario: 'Manhã',
      categoria: this.novaCategoria,
      metaVoluntarios: Number(this.novaMeta) || 15,
      descricao: this.novaDescricao.trim() || 'Ação voluntária proposta pela comunidade.',
      organizador: 'Cidadão Conquistense',
    });

    this.novoTitulo = '';
    this.novoBairro = '';
    this.novoLocal = '';
    this.novaData = '';
    this.novaDescricao = '';
    this.mostrarFormPropor.set(false);
  }
}
