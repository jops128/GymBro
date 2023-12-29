import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-base',
  templateUrl: './input-base.component.html',
  styleUrl: './input-base.component.scss'
})
export class InputBaseComponent implements OnInit {
	@Input('formGroup') formGroup?: FormGroup;
	@Input('name') name: string = '';
	@Input('label') label: string = '';
	@Input('disabled') disabled: boolean = false;
	public isRequired: boolean = false;

	constructor() {
	}
	
	ngOnInit(): void {
		this.isRequired = this.formGroup!.controls[this.name].hasValidator(Validators.required);
	}
}
