import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';

@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	public static service: NotificationService;

	constructor(public _snackBar: MatSnackBar) {
	}

	public show(message: string) {
		this._snackBar.open(message, undefined, {
			duration: 2000			
		});
	}

	public static show(message: string) {
		AppComponent.app.notificationService.show(message);
	}
}
