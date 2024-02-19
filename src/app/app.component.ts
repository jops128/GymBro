import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { StorageService } from './services/storage.service';
import { DialogService } from './services/dialog.service';
import { phase1, phase2, phase3 } from 'src/assets/seedData';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public static app: AppComponent;
	title = 'workout-app';
	@ViewChild('areYouSure') areYouSure: TemplateRef<any> | undefined;
	constructor(public router: Router, public notificationService: NotificationService, public dialogService: DialogService) {
		AppComponent.app = this;
		AppComponent.navigateToLastSavedExercise();
		// this.formatSeedData();
		this.assignDate();
	}

	public static navigateToLastSavedExercise() {
		const lastOpenedExercise = StorageService.getLastOpenedExercise();
		if (lastOpenedExercise) {
			AppComponent.app.router.navigate(['workout', lastOpenedExercise.workoutId], { queryParams: { phaseId: lastOpenedExercise.phaseId, exerciseId: lastOpenedExercise.exerciseId } });
		}
	}

	public formatSeedData() {
		const categories = ['Legs', 'Push', 'Pull', 'Full Body','Legs', 'Push', 'Pull', 'Full Body','Legs', 'Push', 'Pull', 'Full Body'];
		const chunkSizes = [6, 7, 8, 7, 6, 7, 8, 7, 6, 7, 8, 6];
		let chunkIndex = 0;
		let categoryIndex = 0;
		const data = phase3;

		data.forEach((workout) => {
		  workout.category = categories[categoryIndex];
		  chunkIndex++;
	  
		  if (chunkIndex === chunkSizes[categoryIndex]) {
			chunkIndex = 0;
			categoryIndex++;
	  
			if (categoryIndex === categories.length) {
			  categoryIndex ++;
			}
		  }
		});
	  
		console.log(data);
	}

	public assignDate() {
		const date = new Date();
		[...phase1].forEach((workout) => {
			workout.createdDate = new Date(date);
			date.setSeconds(date.getSeconds() + 1);
		});

		// console.log("phase1: ", phase1);
		// console.log("phase2: ", phase2);
		console.log("phase3: ", phase1);
	}
}
