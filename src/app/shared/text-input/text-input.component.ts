import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { InputBaseComponent } from '../input-base/input-base.component';

@Component({
  selector: 'text-input',
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent extends InputBaseComponent implements OnInit {
	@Input('isPassword') isPassword: boolean = false;
	hide = true;
	hasLink: boolean = false;

	constructor() {
		super();
	}

	override ngOnInit(): void {
		switch (this.name) {
		  case 'name':
			this.hasLink = this.formGroup!.get('link') !== null && this.formGroup!.get('link')!.value !== '' && this.name === 'name';
			break;
		  case 'substitutionOne':
			this.hasLink = this.formGroup!.get('substitutionOneLink') !== null && this.formGroup!.get('substitutionOneLink')!.value !== '' && this.name === 'substitutionOne';
			break;
		  case 'substitutionTwo':
			this.hasLink = this.formGroup!.get('substitutionTwoLink') !== null && this.formGroup!.get('substitutionTwoLink')!.value !== '' && this.name === 'substitutionTwo';
			break;
		  default:
			this.hasLink = false;
		}
	}

	navigateToLink() {
		window.open(this.formGroup!.get('link')!.value, '_blank');
	}
}
