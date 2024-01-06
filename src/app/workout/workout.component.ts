import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../services/workout.service';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { take } from 'rxjs';
import { Workout } from '../models/workout';
import { PhaseService } from '../services/phase.service';
import { NotificationService } from '../services/notification.service';
import { StorageService } from '../services/storage.service';
import { WeekService } from '../services/week.service';
import { Week } from '../models/week';
import { DialogService } from '../services/dialog.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ControlsOf } from '../helpers/form-group-type';
import { Exercise } from '../models/exercise';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.scss'
})
export class WorkoutComponent implements OnInit {
	workout: Workout | null = null;
	selectedTabIndex: number = 0;
	isLoading: boolean = false;

	fullViewer: boolean = false;
	viewerExerciseId: string | null = null;
	viewerPhaseId: string | null = null;	

	constructor(private workoutService: WorkoutService, private route: ActivatedRoute, private phaseService: PhaseService, private weekService: WeekService) {}

	ngOnInit() {
		const workoutId = this.route.snapshot.paramMap.get('id');
		if(!workoutId) {
			AppComponent.app.router.navigate(['']);
			return;
		}
		this.isLoading = true;
		this.workoutService.getCompleteWorkoutById(workoutId).pipe(take(1)).subscribe(workout => {
			
			this.workout = workout;
			this.isLoading = false;
			if(this.route.snapshot.queryParamMap.keys.length > 0) {
				this.selectedTabIndex = this.workout.phases?.findIndex(p => p.id === this.route.snapshot.queryParamMap.get('phaseId')!)!;
				this.openViewer(this.route.snapshot.queryParamMap.get('phaseId')!, this.route.snapshot.queryParamMap.get('exerciseId')!);
				AppComponent.app.router.navigate([], { queryParams: {} });
			}
		});
	}
	
	deletePhase(id: string) {
		DialogService.showConfirmationDialog(
			() => {
				this.phaseService.deletePhase(this.workout!.id!, id).pipe(take(1)).subscribe(() => {
					this.workout = { ...this.workout!, phases: this.workout!.phases!.filter(p => p.id !== id) };
					NotificationService.show('Phase deleted');
				})
			}
		)
	}

	selectTab(tabIndex: number) {
		this.selectedTabIndex = tabIndex;
	}

	addWeek() {
		const week: Week = {
			name: `Week ${this.workout!.phases![this.selectedTabIndex].weeks!.length + 1}`,
			description: ''
		}
		this.weekService.saveWeek(this.workout?.id!, this.workout?.phases![this.selectedTabIndex].id!, week).pipe(take(1)).subscribe((addedWeek) => {
			week.id = addedWeek.id;
			this.workout!.phases![this.selectedTabIndex].weeks!.push(week);
			NotificationService.show('Week added');
		});
	}

	onDeleteWeek(weekId: string) {
		this.workout!.phases![this.selectedTabIndex].weeks = this.workout!.phases![this.selectedTabIndex].weeks!.filter(w => w.id !== weekId);
	}

	openViewer(phaseId: string, exerciseId: string) {
		this.fullViewer = true;
		this.viewerExerciseId = exerciseId;
		this.viewerPhaseId = phaseId;
	}

	closeViewer() {
		this.fullViewer = false;
	}
}
