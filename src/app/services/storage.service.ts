import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import { LastOpenedExercise } from '../models/last-opened-exercise';

const USER_KEY = 'user';
const LAST_OPENED_EXERCISE_KEY = 'lastOpenedExercise';

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

	static removeUser() {
		localStorage.removeItem(USER_KEY);
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
