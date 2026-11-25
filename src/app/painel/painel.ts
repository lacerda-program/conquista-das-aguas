import { Component, computed, inject } from '@angular/core';
import { OcorrenciaService } from '../ocorrencia.service';

const PESO = { baixa: 1, media: 2, alta: 3 };
const META_SEMANAL = 5;
const SEMANA_MS = 7 * 24 * 60 * 60 * 1000;

const DICAS = [
  'Nunca atravesse uma rua alagada, a pé ou de carro. Pouca água já é capaz de arrastar um veículo.',
  'Não jogue lixo em bueiros, galerias e canais. Eles entopem e provocam alagamentos.',
  'Em emergência durante a chuva, ligue para a Defesa Civil (199) ou para os Bombeiros (193).',
  'Esgoto a céu aberto contamina rios como o Verruga. Registre e cobre o poder público.',
  'Evite queimadas perto de nascentes e áreas de reserva. O solo exposto assoreia os rios.',
];

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
        <div class="barra-trilho"><div class="barra-nivel meta-nivel" [style.width.%]="pctMeta()"></div></div>
        <p class="nota">
          {{ naSemana() >= meta ? 'Meta da semana batida. Bom trabalho!' : 'Marque ocorrências como resolvidas para avançar.' }}
        </p>
      </div>

      <h2>Locais por nível de risco</h2>
      @for (r of ranking(); track r.local) {
        <div class="barra-linha">
          <div class="barra-info"><span>{{ r.local }}</span><strong>{{ r.pontos }} pontos</strong></div>
          <div class="barra-trilho"><div class="barra-nivel" [style.width.%]="r.pct"></div></div>
        </div>
      } @empty {
        <p class="vazio">Nenhuma ocorrência aberta no momento.</p>
      }
      <p class="nota">Cada ocorrência aberta soma 1 ponto (baixa), 2 (média) ou 3 (alta) ao local.</p>

      <h2>Dica do dia</h2>
      <p class="dica">{{ dica }}</p>
    </div>`,
})
export class Painel {
  private service = inject(OcorrenciaService);

  abertas = computed(() => this.service.ocorrencias().filter(o => !o.resolvida));
  resolvidas = computed(() => this.service.ocorrencias().filter(o => o.resolvida).length);
  total = computed(() => this.service.ocorrencias().length);

  meta = META_SEMANAL;
  naSemana = computed(() =>
    this.service.ocorrencias().filter(o =>
      o.resolvida && o.resolvidaEm && Date.now() - Date.parse(o.resolvidaEm) < SEMANA_MS).length);
  pctMeta = computed(() => Math.min(100, (this.naSemana() / META_SEMANAL) * 100));

  ranking = computed(() => {
    const soma = new Map<string, number>();
    for (const o of this.abertas()) {
      soma.set(o.bairro, (soma.get(o.bairro) ?? 0) + PESO[o.gravidade]);
    }
    const lista = [...soma]
      .map(([local, pontos]) => ({ local, pontos }))
      .sort((a, b) => b.pontos - a.pontos);
    const maior = lista[0]?.pontos ?? 1;
    return lista.map(r => ({ ...r, pct: (r.pontos / maior) * 100 }));
  });

  dica = DICAS[Math.floor(Date.now() / 86400000) % DICAS.length];
}
