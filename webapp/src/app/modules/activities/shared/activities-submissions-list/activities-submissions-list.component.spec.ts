import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivitiesSubmissionsListComponent } from './activities-submissions-list.component';


describe('ActivitiesSubmissionsListComponent', () => {
  let component: ActivitiesSubmissionsListComponent;
  let fixture: ComponentFixture<ActivitiesSubmissionsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesSubmissionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesSubmissionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
