import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaterialLinkComponent } from './material-link.component';

describe('MaterialLinkComponent', () => {
  let component: MaterialLinkComponent;
  let fixture: ComponentFixture<MaterialLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
