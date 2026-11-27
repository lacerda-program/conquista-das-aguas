import { Component, inject } from '@angular/core';
import { ObservatorioService } from './observatorio.service';

@Component({
  selector: 'app-observatorio',
  template: `
    <div class="observatorio-pagina">
      <header class="hero-observatorio">
        <div class="hero-int">
          <div>
            <span class="badge-eco">Bacia Hidrográfica de Vitória da Conquista</span>
            <h1>Observatório do Rio Verruga</h1>
            <p>
              O Rio Verruga nasce no coração verde da Serra do Periperi (Poço Escuro), cruza o centro urbano e deságua
              na Bacia do Rio Pardo. Conheça a saúde dos seus trechos e aprenda práticas simples para proteger nossas águas.
            </p>
          </div>
          <div class="termo-bacia">
            <div class="circulo-indice">
              <strong>{{ indicadores().qualidadeGeral }}%</strong>
              <span>Índice Geral de Saúde</span>
            </div>
          </div>
        </div>
      </header>

      <main class="observatorio-layout">
        <!-- MÉTRICAS GERAIS -->
        <section class="grid-metricas" aria-label="Indicadores da bacia">
          <div class="card-metrica">
            <span class="metrica-icone" aria-hidden="true">🌱</span>
            <div>
              <strong>{{ indicadores().nascentesProtegidas }}</strong>
              <span>Nascentes mapeadas no Poço Escuro</span>
            </div>
          </div>
          <div class="card-metrica">
            <span class="metrica-icone" aria-hidden="true">⚠️</span>
            <div>
              <strong>{{ indicadores().pontosCriticosMapeados }}</strong>
              <span>Pontos críticos de assoreamento</span>
            </div>
          </div>
          <div class="card-metrica">
            <span class="metrica-icone" aria-hidden="true">🌧️</span>
            <div>
              <strong>{{ indicadores().volumeRetidoMedioM3 }}</strong>
              <span>Volume pluvial escoado por tempestade</span>
            </div>
          </div>
        </section>

        <!-- TRECHOS DO RIO VERRUGA -->
        <section aria-labelledby="titulo-trechos" class="secao-trechos">
          <div class="secao-header">
            <div>
              <h2 id="titulo-trechos">Trechos Monitorados da Bacia</h2>
              <p class="secao-sub">Do Poço Escuro à Lagoa das Bateias: diagnósticos, vulnerabilidades e ações em curso.</p>
            </div>
          </div>

          <div class="lista-trechos">
            @for (t of trechos(); track t.id) {
              <article class="card-trecho" [attr.data-condicao]="t.condicao">
                <div class="trecho-topo">
                  <div>
                    <span class="selo-condicao" [attr.data-condicao]="t.condicao">
                      {{ rotuloCondicao(t.condicao) }}
                    </span>
                    <h3>{{ t.nome }}</h3>
                    <p class="trecho-sub">{{ t.subtitulo }} (Extensão: {{ t.extensaoKm }} km)</p>
                  </div>
                  <div class="trecho-score">
                    <span class="score-valor">{{ t.indicadorQualidade }}</span>
                    <small>/ 100 pontos</small>
                  </div>
                </div>

                <p class="trecho-desc">{{ t.descricao }}</p>

                <div class="trecho-detalhes">
                  <div class="bloco-vulnerabilidades">
                    <strong>⚠️ Principais Ameaças:</strong>
                    <ul>
                      @for (v of t.vulnerabilidades; track v) {
                        <li>{{ v }}</li>
                      }
                    </ul>
                  </div>
                  <div class="bloco-acoes">
                    <strong>🤝 Ações da Cidade e Comunidade:</strong>
                    <ul>
                      @for (a of t.acoesEmAndamento; track a) {
                        <li>{{ a }}</li>
                      }
                    </ul>
                  </div>
                </div>
              </article>
            }
          </div>
        </section>

        <!-- GUIAS PRÁTICOS DE EDUCAÇÃO AMBIENTAL -->
        <section aria-labelledby="titulo-guias" class="secao-guias">
          <div class="secao-header">
            <div>
              <h2 id="titulo-guias">Guia Cidadão de Boas Práticas Hídricas</h2>
              <p class="secao-sub">Soluções diretas que qualquer morador de Conquista pode aplicar na sua casa ou rua.</p>
            </div>
          </div>

          <div class="grid-guias">
            @for (guia of guias(); track guia.id) {
              <article class="card-guia">
                <div class="guia-topo">
                  <span class="guia-icone" aria-hidden="true">{{ guia.icone }}</span>
                  <span class="guia-tempo">⏱️ {{ guia.tempoLeitura }} de leitura</span>
                </div>
                <h3>{{ guia.titulo }}</h3>
                <p class="guia-resumo">{{ guia.resumo }}</p>

                <div class="guia-passos">
                  <strong>Como fazer passo a passo:</strong>
                  <ol>
                    @for (passo of guia.passos; track passo) {
                      <li>{{ passo }}</li>
                    }
                  </ol>
                </div>

                <div class="guia-beneficio">
                  <strong>💡 Impacto Coletivo:</strong>
                  <span>{{ guia.beneficioComunitario }}</span>
                </div>
              </article>
            }
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .observatorio-pagina {
      padding-bottom: 4rem;
    }
    .hero-observatorio {
      background: linear-gradient(135deg, #0b3954 0%, #1b4965 50%, #2d6a4f 100%);
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
    .badge-eco {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: #bee9e8;
      color: #0b3954;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      margin-bottom: 0.6rem;
    }
    .hero-observatorio h1 {
      font-size: clamp(2rem, 4vw, 3rem);
      margin: 0;
      color: #ffffff;
    }
    .hero-observatorio p {
      max-width: 60ch;
      color: #d8f3dc;
      margin-top: 0.75rem;
      font-size: 1.05rem;
    }
    .circulo-indice {
      width: 140px;
      height: 140px;
      background: rgba(255, 255, 255, 0.12);
      border: 3px solid #62b6cb;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0.5rem;
      backdrop-filter: blur(8px);
    }
    .circulo-indice strong {
      font-size: 2.5rem;
      font-family: 'Outfit', sans-serif;
      line-height: 1;
      color: #fff;
    }
    .circulo-indice span {
      font-size: 0.75rem;
      color: #bee9e8;
      margin-top: 0.2rem;
    }
    .observatorio-layout {
      max-width: 1100px;
      margin: 2.5rem auto 0;
      padding: 0 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }
    .grid-metricas {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .card-metrica {
      background: #fff;
      border: 1px solid #d8e6df;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 16px -2px rgba(27, 73, 101, 0.05);
    }
    .metrica-icone {
      font-size: 2.2rem;
    }
    .card-metrica strong {
      display: block;
      font-size: 1.6rem;
      font-family: 'Outfit', sans-serif;
      color: #1b4332;
      line-height: 1.1;
    }
    .card-metrica span {
      font-size: 0.85rem;
      color: #4a5850;
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
    .lista-trechos {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 1.5rem;
    }
    .card-trecho {
      background: #fff;
      border: 1px solid #d8e6df;
      border-left: 6px solid #2d6a4f;
      border-radius: 14px;
      padding: 1.5rem;
      box-shadow: 0 4px 16px -2px rgba(27, 73, 101, 0.05);
    }
    .card-trecho[data-condicao='atencao'] {
      border-left-color: #d97706;
    }
    .card-trecho[data-condicao='critico'] {
      border-left-color: #c93b2b;
    }
    .trecho-topo {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }
    .selo-condicao {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      background: #d8f3dc;
      color: #1b4332;
      display: inline-block;
      margin-bottom: 0.4rem;
    }
    .selo-condicao[data-condicao='atencao'] {
      background: #fef3c7;
      color: #92400e;
    }
    .selo-condicao[data-condicao='critico'] {
      background: #fee2e2;
      color: #991b1b;
    }
    .card-trecho h3 {
      font-size: 1.25rem;
      margin: 0;
      color: #1b4332;
    }
    .trecho-sub {
      margin: 0.2rem 0 0;
      font-size: 0.85rem;
      color: #52796f;
      font-weight: 500;
    }
    .trecho-score {
      text-align: right;
    }
    .score-valor {
      display: block;
      font-size: 2rem;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      color: #1b4332;
      line-height: 1;
    }
    .trecho-score small {
      font-size: 0.75rem;
      color: #748cab;
    }
    .trecho-desc {
      font-size: 0.95rem;
      color: #2b3a32;
      line-height: 1.6;
      margin: 0.5rem 0 1.25rem;
    }
    .trecho-detalhes {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      background: #f8faf8;
      border: 1px solid #e2ece9;
      border-radius: 10px;
      padding: 1rem 1.25rem;
    }
    .trecho-detalhes strong {
      font-size: 0.88rem;
      color: #1b4332;
      display: block;
      margin-bottom: 0.4rem;
    }
    .trecho-detalhes ul {
      margin: 0;
      padding-left: 1.2rem;
      font-size: 0.88rem;
      color: #4a5850;
      line-height: 1.5;
    }
    .grid-guias {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }
    .card-guia {
      background: #fff;
      border: 1px solid #d8e6df;
      border-radius: 14px;
      padding: 1.4rem;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 16px -2px rgba(27, 73, 101, 0.05);
    }
    .guia-topo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .guia-icone {
      font-size: 1.7rem;
    }
    .guia-tempo {
      font-size: 0.78rem;
      font-weight: 600;
      color: #52796f;
    }
    .card-guia h3 {
      font-size: 1.15rem;
      margin: 0 0 0.5rem;
      color: #1b4332;
      line-height: 1.3;
    }
    .guia-resumo {
      font-size: 0.88rem;
      color: #4a5850;
      line-height: 1.5;
      margin: 0 0 1rem;
      flex-grow: 1;
    }
    .guia-passos {
      background: #f7f9f6;
      border: 1px solid #e1ebe6;
      border-radius: 8px;
      padding: 0.85rem 1rem;
      margin-bottom: 1rem;
    }
    .guia-passos strong {
      font-size: 0.85rem;
      color: #1b4332;
      display: block;
      margin-bottom: 0.4rem;
    }
    .guia-passos ol {
      margin: 0;
      padding-left: 1.2rem;
      font-size: 0.85rem;
      color: #4a5850;
      line-height: 1.5;
    }
    .guia-beneficio {
      background: #faedcd;
      border: 1px solid #d4a373;
      border-radius: 8px;
      padding: 0.7rem 0.9rem;
      font-size: 0.85rem;
      color: #7f4f24;
    }
    .guia-beneficio strong {
      display: block;
      margin-bottom: 0.15rem;
    }
    @media (max-width: 860px) {
      .hero-int { grid-template-columns: 1fr; }
    }
  `],
})
export class Observatorio {
  private readonly service = inject(ObservatorioService);

  readonly trechos = this.service.trechos;
  readonly guias = this.service.guias;
  readonly indicadores = this.service.indicadores;

  rotuloCondicao(c: string): string {
    switch (c) {
      case 'preservado': return 'Preservado / Boa Saúde';
      case 'atencao': return 'Atenção / Vulnerável';
      case 'critico': return 'Crítico / Intervenção Urgente';
      default: return c;
    }
  }
}
