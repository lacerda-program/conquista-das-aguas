import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Painel } from './painel/painel';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'painel', component: Painel },
  { path: '**', redirectTo: '' },
];