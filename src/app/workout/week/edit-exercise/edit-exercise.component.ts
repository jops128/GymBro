import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { ControlsOf } from 'src/app/helpers/form-group-type';
import { Exercise } from 'src/app/models/exercise';
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'app-edit-exercise',
  templateUrl: './edit-exercise.component.html',
  styleUrl: './edit-exercise.component.scss'
})
export class EditExerciseComponent implements OnInit {
	public form = new FormGroup<ControlsOf<Exercise>>({
		name: new FormControl('', Validators.required),
		warmUpSets: new FormControl('', Validators.required),
		workingSets: new FormControl('', Validators.required),
		reps: new FormControl('', Validators.required),
		load: new FormControl('', Validators.required),
		previousLoad: new FormControl('', Validators.required),
		rpe: new FormControl('', Validators.required),
		rest: new FormControl('', Validators.required),
		substitutionOne: new FormControl('', Validators.required),
		substitutionTwo: new FormControl('', Validators.required),
		notes: new FormControl('', Validators.required)
	});

	workoutId: string | null = null;
	phaseId: string | null = null;
	weekId: string | null = null;
	exerciseId: string | null = null;

	constructor(private route: ActivatedRoute, private exerciseService: ExerciseService) {}

	ngOnInit(): void {
		this.workoutId = this.route.snapshot.paramMap.get('id');
		this.phaseId = this.route.snapshot.paramMap.get('phaseId');
		this.weekId = this.route.snapshot.paramMap.get('weekId');
		this.exerciseId = this.route.snapshot.paramMap.get('exerciseId');

		if(this.exerciseId) {
			this.exerciseService.getExerciseById(this.workoutId!, this.phaseId!, this.weekId!, this.exerciseId!).pipe(take(1)).subscribe(exercise => {
				this.form.patchValue(exercise);
			});
		}
	}

	save() {
		const value = this.form.value as Exercise;
		if(this.exerciseId) {
			this.exerciseService.updateExercise(this.workoutId!, this.phaseId!, this.weekId!, this.exerciseId!, value).pipe(take(1)).subscribe(() => {
				AppComponent.app.router.navigate(['/workout', this.workoutId]);
			});
			return;
		}

		this.exerciseService.saveExercise(this.workoutId!, this.phaseId!, this.weekId!, value).pipe(take(1)).subscribe(() => {
			AppComponent.app.router.navigate(['/workout', this.workoutId]);
		});
	}
}
