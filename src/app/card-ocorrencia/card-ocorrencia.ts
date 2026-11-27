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
            {{ ocorrencia().gravidade === 'media' ? 'média gravidade' : ocorrencia().gravidade + ' gravidade' }}
          </span>
          @if (ocorrencia().protocolo) {
            <span class="selo-protocolo" title="Protocolo Cidadão">
              {{ ocorrencia().protocolo }}
            </span>
          }
        </div>
        <p class="item-local">
          <span class="icone-local" aria-hidden="true">📍</span> {{ ocorrencia().bairro }}
        </p>
        <p class="item-desc">{{ ocorrencia().descricao }}</p>
        <div class="item-meta">
          <small>Registrada pela comunidade em {{ ocorrencia().data }}</small>
          @if (ocorrencia().resolvida) {
            <span class="selo-resolvida">✓ Solucionada</span>
          }
        </div>
      </div>
      <div class="item-acoes">
        <button
          type="button"
          class="btn btn-oficio"
          (click)="gerarOficio.emit(ocorrencia())"
          title="Gerar ofício formal para enviar a órgãos públicos"
        >
          📄 Gerar Ofício Formal
        </button>
        <button type="button" class="btn btn-leve" (click)="concluir.emit(ocorrencia().id)">
          {{ ocorrencia().resolvida ? '↺ Reabrir' : '✓ Marcar como resolvida' }}
        </button>
        <button type="button" class="btn btn-perigo" (click)="remover.emit(ocorrencia().id)">
          Remover
        </button>
      </div>
    </article>
  `,
  styles: [`
    .selo-protocolo {
      font-size: 0.72rem;
      font-family: monospace;
      background: #ebf5f0;
      color: #2d6a4f;
      border: 1px solid #c2e2d4;
      padding: 0.15rem 0.5rem;
      border-radius: 6px;
      font-weight: 600;
    }
    .icone-local {
      margin-right: 0.2rem;
    }
    .item-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-top: 0.4rem;
    }
    .selo-resolvida {
      font-size: 0.75rem;
      font-weight: 700;
      color: #2d6a4f;
      background: #d8f3dc;
      padding: 0.1rem 0.5rem;
      border-radius: 999px;
    }
    .btn-oficio {
      background: #faedcd;
      color: #7f4f24;
      border: 1px solid #d4a373;
      font-size: 0.85rem;
      padding: 0.45rem 0.75rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      transition: background 0.15s ease;
    }
    .btn-oficio:hover {
      background: #f4d59f;
    }
  `],
})
export class CardOcorrencia {
  ocorrencia = input.required<Ocorrencia>();
  concluir = output<number>();
  remover = output<number>();
  gerarOficio = output<Ocorrencia>();
}
