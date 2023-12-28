import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

	form: FormGroup = new FormGroup({
		email: new FormControl(''),
		password: new FormControl(''),
	});

	constructor(private authService: AuthService, private router: Router) {

	}

	public login() {
		this.authService.login(this.form.value.email, this.form.value.password).pipe(take(1)).subscribe((val) => {
			StorageService.setUser(val);
			this.router.navigate(['']);
		})
	}
}
