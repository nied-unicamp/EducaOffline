import { TestBed } from '@angular/core/testing';

import { UserResolverService } from './user-resolver.service';

describe('UserResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserResolverService = TestBed.inject(UserResolverService);
    expect(service).toBeTruthy();
  });
});
