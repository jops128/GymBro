import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from '../app.component';

@Injectable({
	providedIn: 'root'
})
export class DialogService {

	constructor(public dialog: MatDialog) {
	}

	public static showConfirmationDialog(okCallback: () => void, cancelCallback?: () => void) {
		AppComponent.app.dialogService.show(okCallback, cancelCallback);
	}

	public show(okCallback: () => void, cancelCallback?: () => void) {
		const dialogRef = this.dialog.open(AppComponent.app.areYouSure!);
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				okCallback();
			} else {
				cancelCallback ? cancelCallback() : () => { };
			}
		});
	}
}
