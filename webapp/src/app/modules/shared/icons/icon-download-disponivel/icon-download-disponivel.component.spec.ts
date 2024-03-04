import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconDownloadDisponivelComponent } from './icon-download-disponivel.component';

describe('IconDownloadDisponivelComponent', () => {
  let component: IconDownloadDisponivelComponent;
  let fixture: ComponentFixture<IconDownloadDisponivelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconDownloadDisponivelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconDownloadDisponivelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
