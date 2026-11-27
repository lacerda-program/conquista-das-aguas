import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { CardOcorrencia } from '../card-ocorrencia/card-ocorrencia';
import { FiltroOcorrencia, GRAVIDADES, Gravidade, TIPOS_OCORRENCIA, TipoOcorrencia } from '../ocorrencia.model';
import { OcorrenciaService } from '../ocorrencia.service';

const requiredTrimmed: ValidatorFn = (control) => {
  const value = control.value;
  if (typeof value !== 'string' || value.trim().length === 0) {
    return { required: true };
  }
  return null;
};

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, CardOcorrencia],
  template: `
    <section class="hero">
      <div class="hero-int">
        <div>
          <h1>Mostre onde a água está falhando na cidade.</h1>
          <p>
            Galerias que não suportam a chuva, esgoto a céu aberto e despejos irregulares afetam bairros inteiros e
            rios como o Verruga. Cada registro ajuda a mostrar onde agir primeiro.
          </p>
        </div>
        <div class="contador" aria-live="polite">
          <strong>{{ abertas() }}</strong>
          <span>{{ abertas() === 1 ? 'ocorrência aberta' : 'ocorrências abertas' }}</span>
        </div>
      </div>
    </section>

    <div class="layout">
      <aside>
        <form class="painel-form" [formGroup]="form" (ngSubmit)="adicionar()" novalidate>
          <h2>Nova ocorrência</h2>

          <label for="tipo">Tipo</label>
          <select id="tipo" formControlName="tipo">
            @for (opcao of tipos; track opcao) {
              <option [value]="opcao">{{ opcao }}</option>
            }
          </select>

          <label for="bairro">Bairro ou rua</label>
          <input
            id="bairro"
            formControlName="bairro"
            placeholder="Ex.: Avenida Caracas, Jurema"
            [attr.aria-invalid]="mostrarErro() && form.controls.bairro.invalid"
            aria-describedby="erro-form"
          />

          <label for="desc">O que está acontecendo</label>
          <textarea
            id="desc"
            rows="3"
            formControlName="descricao"
            placeholder="Descreva o problema com poucas palavras"
            [attr.aria-invalid]="mostrarErro() && form.controls.descricao.invalid"
            aria-describedby="erro-form"
          ></textarea>

          <fieldset class="gravidade">
            <legend class="rotulo">Gravidade</legend>
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
          <button class="btn btn-principal" type="submit">Registrar ocorrência</button>
        </form>
      </aside>

      <section aria-labelledby="titulo-ocorrencias">
        <div class="lista-topo">
          <h2 id="titulo-ocorrencias">Ocorrências</h2>
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
          <app-card-ocorrencia [ocorrencia]="o" (concluir)="concluir($event)" (remover)="remover($event)" />
        } @empty {
          <p class="vazio" role="status">Nada por aqui. Registre uma ocorrência no formulário para começar.</p>
        }
      </section>
    </div>
  `,
})
export class Home {
  private readonly service = inject(OcorrenciaService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly tipos = TIPOS_OCORRENCIA;
  readonly gravidades = GRAVIDADES;
  readonly rotulosGravidade: Record<Gravidade, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta',
  };

  readonly form = this.fb.group({
    tipo: this.fb.control<TipoOcorrencia>('Esgoto a céu aberto'),
    bairro: this.fb.control('', { validators: [requiredTrimmed] }),
    descricao: this.fb.control('', { validators: [requiredTrimmed] }),
    gravidade: this.fb.control<Gravidade>('media'),
  });

  readonly enviado = signal(false);
  readonly mostrarErro = computed(() => this.enviado() && this.form.invalid);

  readonly filtro = signal<FiltroOcorrencia>('abertas');
  readonly filtros: { valor: FiltroOcorrencia; rotulo: string }[] = [
    { valor: 'abertas', rotulo: 'Abertas' },
    { valor: 'resolvidas', rotulo: 'Resolvidas' },
    { valor: 'todas', rotulo: 'Todas' },
  ];

  readonly abertas = computed(() => this.service.ocorrencias().filter((o) => !o.resolvida).length);

  readonly visiveis = computed(() => {
    const f = this.filtro();
    const lista = [...this.service.ocorrencias()].reverse();
    if (f === 'todas') {
      return lista;
    }
    return lista.filter((o) => (f === 'abertas' ? !o.resolvida : o.resolvida));
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
}
