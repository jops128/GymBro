import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { ControlsOf } from 'src/app/helpers/form-group-type';
import { UIUtility } from 'src/app/helpers/ui-utility';
import { Exercise } from 'src/app/models/exercise';
import { Week } from 'src/app/models/week';
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
	selector: 'app-week',
	templateUrl: './week.component.html',
	styleUrl: './week.component.scss'
})
export class WeekComponent {
	@Input('week') week: Week | null = null;
	@Input('phaseId') phaseId?: string | null = null;
	@Input('workoutId') workoutId?: string | null = null;
	fullViewer: boolean = false;
	selectedExerciseIndex: number = 0;

	public exerciseForm = new FormGroup<ControlsOf<Exercise>>({
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

	constructor(private exerciseService: ExerciseService) { }

	openViewer(index: number) {
		this.selectedExerciseIndex = index;
		this.exerciseForm.patchValue(this.week!.exercises![index]);
		this.fullViewer = true;
	}

	closeViewer() {
		this.fullViewer = false;
	}

	previous() {
		if (this.selectedExerciseIndex === 0) {
			return;
		}

		if (this.exerciseForm.dirty) {
			const formValue = this.exerciseForm.value as Exercise;
			const exerciseId = this.week?.exercises?.at(this.selectedExerciseIndex)?.id!
			this.exerciseService.updateExercise(this.workoutId!, this.phaseId!, this.week?.id!, exerciseId, formValue).pipe(take(1)).subscribe(() => {
				this.week?.exercises?.splice(this.selectedExerciseIndex, 1, { ...formValue, id: exerciseId });
				this.selectedExerciseIndex--;
				this.exerciseForm.patchValue(this.week!.exercises![this.selectedExerciseIndex]);
				this.exerciseForm.markAsPristine();
			});
			return;
		}
		this.selectedExerciseIndex--;
		this.exerciseForm.patchValue(this.week!.exercises![this.selectedExerciseIndex]);
	}

	next() {
		if (this.selectedExerciseIndex === this.week!.exercises!.length - 1) {
			return;
		}

		if (this.exerciseForm.dirty) {
			const formValue = this.exerciseForm.value as Exercise;
			const exerciseId = this.week?.exercises?.at(this.selectedExerciseIndex)?.id!
			this.exerciseService.updateExercise(this.workoutId!, this.phaseId!, this.week?.id!, exerciseId, formValue).pipe(take(1)).subscribe(() => {
				this.week?.exercises?.splice(this.selectedExerciseIndex, 1, { ...formValue, id: exerciseId });
				this.selectedExerciseIndex++;
				this.exerciseForm.patchValue(this.week!.exercises![this.selectedExerciseIndex]);
				this.exerciseForm.markAsPristine();
			});
			return;
		}
		this.selectedExerciseIndex++;
		this.exerciseForm.patchValue(this.week!.exercises![this.selectedExerciseIndex]);
	}
}

