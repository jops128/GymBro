import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../services/workout.service';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { take } from 'rxjs';
import { Workout } from '../models/workout';
import { PhaseService } from '../services/phase.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.scss'
})
export class WorkoutComponent implements OnInit {
	workout: Workout | null = null;
	selectedTabIndex: number = 0;
	isLoading: boolean = false;

	constructor(private workoutService: WorkoutService, private route: ActivatedRoute, private phaseService: PhaseService) {}

	ngOnInit() {
		const workoutId = this.route.snapshot.paramMap.get('id');
		if(!workoutId) {
			AppComponent.app.router.navigate(['']);
			return;
		}
		this.isLoading = true;
		this.workoutService.getCompleteWorkoutById(workoutId).pipe(take(1)).subscribe(workout => {
			console.log('workout: ', workout);
			this.workout = workout;
			this.isLoading = false;
		});
	}
	
	deletePhase(id: string) {
		this.phaseService.deletePhase(this.workout!.id!, id).pipe(take(1)).subscribe(() => {
			this.workout = { ...this.workout!, phases: this.workout!.phases!.filter(p => p.id !== id) };
			NotificationService.show('Phase deleted');
		});
	}

	selectTab(tabIndex: number) {
		this.selectedTabIndex = tabIndex;
	}
}
