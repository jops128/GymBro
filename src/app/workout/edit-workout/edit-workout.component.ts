import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { ControlsOf } from 'src/app/helpers/form-group-type';
import { Workout } from 'src/app/models/workout';
import { NotificationService } from 'src/app/services/notification.service';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
	selector: 'app-edit-workout',
	templateUrl: './edit-workout.component.html',
	styleUrl: './edit-workout.component.scss'
})
export class EditWorkoutComponent implements OnInit {
	public workoutForm: FormGroup = new FormGroup<ControlsOf<Workout>>({
		name: new FormControl(''),
		description: new FormControl(''),
		categories: new FormControl([])
	});

	public workoutId: string | null = null;
	public isLoading: boolean = false;

	constructor(private route: ActivatedRoute, private workoutService: WorkoutService) { }

	ngOnInit() {
		this.workoutId = this.route.snapshot.paramMap.get('id');
		
		if (this.workoutId) {
			this.isLoading = true;
			this.workoutService.getWorkoutById(this.workoutId).pipe(take(1)).subscribe(workout => {
				this.workoutForm.patchValue(workout);
				this.isLoading = false;
			});
		}
	}

	public saveWorkout() {
		if (this.workoutId) {
			this.workoutService.updateWorkout(this.workoutId, this.workoutForm.value).pipe(take(1)).subscribe(() => {
				NotificationService.show('Workout updated')				
			});
			return;
		}

		this.workoutService.saveWorkout(this.workoutForm.value).pipe(take(1)).subscribe(() => {
			AppComponent.app.router.navigate(['/']);
			NotificationService.show('Workout saved')
		});
	}

	public addCategory() {
		const categories = this.workoutForm.get('categories') as FormControl;
		categories.setValue([...categories.value, '']);
	}
}
