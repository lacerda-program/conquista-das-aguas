import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topo">
      <div class="topo-int">
        <a routerLink="/" class="marca">Conquista das Águas</a>
        <nav>
          <a routerLink="/" routerLinkActive="ativo" [routerLinkActiveOptions]="{ exact: true }">Ocorrências</a>
          <a routerLink="/painel" routerLinkActive="ativo">Painel de risco</a>
        </nav>
      </div>
    </header>
    <router-outlet />
    <footer class="rodape">
      Em emergências, ligue para a Defesa Civil (199) ou para os Bombeiros (193). Este app registra e conscientiza, e não substitui o atendimento oficial.
    </footer>`,
})
export class App {}
