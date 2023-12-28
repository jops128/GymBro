import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Auth, User, getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
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
				map(userCredential => userCredential.user)
			);
	}

	public logout() {
		this.auth.signOut();
		StorageService.removeUser();
		AppComponent.app.router.navigate(['/login']);
	}

}
