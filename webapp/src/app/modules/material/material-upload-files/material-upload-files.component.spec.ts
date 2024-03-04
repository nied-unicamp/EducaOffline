import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialUploadFilesComponent } from './material-upload-files.component';

describe('MaterialUploadFilesComponent', () => {
  let component: MaterialUploadFilesComponent;
  let fixture: ComponentFixture<MaterialUploadFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialUploadFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialUploadFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
