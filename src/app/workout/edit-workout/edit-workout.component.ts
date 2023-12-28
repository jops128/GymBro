import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
  selector: 'app-edit-workout',
  templateUrl: './edit-workout.component.html',
  styleUrl: './edit-workout.component.scss'
})
export class EditWorkoutComponent implements OnInit {
	public workoutForm: FormGroup = new FormGroup({
		id: new FormControl(''),
		name: new FormControl(''),
		description: new FormControl('')
	});
	public workoutId: string | null = null;

	constructor(private route: ActivatedRoute, private workoutService: WorkoutService) {}

	ngOnInit() {
		this.workoutId = this.route.snapshot.paramMap.get('id');

		if(this.workoutId) {
			this.workoutService.getWorkoutById(this.workoutId).pipe(take(1)).subscribe(workout => {
				this.workoutForm.patchValue(workout);
			});
		}
	}

	public saveWorkout() {
		if(this.workoutId) {
			this.workoutService.updateWorkout(this.workoutId, this.workoutForm.value).pipe(take(1)).subscribe(() => {
				this.workoutForm.reset();
			});
			return;
		}

		this.workoutService.saveWorkout(this.workoutForm.value).pipe(take(1)).subscribe(() => {
			this.workoutForm.reset();
		});
	}
}
