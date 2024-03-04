import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSincronizacaoNecessariaComponent } from './icon-sincronizacao-necessaria.component';

describe('IconSincronizacaoNecessariaComponent', () => {
  let component: IconSincronizacaoNecessariaComponent;
  let fixture: ComponentFixture<IconSincronizacaoNecessariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconSincronizacaoNecessariaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconSincronizacaoNecessariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
