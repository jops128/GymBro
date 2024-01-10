import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, switchMap, take } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { ControlsOf } from 'src/app/helpers/form-group-type';
import { UIUtility } from 'src/app/helpers/ui-utility';
import { Exercise } from 'src/app/models/exercise';
import { ExerciseService } from 'src/app/services/exercise.service';
import { NotificationService } from 'src/app/services/notification.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
	selector: 'app-edit-exercise',
	templateUrl: './edit-exercise.component.html',
	styleUrl: './edit-exercise.component.scss'
})
export class EditExerciseComponent implements OnInit {
	public form = new FormGroup<ControlsOf<Exercise>>({
		name: new FormControl('', Validators.required),
		link: new FormControl(''),
		category: new FormControl('', Validators.required),
		warmUpSets: new FormControl('', Validators.required),
		workingSets: new FormControl('', Validators.required),
		reps: new FormControl('', Validators.required),
		load: new FormControl('0', Validators.required),
		previousLoad: new FormControl('0', Validators.required),
		rpe: new FormControl('', Validators.required),
		rest: new FormControl('', Validators.required),
		substitutionOne: new FormControl(''),
		substitutionOneLink: new FormControl(''),
		substitutionTwo: new FormControl(''),
		substitutionTwoLink: new FormControl(''),
		notes: new FormControl('', Validators.required),
		createdDate: new FormControl(new Date())
	});

	applyForAllWeeks: boolean = false;
	workoutId: string | null = null;
	phaseId: string | null = null;
	weekId: string | null = null;
	exerciseId: string | null = null;
	isLoading: boolean = false;
	categories = UIUtility.getWorkoutCategories();
	constructor(private route: ActivatedRoute, private exerciseService: ExerciseService, private weekService: WeekService) { }

	ngOnInit(): void {
		this.workoutId = this.route.snapshot.paramMap.get('id');
		this.phaseId = this.route.snapshot.paramMap.get('phaseId');
		this.weekId = this.route.snapshot.paramMap.get('weekId');
		this.exerciseId = this.route.snapshot.paramMap.get('exerciseId');

		if (this.exerciseId) {
			this.isLoading = true;
			this.exerciseService.getExerciseById(this.workoutId!, this.phaseId!, this.weekId!, this.exerciseId!).pipe(take(1)).subscribe(exercise => {
				this.form.patchValue(exercise);
				this.isLoading = false;
			});
		}
	}

	save() {
		const value = this.form.value as Exercise;
		if (this.exerciseId) {
			this.exerciseService.updateExercise(this.workoutId!, this.phaseId!, this.weekId!, this.exerciseId!, value).pipe(take(1)).subscribe(() => {
				NotificationService.show('Exercise updated');
				AppComponent.app.router.navigate(['/workout', this.workoutId], { queryParams: { phaseId: this.phaseId } });

			});
			return;
		}

		if (this.applyForAllWeeks) {
			this.weekService.getAllWeeks(this.workoutId!, this.phaseId!).pipe(
				take(1),
				switchMap(weeks => {
					const saveExerciseObservables = weeks.map(week =>
						this.exerciseService.saveExercise(this.workoutId!, this.phaseId!, week.id!, value).pipe(take(1))
					);
					return forkJoin(saveExerciseObservables);
				})
			).subscribe(() => {
				AppComponent.app.router.navigate(['/workout', this.workoutId], { queryParams: { phaseId: this.phaseId } });

				NotificationService.show('Exercise saved');
			});
			return;
		}

		this.exerciseService.saveExercise(this.workoutId!, this.phaseId!, this.weekId!, value).pipe(take(1)).subscribe(() => {
			AppComponent.app.router.navigate(['/workout', this.workoutId], { queryParams: { phaseId: this.phaseId } });

			NotificationService.show('Exercise saved');
		});
	}

	cancel() {
		AppComponent.app.router.navigate(['/workout', this.workoutId], { queryParams: { phaseId: this.phaseId } });
	}
}
