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

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.scss'
})
export class WorkoutComponent implements OnInit {
	workout: Workout | null = null;
	selectedTabIndex: number = 0;
	isLoading: boolean = false;
	selectedIndex: number = 0;

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
				this.selectedIndex = this.workout.phases?.findIndex(p => p.id === this.route.snapshot.queryParamMap.get('phaseId')!)!;
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
}
