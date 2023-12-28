import { Component, Input } from '@angular/core';
import { Week } from 'src/app/models/week';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrl: './week.component.scss'
})
export class WeekComponent {
	@Input('week') week: Week | null = null;
	@Input('phaseId') phaseId?: string | null = null;

	openViewer(exerciseId: string) {
		console.log('exerciseId: ', exerciseId);
	}
}
