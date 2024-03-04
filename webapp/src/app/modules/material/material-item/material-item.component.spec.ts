import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaterialItemComponent } from './material-item.component';

describe('MaterialItemComponent', () => {
  let component: MaterialItemComponent;
  let fixture: ComponentFixture<MaterialItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
