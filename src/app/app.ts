import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { OcorrenciaService } from './ocorrencia.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topo">
      <div class="topo-int">
        <a routerLink="/" class="marca">Conquista das Águas</a>
        <nav aria-label="Principal">
          <a routerLink="/" routerLinkActive="ativo" [routerLinkActiveOptions]="{ exact: true }" ariaCurrentWhenActive="page">
            Ocorrências
          </a>
          <a routerLink="/painel" routerLinkActive="ativo" ariaCurrentWhenActive="page">Painel de risco</a>
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
      Em emergências, ligue para a Defesa Civil (<a href="tel:199">199</a>) ou para os Bombeiros (<a href="tel:193">193</a>).
      Este app registra e conscientiza, e não substitui o atendimento oficial.
    </footer>
  `,
})
export class App {
  readonly persistenciaErro = inject(OcorrenciaService).persistenciaErro;
}
