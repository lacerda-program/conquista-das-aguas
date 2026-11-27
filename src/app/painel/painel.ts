import { Component, computed, inject } from '@angular/core';
import {
  contarResolvidasNaSemana,
  dicaDoDia,
  META_SEMANAL,
  percentualMeta,
  rankingPorLocal,
} from '../ocorrencia.domain';
import { OcorrenciaService } from '../ocorrencia.service';

const DICAS = [
  'Nunca atravesse uma rua alagada, a pé ou de carro. Pouca água já é capaz de arrastar um veículo.',
  'Não jogue lixo em bueiros, galerias e canais. Eles entopem e provocam alagamentos.',
  'Em emergência durante a chuva, ligue para a Defesa Civil (199) ou para os Bombeiros (193).',
  'Esgoto a céu aberto contamina rios como o Verruga. Registre e cobre o poder público.',
  'Evite queimadas perto de nascentes e áreas de reserva. O solo exposto assoreia os rios.',
] as const;

@Component({
  selector: 'app-painel',
  template: `
    <section class="hero">
      <div class="hero-int">
        <div>
          <h1>Onde o risco é maior agora.</h1>
          <p>Os locais com mais ocorrências abertas e mais graves aparecem primeiro.</p>
        </div>
      </div>
    </section>

    <div class="pagina">
      <div class="resumo">
        <div><strong>{{ abertas().length }}</strong><span>abertas</span></div>
        <div><strong>{{ resolvidas() }}</strong><span>resolvidas</span></div>
        <div><strong>{{ total() }}</strong><span>no total</span></div>
      </div>

      <h2>Meta da semana</h2>
      <div class="meta">
        <div class="barra-info">
          <span>Resolver {{ meta }} ocorrências em 7 dias</span>
          <strong>{{ naSemana() }} de {{ meta }}</strong>
        </div>
        <div
          class="barra-trilho"
          role="progressbar"
          [attr.aria-valuenow]="naSemana()"
          aria-valuemin="0"
          [attr.aria-valuemax]="meta"
          [attr.aria-label]="'Progresso da meta semanal: ' + naSemana() + ' de ' + meta"
        >
          <div class="barra-nivel meta-nivel" [style.width.%]="pctMeta()"></div>
        </div>
        <p class="nota">
          {{ naSemana() >= meta ? 'Meta da semana batida. Bom trabalho!' : 'Marque ocorrências como resolvidas para avançar.' }}
        </p>
      </div>

      <h2>Locais por nível de risco</h2>
      <ul class="ranking">
        @for (r of ranking(); track r.local) {
          <li class="barra-linha">
            <div class="barra-info">
              <span>{{ r.local }}</span>
              <strong>{{ r.pontos }} pontos</strong>
            </div>
            <div
              class="barra-trilho"
              role="progressbar"
              [attr.aria-valuenow]="r.pontos"
              aria-valuemin="0"
              [attr.aria-valuemax]="maiorPontos()"
              [attr.aria-label]="'Risco em ' + r.local + ': ' + r.pontos + ' pontos'"
            >
              <div class="barra-nivel" [style.width.%]="r.pct"></div>
            </div>
          </li>
        } @empty {
          <li class="vazio" role="status">Nenhuma ocorrência aberta no momento.</li>
        }
      </ul>
      <p class="nota">Cada ocorrência aberta soma 1 ponto (baixa), 2 (média) ou 3 (alta) ao local.</p>

      <h2>Dica do dia</h2>
      <p class="dica">{{ dica }}</p>
    </div>
  `,
})
export class Painel {
  private readonly service = inject(OcorrenciaService);

  readonly meta = META_SEMANAL;
  readonly abertas = computed(() => this.service.ocorrencias().filter((o) => !o.resolvida));
  readonly resolvidas = computed(() => this.service.ocorrencias().filter((o) => o.resolvida).length);
  readonly total = computed(() => this.service.ocorrencias().length);
  readonly naSemana = computed(() => contarResolvidasNaSemana(this.service.ocorrencias()));
  readonly pctMeta = computed(() => percentualMeta(this.naSemana(), META_SEMANAL));
  readonly ranking = computed(() => rankingPorLocal(this.abertas()));
  readonly maiorPontos = computed(() => this.ranking()[0]?.pontos ?? 0);
  readonly dica = dicaDoDia(DICAS, Date.now());
}
