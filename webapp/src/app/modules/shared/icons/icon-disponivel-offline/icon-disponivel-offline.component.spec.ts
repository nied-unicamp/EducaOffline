import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconDisponivelOfflineComponent } from './icon-disponivel-offline.component';

describe('IconDisponivelOfflineComponent', () => {
  let component: IconDisponivelOfflineComponent;
  let fixture: ComponentFixture<IconDisponivelOfflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconDisponivelOfflineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconDisponivelOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
