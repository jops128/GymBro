import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public static app: AppComponent;
	title = 'workout-app';

	constructor(public router: Router) {
		AppComponent.app = this;
	}
}
