import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoTranslateComponent } from './botao-translate.component';

describe('BotaoTranslateComponent', () => {
  let component: BotaoTranslateComponent;
  let fixture: ComponentFixture<BotaoTranslateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotaoTranslateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BotaoTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
