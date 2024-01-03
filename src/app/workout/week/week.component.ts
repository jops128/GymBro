import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { ControlsOf } from 'src/app/helpers/form-group-type';
import { UIUtility } from 'src/app/helpers/ui-utility';
import { Exercise } from 'src/app/models/exercise';
import { Week } from 'src/app/models/week';
import { DialogService } from 'src/app/services/dialog.service';
import { ExerciseService } from 'src/app/services/exercise.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
	selector: 'app-week',
	templateUrl: './week.component.html',
	styleUrl: './week.component.scss'
})
export class WeekComponent implements OnInit {
	@Input('week') week: Week | null = null;
	@Input('phaseId') phaseId?: string | null = null;
	@Input('workoutId') workoutId?: string | null = null;
	@Output('onDeleteWeek') onDeleteWeek = new EventEmitter<string>();
	fullViewer: boolean = false;
	selectedExerciseIndex: number = 0;

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
		notes: new FormControl('', Validators.required)
	});

	constructor(private exerciseService: ExerciseService, private route: ActivatedRoute, private router: Router, private weekService: WeekService) { }

	ngOnInit(): void {
		if (this.route.snapshot.queryParamMap.has('exerciseId')) {
			const index = this.week?.exercises?.findIndex(e => e.id === this.route.snapshot.queryParamMap.get('exerciseId')!);
			if (index != null && index > -1) {
				this.openViewer(index);
				this.router.navigate([], { queryParams: {} });
			}
		}
	}

	openViewer(index: number) {
		this.selectedExerciseIndex = index;
		this.exerciseForm.patchValue(this.week!.exercises![index]);
		this.fullViewer = true;
		StorageService.setLastOpenedExercise(this.workoutId!, this.phaseId!, this.week!.exercises![index].id!);
	}

	closeViewer() {
		this.fullViewer = false;
		StorageService.removeLastOpenedExercise();
	}

	previous(parentElement: HTMLDivElement) {
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
			parentElement.scrollTo(0, 0)
			return;
		}
		this.selectedExerciseIndex--;
		this.exerciseForm.patchValue(this.week!.exercises![this.selectedExerciseIndex]);
		parentElement.scrollTo(0, 0)
	}

	next(parentElement: HTMLDivElement) {
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
			parentElement.scrollTo(0, 0)
			return;
		}
		this.selectedExerciseIndex++;
		this.exerciseForm.patchValue(this.week!.exercises![this.selectedExerciseIndex]);
		parentElement.scrollTo(0, 0)
	}

	deleteWeek() {
		DialogService.showConfirmationDialog(
			() => {
				this.weekService.deleteWeek(this.workoutId!, this.phaseId!, this.week!.id!).pipe(take(1)).subscribe(() => {
					this.onDeleteWeek.emit(this.week!.id!);
					this.week = null;
					NotificationService.show('Week deleted');
				})
			}
		)
	}

	deleteExercise(exerciseId: string) {
		DialogService.showConfirmationDialog(
			() => {
				this.exerciseService.deleteExercise(this.workoutId!, this.phaseId!, this.week!.id!, exerciseId).pipe(take(1)).subscribe(() => {
					this.week?.exercises?.splice(this.selectedExerciseIndex, 1);
					this.selectedExerciseIndex = 0;
					this.exerciseForm.patchValue(this.week!.exercises![this.selectedExerciseIndex]);
					NotificationService.show('Exercise deleted');
				});
			})
	}
}

