import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './services/notification.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public static app: AppComponent;
	title = 'workout-app';

	constructor(public router: Router, public notificationService: NotificationService) {
		AppComponent.app = this;
	}
}
