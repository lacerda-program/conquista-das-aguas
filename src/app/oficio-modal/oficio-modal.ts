import { Component, computed, input, output, signal } from '@angular/core';
import { Ocorrencia } from '../ocorrencia.model';

export type OrgaoDestino = 'seinfra' | 'embasa' | 'defesa_civil' | 'mpba';

interface DetalhesOrgao {
  nome: string;
  cargo: string;
  canal: string;
  whatsapp: string;
}

const ORGAOS: Record<OrgaoDestino, DetalhesOrgao> = {
  seinfra: {
    nome: 'Secretaria Municipal de Infraestrutura Urbana (Seinfra) - Vitória da Conquista',
    cargo: 'À Ilma. Coordenação de Drenagem e Pavimentação',
    canal: 'ouvidoria@pmvc.ba.gov.br',
    whatsapp: '557734248500',
  },
  embasa: {
    nome: 'Embasa - Empresa Baiana de Águas e Saneamento (Unidade Regional Conquista)',
    cargo: 'À Gerência Regional de Operações de Esgotamento',
    canal: 'atendimento.conquista@embasa.ba.gov.br',
    whatsapp: '5571997170999',
  },
  defesa_civil: {
    nome: 'Coordenação Municipal de Proteção e Defesa Civil (COMPDEC - VDC)',
    cargo: 'Ao Ilmo. Coordenador Municipal de Defesa Civil',
    canal: 'defesacivil@pmvc.ba.gov.br | Plantão 199',
    whatsapp: '5577988565070',
  },
  mpba: {
    nome: 'Ministério Público do Estado da Bahia - Promotoria de Justiça de Meio Ambiente',
    cargo: 'Ao(À) Exmo(a). Promotor(a) de Justiça do Meio Ambiente e Urbanismo',
    canal: 'promotoriaconquista@mpba.mp.br',
    whatsapp: '5571997170999',
  },
};

