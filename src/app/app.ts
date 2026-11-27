import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { OcorrenciaService } from './ocorrencia.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topo">
      <div class="topo-int">
        <div class="marca-bloco">
          <a routerLink="/" class="marca">
            <span class="marca-gota" aria-hidden="true">💧</span>
            <span>Conquista das Águas</span>
          </a>
          <span class="selo-cidade">Vitória da Conquista • BA</span>
        </div>
        <nav aria-label="Navegação Principal">
          <a routerLink="/" routerLinkActive="ativo" [routerLinkActiveOptions]="{ exact: true }" ariaCurrentWhenActive="page">
            Ocorrências & Mapa
          </a>
          <a routerLink="/painel" routerLinkActive="ativo" ariaCurrentWhenActive="page">
            Painel de Risco
          </a>
          <a routerLink="/comunidade" routerLinkActive="ativo" ariaCurrentWhenActive="page">
            Ação Comunitária
          </a>
          <a routerLink="/observatorio" routerLinkActive="ativo" ariaCurrentWhenActive="page">
            Observatório Rio Verruga
          </a>
        </nav>
      </div>
    </header>

    @if (persistenciaErro()) {
      <p class="aviso-persistencia" role="alert">
        Não foi possível salvar no navegador. Os registros desta sessão podem se perder ao recarregar.
      </p>
    }

    <main id="conteudo">
      <router-outlet />
    </main>

    <footer class="rodape">
      <div class="rodape-int">
        <div class="rodape-col">
          <strong>Conquista das Águas</strong>
          <p>Plataforma cidadã colaborativa para monitoramento hidrológico, drenagem e defesa ambiental da bacia de Vitória da Conquista.</p>
        </div>
        <div class="rodape-col">
          <strong>Canais Oficiais de Emergência</strong>
          <ul class="lista-emergencia">
            <li>Defesa Civil Municipal: <a href="tel:199"><strong>199</strong></a> / (77) 3421-1736</li>
            <li>Corpo de Bombeiros Militar: <a href="tel:193"><strong>193</strong></a></li>
            <li>Embasa (Esgoto e Vazamento): <a href="tel:08000555195"><strong>0800 0555 195</strong></a></li>
            <li>SAMU (Emergência Médica): <a href="tel:192"><strong>192</strong></a></li>
          </ul>
        </div>
      </div>
      <div class="rodape-copy">
        <p>Iniciativa comunitária e acadêmica para preservação dos recursos hídricos e garantia do direito à cidade.</p>
      </div>
    </footer>
  `,
  styles: [`
    .marca-bloco {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .marca-gota {
      font-size: 1.35rem;
    }
    .selo-cidade {
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      background: rgba(216, 243, 220, 0.2);
      color: #b7e4c7;
      padding: 0.2rem 0.55rem;
      border-radius: 999px;
      border: 1px solid rgba(216, 243, 220, 0.3);
    }
    .rodape-int {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      text-align: left;
      margin-bottom: 1.5rem;
    }
    .rodape-col strong {
      color: #1b4332;
      font-size: 0.95rem;
      display: block;
      margin-bottom: 0.5rem;
    }
    .rodape-col p {
      margin: 0;
      font-size: 0.85rem;
      color: #4a5850;
      line-height: 1.5;
    }
    .lista-emergencia {
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 0.85rem;
      color: #4a5850;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .lista-emergencia a {
      color: #2d6a4f;
      text-decoration: underline;
    }
    .rodape-copy {
      border-top: 1px solid #d8e5df;
      padding-top: 1.25rem;
      font-size: 0.8rem;
      color: #748cab;
    }
    @media (max-width: 720px) {
      .rodape-int {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .lista-emergencia {
        align-items: center;
      }
    }
  `],
})
export class App {
  readonly persistenciaErro = inject(OcorrenciaService).persistenciaErro;
}
