import { Injectable, signal } from '@angular/core';
import { Gravidade, Ocorrencia } from './ocorrencia.model';

const CHAVE = 'conquista-das-aguas:ocorrencias';

@Injectable({ providedIn: 'root' })
export class OcorrenciaService {
  ocorrencias = signal<Ocorrencia[]>(this.carregar());

  adicionar(tipo: string, bairro: string, descricao: string, gravidade: Gravidade) {
    const nova: Ocorrencia = {
      id: Date.now(),
      tipo,
      bairro,
      descricao,
      gravidade,
      resolvida: false,
      data: new Date().toLocaleDateString('pt-BR'),
    };
    this.ocorrencias.update(lista => [...lista, nova]);
    this.salvar();
  }

  concluir(id: number) {
    this.ocorrencias.update(lista =>
      lista.map(o =>
        o.id === id
          ? { ...o, resolvida: !o.resolvida, resolvidaEm: o.resolvida ? undefined : new Date().toISOString() }
          : o,
      ));
    this.salvar();
  }

  remover(id: number) {
    this.ocorrencias.update(lista => lista.filter(o => o.id !== id));
    this.salvar();
  }

  private salvar() {
    localStorage.setItem(CHAVE, JSON.stringify(this.ocorrencias()));
  }

  private carregar(): Ocorrencia[] {
    try {
      const texto = localStorage.getItem(CHAVE);
      const dados = texto ? JSON.parse(texto) : [];
      return Array.isArray(dados) ? dados : [];
    } catch {
      return [];
    }
  }
}
