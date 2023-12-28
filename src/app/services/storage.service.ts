import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';

const USER_KEY = 'user';

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
}
