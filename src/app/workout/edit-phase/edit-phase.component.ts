import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap, take } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { ControlsOf } from 'src/app/helpers/form-group-type';
import { Exercise } from 'src/app/models/exercise';
import { Phase } from 'src/app/models/phase';
import { Week } from 'src/app/models/week';
import { NotificationService } from 'src/app/services/notification.service';
import { PhaseService } from 'src/app/services/phase.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-edit-phase',
  templateUrl: './edit-phase.component.html',
  styleUrl: './edit-phase.component.scss'
})
export class EditPhaseComponent implements OnInit {

	public form = new FormGroup<ControlsOf<Phase>>({
		name: new FormControl('', Validators.required),
		description: new FormControl('')
	});

	public numberOfWeeks = 0;

	public phaseId: string | null = null;
	public workoutId: string | null = null;
	public isLoading: boolean = false;

	constructor(private route: ActivatedRoute, private phaseService: PhaseService, private weekService: WeekService) { }

	ngOnInit(): void {
		this.workoutId = this.route.snapshot.paramMap.get('id');
		this.phaseId = this.route.snapshot.paramMap.get('phaseId');

		if(!this.workoutId) {
			AppComponent.app.router.navigate(['/']);
			return;
		}

		if (this.phaseId) {
			this.isLoading = true;
			this.phaseService.getPhaseById(this.workoutId, this.phaseId).pipe(take(1)).subscribe(phase => {
				this.form.patchValue(phase);
				this.numberOfWeeks = phase.numberOfWeeks ?? 0;
				this.isLoading = false;
		});
		}
	}

	savePhase() {
		const value = this.form.value as Phase;
		const weeks: Week[] = [];
		for(let i = 0; i < this.numberOfWeeks; i++) {
			weeks.push({ name: `Week ${i + 1}`, description: '' } as Week);
		}

		if (this.phaseId) {
			this.phaseService.updatePhase(this.workoutId!, this.phaseId, value).pipe(take(1)).subscribe(() => {
				NotificationService.show('Phase updated');
				AppComponent.app.router.navigate(['/workout', this.workoutId]);
			});
		} else {
			this.phaseService.savePhase(this.workoutId!, value).pipe(take(1), switchMap((val) => {
				const phaseId = val.id;
				return this.weekService.saveWeeks(this.workoutId!, phaseId, weeks);
			})).subscribe(() => {
				NotificationService.show('Phase saved');
				AppComponent.app.router.navigate(['/workout', this.workoutId]);
			});
		}
	}

	cancel() {
		AppComponent.app.router.navigate(['/workout', this.workoutId]);
	}
}
