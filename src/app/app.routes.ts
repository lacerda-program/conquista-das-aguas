import { Routes } from '@angular/router';
import { Comunidade } from './comunidade/comunidade';
import { Home } from './home/home';
import { Observatorio } from './observatorio/observatorio';
import { Painel } from './painel/painel';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'painel', component: Painel },
  { path: 'comunidade', component: Comunidade },
  { path: 'observatorio', component: Observatorio },
  { path: '**', redirectTo: '' },
];