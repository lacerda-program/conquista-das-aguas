import { Injectable, signal } from '@angular/core';
import { Gravidade, isOcorrencia, Ocorrencia } from './ocorrencia.model';

const CHAVE = 'conquista-das-aguas:ocorrencias';

@Injectable({ providedIn: 'root' })
export class OcorrenciaService {
  private readonly lista = signal<Ocorrencia[]>(this.carregar());
  readonly ocorrencias = this.lista.asReadonly();
  readonly persistenciaErro = signal(false);

  adicionar(tipo: string, bairro: string, descricao: string, gravidade: Gravidade): void {
    const nova: Ocorrencia = {
      id: Date.now(),
      tipo,
      bairro,
      descricao,
      gravidade,
      resolvida: false,
      data: new Date().toLocaleDateString('pt-BR'),
    };
    this.lista.update((atual) => [...atual, nova]);
    this.salvar();
  }

  concluir(id: number): void {
    this.lista.update((atual) =>
      atual.map((ocorrencia) =>
        ocorrencia.id === id
          ? {
              ...ocorrencia,
              resolvida: !ocorrencia.resolvida,
              resolvidaEm: ocorrencia.resolvida ? undefined : new Date().toISOString(),
            }
          : ocorrencia,
      ),
    );
    this.salvar();
  }

  remover(id: number): void {
    this.lista.update((atual) => atual.filter((ocorrencia) => ocorrencia.id !== id));
    this.salvar();
  }

  private salvar(): void {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(this.lista()));
      this.persistenciaErro.set(false);
    } catch {
      this.persistenciaErro.set(true);
    }
  }

  private carregar(): Ocorrencia[] {
    try {
      const texto = localStorage.getItem(CHAVE);
      if (!texto) {
        return [];
      }
      const dados: unknown = JSON.parse(texto);
      if (!Array.isArray(dados)) {
        return [];
      }
      return dados.filter(isOcorrencia);
    } catch {
      return [];
    }
  }
}
