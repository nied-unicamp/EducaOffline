import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconErroSincronizacaoComponent } from './icon-erro-sincronizacao.component';

describe('IconErroSincronizacaoComponent', () => {
  let component: IconErroSincronizacaoComponent;
  let fixture: ComponentFixture<IconErroSincronizacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconErroSincronizacaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconErroSincronizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
