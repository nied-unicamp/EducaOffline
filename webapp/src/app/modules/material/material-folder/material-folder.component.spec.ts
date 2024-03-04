import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialFolderComponent } from './material-folder.component';

describe('MaterialFolderComponent', () => {
  let component: MaterialFolderComponent;
  let fixture: ComponentFixture<MaterialFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
