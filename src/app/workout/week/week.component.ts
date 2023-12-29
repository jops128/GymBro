import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ControlsOf } from 'src/app/helpers/form-group-type';
import { Exercise } from 'src/app/models/exercise';
import { Week } from 'src/app/models/week';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrl: './week.component.scss'
})
export class WeekComponent {
	@Input('week') week: Week | null = null;
	@Input('phaseId') phaseId?: string | null = null;
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

	openViewer(index: number) {
		this.selectedExerciseIndex = index;
		this.exerciseForm.patchValue(this.week!.exercises![index]);
		this.fullViewer = true;
	}

	closeViewer() {
		this.fullViewer = false;
	}

	previous() {
		if(this.selectedExerciseIndex === 0) {
			return;
		}
		this.selectedExerciseIndex--;
		this.exerciseForm.patchValue(this.week!.exercises![this.selectedExerciseIndex]);
	}
	
	next() {
		if(this.selectedExerciseIndex === this.week!.exercises!.length - 1) {
			return;
		}
		this.selectedExerciseIndex++;
		this.exerciseForm.patchValue(this.week!.exercises![this.selectedExerciseIndex]);
	}
}
