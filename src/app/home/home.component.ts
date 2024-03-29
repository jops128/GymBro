import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Workout } from '../models/workout';
import { WorkoutService } from '../services/workout.service';
import { NotificationService } from '../services/notification.service';
import { DialogService } from '../services/dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

	workouts$: Observable<Workout[]> = new Observable<Workout[]>();

	constructor(private workoutService: WorkoutService) {

	}

	ngOnInit() {
		this.workouts$ = this.workoutService.getAllWorkouts();
	}

	deleteWorkout(workoutId: string) {
		DialogService.showConfirmationDialog(
			() => {
				this.workoutService.deleteWorkout(workoutId).subscribe(() => {
					NotificationService.show('Workout deleted');
					this.workouts$ = this.workoutService.getAllWorkouts();
				});
			}
		)
	}
}
