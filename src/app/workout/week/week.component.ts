import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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
	@Output('openViewer') onOpenViewer = new EventEmitter<string>();
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
	reorderingEnabled: any;
	isExpanded: boolean = false;

	constructor(private exerciseService: ExerciseService, private route: ActivatedRoute, private router: Router, private weekService: WeekService) { }

	ngOnInit(): void {
		this.week?.exercises?.forEach((exercise, i, exercises) => {
			let rowspan = 1;
			while (i + rowspan < exercises.length && exercises[i + rowspan].category === exercise.category) {
				rowspan++;
			}
			(exercise as any)['rowspan'] = rowspan;
		});
		this.isExpanded = this.week?.exercises?.some((e) => e.id === StorageService.getLastOpenedExercise()?.exerciseId) ?? false;
	}

	openViewer(exerciseId: string) {
		this.onOpenViewer.emit(exerciseId);
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

	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.week!.exercises!, event.previousIndex, event.currentIndex);
		const orderedExercises = [...this.week!.exercises!].sort((a, b) => a.createdDate! > b.createdDate! ? 1 : -1).map(e => e.createdDate);
		orderedExercises.forEach((createdDate, index) => {
			this.week!.exercises![index].createdDate = createdDate;
			this.exerciseService.updateExercise(this.workoutId!, this.phaseId!, this.week!.id!, this.week!.exercises![index].id!, this.week!.exercises![index]).pipe(take(1)).subscribe();
		});
	}

	enableReordering() {
		this.reorderingEnabled = !this.reorderingEnabled;
	}
}

