import { Component, Input } from '@angular/core';
import { InputBaseComponent } from '../input-base/input-base.component';

@Component({
	selector: 'select-input',
	templateUrl: './select-input.component.html',
	styleUrl: './select-input.component.scss'
})
export class SelectInputComponent extends InputBaseComponent {
	@Input({ alias: 'data', required: true }) data: string[] = [];

	constructor() {
		super();
	}
}
