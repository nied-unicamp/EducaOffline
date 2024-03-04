import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CoursesHomeEnterComponent } from './courses-home-enter.component';


describe('CoursesHomeEnterComponent', () => {
  let component: CoursesHomeEnterComponent;
  let fixture: ComponentFixture<CoursesHomeEnterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CoursesHomeEnterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesHomeEnterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
