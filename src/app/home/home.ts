import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { CardOcorrencia } from '../card-ocorrencia/card-ocorrencia';
import { MapaConquista } from '../mapa-conquista/mapa-conquista';
import {
  BAIRROS_CONQUISTA,
  FiltroOcorrencia,
  GRAVIDADES,
  Gravidade,
  Ocorrencia,
  TIPOS_OCORRENCIA,
  TipoOcorrencia,
} from '../ocorrencia.model';
import { OcorrenciaService } from '../ocorrencia.service';
import { OficioModal } from '../oficio-modal/oficio-modal';

const requiredTrimmed: ValidatorFn = (control) => {
  const value = control.value;
  if (typeof value !== 'string' || value.trim().length === 0) {
    return { required: true };
  }
  return null;
};

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, CardOcorrencia, MapaConquista, OficioModal],
  template: `
    <!-- BANNER DE ALERTA METEOROLÓGICO PREVENTIVO -->
    <div class="faixa-alerta-clima" role="region" aria-label="Alerta preventivo da cidade">
      <div class="faixa-int">
        <span class="pulso-alerta" aria-hidden="true">⚠️</span>
        <div class="faixa-texto">
          <strong>Aviso Preventivo de Chuva (Vitória da Conquista):</strong>
          <span>Atenção para acúmulo de água no canal da Av. Bartolomeu de Gusmão e trechos baixos da Av. Frei Benjamin.</span>
        </div>
        <a class="btn-defesa" href="tel:199">Defesa Civil: 199</a>
      </div>
    </div>

    <!-- HERO SECTION -->
    <section class="hero">
      <div class="hero-int">
        <div>
          <span class="badge-hero">Voz Comunitária & Controle Social</span>
          <h1>Mostre onde a água e o saneamento falham na cidade.</h1>
          <p>
            Galerias pluviais entupidas, esgoto a céu aberto e descarte nas margens do Rio Verruga afetam a saúde de todos.
            Aqui você registra o problema, acompanha em tempo real e <strong>gera ofícios formais com respaldo na lei</strong>
            para cobrar a Prefeitura, Embasa e Defesa Civil.
          </p>
        </div>
        <div class="contador" aria-live="polite">
          <strong>{{ abertas() }}</strong>
          <span>{{ abertas() === 1 ? 'ocorrência ativa' : 'ocorrências ativas' }}</span>
        </div>
      </div>
    </section>

    <div class="layout">
      <aside>
        <!-- FORMULÁRIO DE NOVA OCORRÊNCIA -->
        <form class="painel-form" [formGroup]="form" (ngSubmit)="adicionar()" novalidate>
          <div class="form-header">
            <span class="badge-form">Registro Cidadão</span>
            <h2>Nova ocorrência</h2>
            <p class="form-sub">Gera protocolo oficial para cobrança aos órgãos públicos.</p>
          </div>

          <label for="tipo">Tipo de problema</label>
          <select id="tipo" formControlName="tipo">
            @for (opcao of tipos; track opcao) {
              <option [value]="opcao">{{ opcao }}</option>
            }
          </select>

          <label for="bairro">Bairro ou rua em Vitória da Conquista</label>
          <input
            id="bairro"
            formControlName="bairro"
            list="lista-bairros"
            placeholder="Ex.: Centro, Jurema, Bairro Brasil..."
            [attr.aria-invalid]="mostrarErro() && form.controls.bairro.invalid"
            aria-describedby="erro-form"
          />
          <datalist id="lista-bairros">
            @for (b of sugestoesBairros; track b) {
              <option [value]="b">{{ b }}</option>
            }
          </datalist>

          <label for="desc">O que está acontecendo (detalhes)</label>
          <textarea
            id="desc"
            rows="3"
            formControlName="descricao"
            placeholder="Descreva ponto de referência, gravidade e impacto no trânsito ou residências"
            [attr.aria-invalid]="mostrarErro() && form.controls.descricao.invalid"
            aria-describedby="erro-form"
          ></textarea>

          <fieldset class="gravidade">
            <legend class="rotulo">Gravidade do Risco</legend>
            <div class="segmentos">
              @for (nivel of gravidades; track nivel) {
                <label [class.marcado]="form.controls.gravidade.value === nivel" [attr.data-g]="nivel">
                  <input type="radio" formControlName="gravidade" [value]="nivel" />
                  {{ rotulosGravidade[nivel] }}
                </label>
              }
            </div>
          </fieldset>

          @if (mostrarErro()) {
            <p id="erro-form" class="erro" role="alert">Preencha o bairro e a descrição para registrar.</p>
          }

          <button class="btn btn-principal" type="submit">
            📢 Registrar e Gerar Protocolo
          </button>
        </form>
      </aside>

      <section aria-labelledby="titulo-ocorrencias" class="secao-conteudo">
        <!-- MAPA INTERATIVO DOS BAIRROS -->
        <app-mapa-conquista
          [ocorrencias]="service.ocorrencias()"
          [bairroFiltro]="bairroFiltro()"
          (selecionarBairro)="bairroFiltro.set($event)"
        />

        <!-- LISTA DE OCORRÊNCIAS COM FILTROS -->
        <div class="lista-topo">
          <div>
            <h2 id="titulo-ocorrencias">
              Ocorrências Registradas
              @if (bairroFiltro()) {
                <span class="destaque-bairro">em {{ bairroFiltro() }}</span>
              }
            </h2>
            <p class="lista-sub">Clique em "Gerar Ofício Formal" para exportar denúncia oficial de qualquer item.</p>
          </div>
          <div class="filtros" role="group" aria-label="Filtrar ocorrências">
            @for (f of filtros; track f.valor) {
              <button
                type="button"
                [class.ativo]="filtro() === f.valor"
                [attr.aria-pressed]="filtro() === f.valor"
                (click)="filtro.set(f.valor)"
              >
                {{ f.rotulo }}
              </button>
            }
          </div>
        </div>

        @for (o of visiveis(); track o.id) {
          <app-card-ocorrencia
            [ocorrencia]="o"
            (concluir)="concluir($event)"
            (remover)="remover($event)"
            (gerarOficio)="abrirOficio($event)"
          />
        } @empty {
          <div class="vazio" role="status">
            <span class="vazio-icone" aria-hidden="true">🌱</span>
            <p><strong>Nenhuma ocorrência encontrada para este filtro.</strong></p>
            <p>Utilize o formulário ao lado para registrar um problema ou selecione outro bairro no mapa.</p>
          </div>
        }
      </section>
    </div>

    <!-- MODAL DE OFÍCIO / COBRANÇA FORMAL -->
    @if (ocorrenciaParaOficio(); as oc) {
      <app-oficio-modal [ocorrencia]="oc" (fechar)="ocorrenciaParaOficio.set(null)" />
    }
  `,
  styles: [`
    .faixa-alerta-clima {
      background: #faedcd;
      border-bottom: 1px solid #d4a373;
      padding: 0.65rem 1.25rem;
    }
    .faixa-int {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .pulso-alerta {
      font-size: 1.25rem;
    }
    .faixa-texto {
      font-size: 0.9rem;
      color: #7f4f24;
      flex: 1;
      min-width: 260px;
    }
    .faixa-texto strong {
      margin-right: 0.4rem;
      color: #5c3d1e;
    }
    .btn-defesa {
      background: #c93b2b;
      color: #fff;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.8rem;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      white-space: nowrap;
    }
    .btn-defesa:hover {
      background: #a82e20;
    }
    .badge-hero {
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
    .badge-form {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      background: #e2ece9;
      color: #1b4332;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      display: inline-block;
      margin-bottom: 0.3rem;
    }
    .form-header h2 {
      margin: 0.2rem 0 0.1rem;
      color: #1b4332;
      font-size: 1.35rem;
    }
    .form-sub {
      margin: 0 0 0.5rem;
      font-size: 0.82rem;
      color: #52796f;
    }
    .destaque-bairro {
      font-size: 1.1rem;
      color: #2d6a4f;
      font-weight: 500;
    }
    .lista-sub {
      margin: 0.2rem 0 0;
      font-size: 0.85rem;
      color: #4a5850;
    }
    .vazio-icone {
      font-size: 2.2rem;
      display: block;
      margin-bottom: 0.5rem;
    }
  `],
})
export class Home {
  readonly service = inject(OcorrenciaService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly tipos = TIPOS_OCORRENCIA;
  readonly gravidades = GRAVIDADES;
  readonly sugestoesBairros = BAIRROS_CONQUISTA;

  readonly rotulosGravidade: Record<Gravidade, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta',
  };

