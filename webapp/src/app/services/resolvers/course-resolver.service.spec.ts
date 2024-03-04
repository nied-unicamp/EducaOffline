import { TestBed } from '@angular/core/testing';

import { CourseResolverService } from './course-resolver.service';

describe('CourseResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CourseResolverService = TestBed.inject(CourseResolverService);
    expect(service).toBeTruthy();
  });
});
