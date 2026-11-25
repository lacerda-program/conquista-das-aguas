import { Component, input, output } from '@angular/core';
import { Ocorrencia } from '../ocorrencia.model';

@Component({
  selector: 'app-card-ocorrencia',
  template: `
    <article class="item" [class.resolvida]="ocorrencia().resolvida" [attr.data-gravidade]="ocorrencia().gravidade">
      <div class="item-corpo">
        <div class="item-topo">
          <h3>{{ ocorrencia().tipo }}</h3>
          <span class="selo" [attr.data-gravidade]="ocorrencia().gravidade">
            {{ ocorrencia().gravidade === 'media' ? 'média' : ocorrencia().gravidade }}
          </span>
        </div>
        <p class="item-local">{{ ocorrencia().bairro }}</p>
        <p class="item-desc">{{ ocorrencia().descricao }}</p>
        <small>Registrada em {{ ocorrencia().data }}</small>
      </div>
      <div class="item-acoes">
        <button class="btn btn-leve" (click)="concluir.emit(ocorrencia().id)">
          {{ ocorrencia().resolvida ? 'Reabrir' : 'Marcar como resolvida' }}
        </button>
        <button class="btn btn-perigo" (click)="remover.emit(ocorrencia().id)">Remover</button>
      </div>
    </article>`,
})
export class CardOcorrencia {
  ocorrencia = input.required<Ocorrencia>();
  concluir = output<number>();
  remover = output<number>();
}