  readonly form = this.fb.group({
    tipo: this.fb.control<TipoOcorrencia>('Alagamento'),
    bairro: this.fb.control('', { validators: [requiredTrimmed] }),
    descricao: this.fb.control('', { validators: [requiredTrimmed] }),
    gravidade: this.fb.control<Gravidade>('media'),
  });

  readonly enviado = signal(false);
  readonly mostrarErro = computed(() => this.enviado() && this.form.invalid);

  readonly filtro = signal<FiltroOcorrencia>('abertas');
  readonly bairroFiltro = signal<string>('');

  readonly ocorrenciaParaOficio = signal<Ocorrencia | null>(null);

  readonly filtros: { valor: FiltroOcorrencia; rotulo: string }[] = [
    { valor: 'abertas', rotulo: 'Abertas' },
    { valor: 'resolvidas', rotulo: 'Resolvidas' },
    { valor: 'todas', rotulo: 'Todas' },
  ];

  readonly abertas = computed(
    () => this.service.ocorrencias().filter((o) => !o.resolvida).length,
  );

  readonly visiveis = computed(() => {
    const f = this.filtro();
    const bairro = this.bairroFiltro().toLowerCase().trim();
    let lista = [...this.service.ocorrencias()];

    if (bairro) {
      lista = lista.filter((o) => o.bairro.toLowerCase().includes(bairro));
    }

    if (f === 'abertas') {
      return lista.filter((o) => !o.resolvida);
    }
    if (f === 'resolvidas') {
      return lista.filter((o) => o.resolvida);
    }
    return lista;
  });

  adicionar(): void {
    if (this.form.invalid) {
      this.enviado.set(true);
      return;
    }
    const { tipo, bairro, descricao, gravidade } = this.form.getRawValue();
    this.service.adicionar(tipo, bairro.trim(), descricao.trim(), gravidade);
    this.form.patchValue({ bairro: '', descricao: '' });
    this.enviado.set(false);
  }

  concluir(id: number): void {
    this.service.concluir(id);
  }

  remover(id: number): void {
    this.service.remover(id);
  }

  abrirOficio(ocorrencia: Ocorrencia): void {
    this.ocorrenciaParaOficio.set(ocorrencia);
  }
}
