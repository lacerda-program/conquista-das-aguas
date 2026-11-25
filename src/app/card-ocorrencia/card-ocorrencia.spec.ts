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
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
