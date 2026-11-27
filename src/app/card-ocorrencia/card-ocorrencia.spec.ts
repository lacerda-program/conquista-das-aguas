import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardOcorrencia } from './card-ocorrencia';

describe('CardOcorrencia', () => {
  let component: CardOcorrencia;
  let fixture: ComponentFixture<CardOcorrencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardOcorrencia],
    }).compileComponents();

    fixture = TestBed.createComponent(CardOcorrencia);
    fixture.componentRef.setInput('ocorrencia', {
      id: 1,
      tipo: 'Alagamento',
      bairro: 'Centro',
      descricao: 'Teste',
      gravidade: 'baixa',
      resolvida: false,
      data: '27/11/2026',
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
