import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);

	const user = StorageService.getUser();
	if (user) {
	  return true;
	} else {
	  router.navigate(['login']);
	  return false;
	}
};