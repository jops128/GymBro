import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { StorageService } from './services/storage.service';

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
		AppComponent.navigateToLastSavedExercise();
	}

	public static navigateToLastSavedExercise() {
		const lastOpenedExercise = StorageService.getLastOpenedExercise();
		if (lastOpenedExercise) {
			AppComponent.app.router.navigate(['workout', lastOpenedExercise.workoutId], { queryParams: { phaseId: lastOpenedExercise.phaseId, exerciseId: lastOpenedExercise.exerciseId } });
		}
	}
}
