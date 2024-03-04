import { TestBed, inject } from '@angular/core/testing';

import { CourseRegisterService } from './course-register.service';

describe('CourseRegisterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseRegisterService]
    });
  });

  it('should ...', inject([CourseRegisterService], (service: CourseRegisterService) => {
    expect(service).toBeTruthy();
  }));
});
