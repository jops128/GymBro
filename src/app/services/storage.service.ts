import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import { LastOpenedExercise } from '../models/last-opened-exercise';
import { JwtPayload, jwtDecode } from 'jwt-decode';

const USER_KEY = 'user';
const LAST_OPENED_EXERCISE_KEY = 'lastOpenedExercise';
const TOKEN_KEY = 'token';

@Injectable({
	providedIn: 'root'
})
export class StorageService {
	

	constructor() { }

	public static setUser(user: User) {
		localStorage.setItem(USER_KEY, JSON.stringify(user));
	}
	
	public static getUser(): User | null{
		if(localStorage.getItem(USER_KEY) == null) return null;
		return JSON.parse(localStorage.getItem(USER_KEY)!);
	}

	static logout() {
		localStorage.removeItem(USER_KEY);
		localStorage.removeItem(TOKEN_KEY);
	}

	public static setToken(user: User) {
		user?.getIdToken().then(token => {
			localStorage.setItem(TOKEN_KEY, token);
		});
	}

	public static getToken(): string | null {
		return localStorage.getItem(TOKEN_KEY);
	}

	public static isAuthenticated(): boolean {
		const token = StorageService.getToken();
		if(token) {
			const decodedToken: JwtPayload = jwtDecode(token);
			const currentTime = Date.now().valueOf() / 1000;
			return decodedToken && decodedToken.exp! > currentTime				
		}

		return false;
	}

	static setLastOpenedExercise(workoutId: string, phaseId: string, exerciseId: string) {
		const lastOpenedExercise: LastOpenedExercise = {
			workoutId,
			phaseId,
			exerciseId
		};

		localStorage.setItem(LAST_OPENED_EXERCISE_KEY, JSON.stringify(lastOpenedExercise));
	}

	static getLastOpenedExercise(): LastOpenedExercise | null {
		if(localStorage.getItem(LAST_OPENED_EXERCISE_KEY) == null) return null;
		return JSON.parse(localStorage.getItem(LAST_OPENED_EXERCISE_KEY)!);
	}

	static removeLastOpenedExercise() {
		localStorage.removeItem(LAST_OPENED_EXERCISE_KEY);
	}
}