@Component({
  selector: 'app-oficio-modal',
  template: `
    <div class="modal-backdrop" (click)="fechar.emit()" (keydown.escape)="fechar.emit()" tabindex="0" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      <div class="modal-conteudo" (click)="$event.stopPropagation()">
        <header class="modal-header">
          <div>
            <span class="badge-oficio">Instrumento de Cidadania Ativa</span>
            <h2 id="modal-titulo">Gerador de Ofício Cidadão e Denúncia Formal</h2>
            <p class="subtitulo">
              Documento formalizado para protocolo na Prefeitura, Embasa, Defesa Civil ou Ministério Público.
            </p>
          </div>
          <button type="button" class="btn-fechar" (click)="fechar.emit()" aria-label="Fechar modal">✕</button>
        </header>

        <div class="seletor-orgao">
          <label for="orgao-select"><strong>Destinatário Oficial:</strong></label>
          <select id="orgao-select" [value]="orgaoSelecionado()" (change)="aoMudarOrgao($event)">
            <option value="seinfra">Prefeitura de Vitória da Conquista (Seinfra - Drenagem / Bueiros)</option>
            <option value="embasa">Embasa (Rede de Esgoto e Água Tratada)</option>
            <option value="defesa_civil">Defesa Civil de Vitória da Conquista (Plantão 199 - Risco e Inundação)</option>
            <option value="mpba">Ministério Público da Bahia (Promotoria de Meio Ambiente)</option>
          </select>
        </div>

        <div class="folha-oficio" id="area-impressao">
          <div class="folha-topo">
            <div class="folha-timbre">
              <strong>DOCUMENTO CIDADÃO DE REIVINDICAÇÃO PÚBLICA</strong>
              <span>PLATAFORMA CONQUISTA DAS ÁGUAS • VITÓRIA DA CONQUISTA - BA</span>
            </div>
            <div class="folha-protocolo">
              <strong>PROTOCOLO CIDADÃO:</strong> {{ ocorrencia().protocolo || 'VDC-2026-OF' }}
            </div>
          </div>

          <div class="folha-corpo">
            <p class="data-linha">Vitória da Conquista - BA, {{ dataHoje }}</p>
            
            <p class="destinatario">
              {{ orgaoAtual().cargo }}<br />
              <strong>{{ orgaoAtual().nome }}</strong><br />
              Canal de Atendimento: {{ orgaoAtual().canal }}
            </p>

            <p class="assunto">
              <strong>ASSUNTO:</strong> Solicitação Urgente de Intervenção Técnica em {{ ocorrencia().tipo }} no Bairro {{ ocorrencia().bairro }}
            </p>

            <p>Prezados(as) Senhores(as),</p>

            <p>
              Vimos, por meio deste instrumento de controle social e participação cidadã, comunicar oficialmente e requerer providências imediatas quanto à ocorrência descrita abaixo, classificada com <strong>gravidade {{ ocorrencia().gravidade.toUpperCase() }}</strong> na bacia hidrográfica municipal:
            </p>

            <div class="caixa-fato">
              <p><strong>• Localidade / Bairro:</strong> {{ ocorrencia().bairro }} (Vitória da Conquista - BA)</p>
              <p><strong>• Natureza do Fato:</strong> {{ ocorrencia().tipo }}</p>
              <p><strong>• Descrição Detalhada:</strong> "{{ ocorrencia().descricao }}"</p>
              <p><strong>• Data do Registro Comunitário:</strong> {{ ocorrencia().data }}</p>
            </div>

            <p>
              <strong>FUNDAMENTAÇÃO JURÍDICA E DEVER DO PODER PÚBLICO:</strong><br />
              O presente requerimento fundamenta-se no <strong>Artigo 225 da Constituição Federal de 1988</strong> (direito ao meio ambiente ecologicamente equilibrado e qualidade de vida) e na <strong>Lei Federal nº 11.445/2007</strong> (Marco Legal do Saneamento Básico), que assegura a universalidade, salubridade ambiental e eficiência dos serviços públicos de manejo de águas pluviais e esgotamento sanitário.
            </p>

            <p>
              Diante do exposto e do iminente risco à integridade da população e dos mananciais urbanos (notadamente o Rio Verruga e seus afluentes), solicita-se o envio de equipe técnica ao local no prazo de até 5 (cinco) dias úteis para vistoria e execução dos reparos necessários.
            </p>

            <p class="fecho">
              Atenciosamente,<br />
              <strong>Comunidade de Moradores e Usuários da Plataforma Conquista das Águas</strong><br />
              <small>Registro autenticado pela cidadania ativa conquistense.</small>
            </p>
          </div>
        </div>

        <footer class="modal-acoes">
          <button type="button" class="btn btn-copiar" (click)="copiarTexto()">
            {{ textoCopiado() ? '✓ Texto do Ofício Copiado!' : '📋 Copiar Texto Completo' }}
          </button>
          <a class="btn btn-whatsapp" [href]="linkWhatsapp()" target="_blank" rel="noopener noreferrer">
            💬 Enviar via WhatsApp do Órgão
          </a>
          <button type="button" class="btn btn-imprimir" (click)="imprimir()">
            🖨️ Imprimir / Salvar PDF
          </button>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(13, 43, 51, 0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
      overflow-y: auto;
    }
    .modal-conteudo {
      background: #fff;
      border-radius: 16px;
      max-width: 780px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0,0,0,0.25);
      display: flex;
      flex-direction: column;
      animation: modalSurgir 0.25s ease-out;
    }
    @keyframes modalSurgir {
      from { opacity: 0; transform: translateY(12px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .modal-header {
      padding: 1.5rem 1.75rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #e2ece9;
    }
    .badge-oficio {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: #d8f3dc;
      color: #1b4332;
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      margin-bottom: 0.4rem;
    }
    .modal-header h2 {
      margin: 0;
      font-size: 1.4rem;
      color: #1b4332;
    }
    .subtitulo {
      margin: 0.25rem 0 0;
      font-size: 0.9rem;
      color: #4a5850;
    }
    .btn-fechar {
      background: #f0f4f2;
      border: none;
      font-size: 1.1rem;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      cursor: pointer;
      color: #2d6a4f;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-fechar:hover {
      background: #e1eae6;
    }
    .seletor-orgao {
      padding: 1rem 1.75rem;
      background: #f7f9f6;
      border-bottom: 1px solid #e2ece9;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .seletor-orgao select {
      background: #fff;
      border: 1px solid #b7d5ca;
      border-radius: 8px;
      padding: 0.6rem 0.8rem;
      font-size: 0.95rem;
      color: #1b4332;
      font-weight: 500;
    }
    .folha-oficio {
      padding: 1.75rem;
      margin: 1.25rem 1.75rem;
      background: #ffffff;
      border: 1px solid #d0ded8;
      border-radius: 10px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);
      font-family: 'Georgia', serif;
      font-size: 0.95rem;
      line-height: 1.6;
      color: #1e2922;
    }
    .folha-topo {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #2d6a4f;
      padding-bottom: 0.75rem;
      margin-bottom: 1.25rem;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    }
    .folha-timbre strong {
      display: block;
      font-size: 0.85rem;
      color: #1b4332;
      letter-spacing: 0.04em;
    }
    .folha-timbre span {
      font-size: 0.72rem;
      color: #52796f;
    }
    .folha-protocolo {
      font-size: 0.85rem;
      color: #2d6a4f;
    }
    .data-linha {
      text-align: right;
      color: #555;
      margin-bottom: 1.25rem;
      font-style: italic;
    }
    .destinatario {
      margin-bottom: 1.25rem;
      line-height: 1.4;
    }
    .assunto {
      background: #f1f7f4;
      padding: 0.6rem 0.9rem;
      border-left: 4px solid #2d6a4f;
      border-radius: 4px;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      margin-bottom: 1.25rem;
    }
    .caixa-fato {
      background: #fafbfa;
      border: 1px dashed #b7d5ca;
      border-radius: 8px;
      padding: 0.9rem 1.1rem;
      margin: 1rem 0;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      font-size: 0.9rem;
    }
    .caixa-fato p {
      margin: 0.25rem 0;
    }
    .fecho {
      margin-top: 1.75rem;
      border-top: 1px solid #e0e0e0;
      padding-top: 1rem;
    }
    .modal-acoes {
      padding: 1.25rem 1.75rem;
      border-top: 1px solid #e2ece9;
      background: #f7f9f6;
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      justify-content: flex-end;
      border-radius: 0 0 16px 16px;
    }
    .btn-copiar {
      background: #2d6a4f;
      color: #fff;
    }
    .btn-copiar:hover {
      background: #1b4332;
    }
    .btn-whatsapp {
      background: #25d366;
      color: #fff;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
    }
    .btn-whatsapp:hover {
      background: #1ebc59;
    }
    .btn-imprimir {
      background: #fff;
      color: #1b4332;
      border: 1px solid #b7d5ca;
    }
    .btn-imprimir:hover {
      background: #e8f3ee;
    }
    @media (max-width: 640px) {
      .modal-acoes {
        flex-direction: column;
      }
      .modal-acoes .btn {
        width: 100%;
        text-align: center;
        justify-content: center;
      }
    }
    @media print {
      body * {
        visibility: hidden;
      }
      #area-impressao, #area-impressao * {
        visibility: visible;
      }
      #area-impressao {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        border: none;
        box-shadow: none;
      }
    }
  `],
})
export class OficioModal {
  ocorrencia = input.required<Ocorrencia>();
  fechar = output<void>();

