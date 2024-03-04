import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaterialCreateLinkComponent } from './material-create-link.component';

describe('MaterialCreateLinkComponent', () => {
  let component: MaterialCreateLinkComponent;
  let fixture: ComponentFixture<MaterialCreateLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialCreateLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialCreateLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
