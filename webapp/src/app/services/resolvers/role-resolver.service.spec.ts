import { TestBed } from '@angular/core/testing';
import { RoleResolverService } from './role-resolver.service';


describe('RoleResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoleResolverService = TestBed.inject(RoleResolverService);
    expect(service).toBeTruthy();
  });
});
