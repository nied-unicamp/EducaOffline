import { TestBed } from '@angular/core/testing';

import { MembersService } from './members.service';

describe('MembersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MembersService = TestBed.inject(MembersService);
    expect(service).toBeTruthy();
  });
});
