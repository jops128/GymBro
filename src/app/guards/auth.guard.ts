import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const authService = inject(AuthService);
	const loginUrlTree = router.createUrlTree(['/login']);
	if (StorageService.isAuthenticated()) {
		return true;
	} else {
		return authService.refreshToken().pipe(map(isValid => {
			if (isValid) {
				return true;
			} else {
				router.navigate(['login']);
				return loginUrlTree;
			}
		}));
		// router.navigate(['login']);
		// return false;
	}
};