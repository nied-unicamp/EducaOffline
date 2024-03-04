import { inject, TestBed } from '@angular/core/testing';
import { CanLoginGuard } from './can-login.guard';


describe('CanLoginGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CanLoginGuard]
        });
    });

    it('should ...', inject([CanLoginGuard], (guard: CanLoginGuard) => {
        expect(guard).toBeTruthy();
    }));
});
