import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialCreateFolderComponent } from './material-create-folder.component';

describe('MaterialCreateFolderComponent', () => {
  let component: MaterialCreateFolderComponent;
  let fixture: ComponentFixture<MaterialCreateFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialCreateFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialCreateFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
