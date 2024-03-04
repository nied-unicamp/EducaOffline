import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSincronizacaoAndamentoComponent } from './icon-sincronizacao-andamento.component';

describe('IconSincronizacaoAndamentoComponent', () => {
  let component: IconSincronizacaoAndamentoComponent;
  let fixture: ComponentFixture<IconSincronizacaoAndamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconSincronizacaoAndamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconSincronizacaoAndamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
