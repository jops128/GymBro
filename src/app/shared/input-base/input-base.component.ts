import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-input-base',
	templateUrl: './input-base.component.html',
	styleUrl: './input-base.component.scss'
})
export class InputBaseComponent implements OnInit {
	@Input({ alias: 'formGroup', required: true }) formGroup?: FormGroup;
	@Input({ alias: 'name', required: true }) name: string = '';
	@Input({ alias: 'label', required: true }) label: string = '';
	@Input({ alias: 'disabled', required: false }) disabled: boolean = false;
	public isRequired: boolean = false;

	constructor() {
	}

	ngOnInit(): void {
		this.isRequired = this.formGroup!.controls[this.name].hasValidator(Validators.required);
	}
}
