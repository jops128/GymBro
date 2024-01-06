import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap, take } from 'rxjs';
import { ControlsOf } from 'src/app/helpers/form-group-type';
import { Exercise } from 'src/app/models/exercise';
import { Workout } from 'src/app/models/workout';
import { ExerciseService } from 'src/app/services/exercise.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
	selector: 'app-exercise-full-view',
	templateUrl: './exercise-full-view.component.html',
	styleUrl: './exercise-full-view.component.scss'
})
export class ExerciseFullViewComponent implements OnInit, OnDestroy {
	@Input('exerciseId') exerciseId?: string | null = null;
	@Input('phaseId') phaseId?: string | null = null;
	@Input('workout') workout?: Workout | null = null;
	@Output('onCloseViewer') onCloseViewer = new EventEmitter();

	public exerciseForm = new FormGroup<ControlsOf<Exercise>>({
		name: new FormControl('', Validators.required),
		link: new FormControl('', Validators.required),
		category: new FormControl('', Validators.required),
		warmUpSets: new FormControl('', Validators.required),
		workingSets: new FormControl('', Validators.required),
		reps: new FormControl('', Validators.required),
		load: new FormControl('', Validators.required),
		previousLoad: new FormControl('', Validators.required),
		rpe: new FormControl('', Validators.required),
		rest: new FormControl('', Validators.required),
		substitutionOne: new FormControl('', Validators.required),
		substitutionOneLink: new FormControl(''),
		substitutionTwo: new FormControl('', Validators.required),
		substitutionTwoLink: new FormControl(''),
		notes: new FormControl('', Validators.required),
		createdDate: new FormControl(new Date())
	});
	selectedExerciseIndex: number = 0;

	constructor(private exerciseService: ExerciseService) { }

	ngOnInit(): void {
		this.selectedExerciseIndex = this.allExercises.findIndex(e => e.id === this.exerciseId);
		this.patchForm();
	}

	previous(parentElement: HTMLDivElement) {
		if (this.selectedExerciseIndex === 0) {
			return;
		}
		if (this.exerciseForm.dirty) {
			const formValue = this.exerciseForm.value as Exercise;
			const exerciseId = this.allExercises.at(this.selectedExerciseIndex)?.id!
			const phaseId = this.phaseId!;
			const week = this.workout?.phases?.find(p => p.id === phaseId)?.weeks?.find(w => w.exercises?.some(e => e.id === exerciseId))!;
			this.updateExercise(phaseId, week.id!, exerciseId, formValue).
				subscribe(() => {
					const weekExerciseIndex = week.exercises?.findIndex(e => e.id === exerciseId)!;
					week.exercises!.splice(weekExerciseIndex, 1, { ...formValue, id: exerciseId });
					this.selectedExerciseIndex--;
					this.patchForm();
				});
			parentElement.scrollTo(0, 0)
			return;
		}
		this.selectedExerciseIndex--;
		this.patchForm();
		parentElement.scrollTo(0, 0)
	}

	next(parentElement: HTMLDivElement) {
		if (this.selectedExerciseIndex === this.allExercises.length - 1) {
			return;
		}

		if (this.exerciseForm.dirty) {
			const formValue = this.exerciseForm.value as Exercise;
			const exerciseId = this.allExercises.at(this.selectedExerciseIndex)?.id!
			const phaseId = this.phaseId!;
			const week = this.workout?.phases?.find(p => p.id === phaseId)?.weeks?.find(w => w.exercises?.some(e => e.id === exerciseId))!;
			this.updateExercise(phaseId, week.id!, exerciseId, formValue).subscribe(() => {
				const weekExerciseIndex = week.exercises?.findIndex(e => e.id === exerciseId)!;
				week.exercises!.splice(weekExerciseIndex, 1, { ...formValue, id: exerciseId });
				this.selectedExerciseIndex++;
				this.patchForm();
			});
			parentElement.scrollTo(0, 0)
			return;
		}
		this.selectedExerciseIndex++;
		this.patchForm();
		parentElement.scrollTo(0, 0)
	}

	updateExercise(phaseId: string, weekId: string, exerciseId: string, exercise: Exercise) {
		return this.exerciseService.updateExercise(this.workout!.id!, phaseId, weekId, exerciseId, exercise).
			pipe(
				take(1),
				switchMap(() => {
					return this.exerciseService.updateNextExercisePreviousLoad(this.workout!, { ...exercise, id: exerciseId });
				})
			)
	}

	patchForm() {
		const exercise = this.allExercises[this.selectedExerciseIndex];
		this.exerciseForm.patchValue(exercise);
		StorageService.setLastOpenedExercise(this.workout?.id!, this.currentPhaseId, exercise.id!);
		this.exerciseForm.markAsPristine();
	}

	get allExercises(): Exercise[] {
		return this.workout!.phases!.filter(p => p.id === this.phaseId).flatMap(p => p.weeks!.flatMap(w => w.exercises!))!;
	}

	get weekName(): string {
		return this.workout?.phases?.find(p => p.id === this.currentPhaseId)?.weeks?.find(w => w.exercises?.some(e => e.id === this.allExercises[this.selectedExerciseIndex].id))?.name!;
	}

	get currentPhaseId(): string {
		return this.workout?.phases?.find(p => p.weeks?.some(w => w.exercises?.some(e => e.id === this.allExercises[this.selectedExerciseIndex].id)))?.id!
	}

	closeViewer() {
		this.onCloseViewer.emit();
	}

	ngOnDestroy(): void {
		StorageService.removeLastOpenedExercise();
	}

}
