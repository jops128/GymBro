import { Injectable } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Observable, from, map } from 'rxjs';
import { AppComponent } from '../app.component';
import { StorageService } from './storage.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(private auth: Auth) { }

	public login(email: string, password: string): Observable<User> {		
		return from(signInWithEmailAndPassword(this.auth, email, password))
			.pipe(
				map(userCredential => {
					StorageService.setToken(userCredential.user)
					return userCredential.user
				})
			);
	}

	public refreshToken() {
		return from(this.auth.currentUser?.getIdToken(true) ?? Promise.resolve(null)).pipe(map(token => {
			StorageService.setToken(this.auth.currentUser!);
			return !!token;
		}));
	}

	public logout() {
		this.auth.signOut();
		StorageService.logout();
		AppComponent.app.router.navigate(['/login']);
	}

}
