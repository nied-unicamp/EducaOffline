import { TestBed } from '@angular/core/testing';

import { ActivityResolverService } from './activity-resolver.service';

describe('ActivityResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityResolverService = TestBed.inject(ActivityResolverService);
    expect(service).toBeTruthy();
  });
});
