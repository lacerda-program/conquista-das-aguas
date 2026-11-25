import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardOcorrencia } from '../card-ocorrencia/card-ocorrencia';
import { OcorrenciaService } from '../ocorrencia.service';
import { Gravidade } from '../ocorrencia.model';

type Filtro = 'abertas' | 'resolvidas' | 'todas';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CardOcorrencia],
  template: `
    <section class="hero">
      <div class="hero-int">
        <div>
          <h1>Mostre onde a água está falhando na cidade.</h1>
          <p>
            Galerias que não suportam a chuva, esgoto a céu aberto e despejos irregulares afetam
            bairros inteiros e rios como o Verruga. Cada registro ajuda a mostrar onde agir primeiro.
          </p>
        </div>
        <div class="contador">
          <strong>{{ abertas() }}</strong>
          <span>{{ abertas() === 1 ? 'ocorrência aberta' : 'ocorrências abertas' }}</span>
        </div>
      </div>
    </section>

    <div class="layout">
      <aside class="painel-form">
        <h2>Nova ocorrência</h2>

        <label for="tipo">Tipo</label>
        <select id="tipo" [(ngModel)]="tipo">
          <option>Esgoto a céu aberto</option>
          <option>Bueiro entupido</option>
          <option>Alagamento</option>
          <option>Descarte irregular</option>
          <option>Queimada perto de nascente</option>
        </select>

        <label for="bairro">Bairro ou rua</label>
        <input id="bairro" [(ngModel)]="bairro" placeholder="Ex.: Avenida Caracas, Jurema" />

        <label for="desc">O que está acontecendo</label>
        <textarea id="desc" rows="3" [(ngModel)]="descricao" placeholder="Descreva o problema com poucas palavras"></textarea>

        <span class="rotulo">Gravidade</span>
        <div class="segmentos">
          <label [class.marcado]="gravidade === 'baixa'" data-g="baixa">
            <input type="radio" name="gravidade" value="baixa" [(ngModel)]="gravidade" /> Baixa
          </label>
          <label [class.marcado]="gravidade === 'media'" data-g="media">
            <input type="radio" name="gravidade" value="media" [(ngModel)]="gravidade" /> Média
          </label>
          <label [class.marcado]="gravidade === 'alta'" data-g="alta">
            <input type="radio" name="gravidade" value="alta" [(ngModel)]="gravidade" /> Alta
          </label>
        </div>

        @if (erro) {
          <p class="erro">Preencha o bairro e a descrição para registrar.</p>
        }
        <button class="btn btn-principal" (click)="adicionar()">Registrar ocorrência</button>
      </aside>

      <section>
        <div class="lista-topo">
          <h2>Ocorrências</h2>
          <div class="filtros">
            @for (f of filtros; track f.valor) {
              <button [class.ativo]="filtro() === f.valor" (click)="filtro.set(f.valor)">{{ f.rotulo }}</button>
            }
          </div>
        </div>

        @for (o of visiveis(); track o.id) {
          <app-card-ocorrencia [ocorrencia]="o"
            (concluir)="service.concluir($event)" (remover)="service.remover($event)" />
        } @empty {
          <p class="vazio">Nada por aqui. Registre uma ocorrência no formulário para começar.</p>
        }
      </section>
    </div>`,
})
export class Home {
  service = inject(OcorrenciaService);

  tipo = 'Esgoto a céu aberto';
  bairro = '';
  descricao = '';
  gravidade: Gravidade = 'media';
  erro = false;

  filtro = signal<Filtro>('abertas');
  filtros: { valor: Filtro; rotulo: string }[] = [
    { valor: 'abertas', rotulo: 'Abertas' },
    { valor: 'resolvidas', rotulo: 'Resolvidas' },
    { valor: 'todas', rotulo: 'Todas' },
  ];

  abertas = computed(() => this.service.ocorrencias().filter(o => !o.resolvida).length);

  visiveis = computed(() => {
    const f = this.filtro();
    const lista = [...this.service.ocorrencias()].reverse();
    if (f === 'todas') return lista;
    return lista.filter(o => (f === 'abertas' ? !o.resolvida : o.resolvida));
  });

  adicionar() {
    if (!this.bairro.trim() || !this.descricao.trim()) {
      this.erro = true;
      return;
    }
    this.erro = false;
    this.service.adicionar(this.tipo, this.bairro.trim(), this.descricao.trim(), this.gravidade);
    this.bairro = '';
    this.descricao = '';
  }
}