  orgaoSelecionado = signal<OrgaoDestino>('seinfra');
  textoCopiado = signal(false);

  readonly dataHoje = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  readonly orgaoAtual = computed(() => ORGAOS[this.orgaoSelecionado()]);

  readonly linkWhatsapp = computed(() => {
    const o = this.ocorrencia();
    const org = this.orgaoAtual();
    const msg = encodeURIComponent(
      `*OFÍCIO CIDADÃO - CONQUISTA DAS ÁGUAS*\n` +
      `Protocolo: ${o.protocolo || 'VDC-2026'}\n` +
      `Destinatário: ${org.nome}\n` +
      `Bairro: ${o.bairro} (Vitória da Conquista - BA)\n` +
      `Tipo: ${o.tipo} (Gravidade: ${o.gravidade.toUpperCase()})\n` +
      `Descrição: ${o.descricao}\n\n` +
      `Solicitamos vistoria técnica e providências urgentes conforme Lei Federal 11.445/07.`,
    );
    return `https://wa.me/${org.whatsapp}?text=${msg}`;
  });

  aoMudarOrgao(event: Event): void {
    const val = (event.target as HTMLSelectElement).value as OrgaoDestino;
    this.orgaoSelecionado.set(val);
  }

  copiarTexto(): void {
    const o = this.ocorrencia();
    const org = this.orgaoAtual();
    const texto = `OFÍCIO CIDADÃO DE REIVINDICAÇÃO PÚBLICA\n` +
      `PLATAFORMA CONQUISTA DAS ÁGUAS • VITÓRIA DA CONQUISTA - BA\n` +
      `Protocolo: ${o.protocolo || 'VDC-2026'}\n` +
      `Data: Vitória da Conquista - BA, ${this.dataHoje}\n\n` +
      `${org.cargo}\n` +
      `${org.nome}\n\n` +
      `ASSUNTO: Solicitação Urgente de Intervenção Técnica em ${o.tipo} no Bairro ${o.bairro}\n\n` +
      `Prezados(as) Senhores(as),\n\n` +
      `Vimos requerer providências imediatas quanto à ocorrência registrada pela comunidade:\n` +
      `- Bairro: ${o.bairro}\n` +
      `- Fato: ${o.tipo} (Gravidade: ${o.gravidade.toUpperCase()})\n` +
      `- Descrição: "${o.descricao}"\n` +
      `- Data de registro: ${o.data}\n\n` +
      `Fundamentação: Artigo 225 da CF/88 e Lei Federal 11.445/2007 (Marco Legal do Saneamento Básico).\n\n` +
      `Atenciosamente,\n` +
      `Comunidade Conquista das Águas`;

    navigator.clipboard.writeText(texto).then(() => {
      this.textoCopiado.set(true);
      setTimeout(() => this.textoCopiado.set(false), 3000);
    });
  }

  imprimir(): void {
    window.print();
  }
}
