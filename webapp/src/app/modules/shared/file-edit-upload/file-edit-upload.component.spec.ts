import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FileEditUploadComponent } from './file-edit-upload.component';

describe('FileEditUploadComponent', () => {
  let component: FileEditUploadComponent;
  let fixture: ComponentFixture<FileEditUploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FileEditUploadComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileEditUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
