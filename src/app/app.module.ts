import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { LayoutModule } from './layout/layout.module';
import { WorkoutComponent } from './workout/workout.component';
import { EditWorkoutComponent } from './workout/edit-workout/edit-workout.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { EditPhaseComponent } from './workout/edit-phase/edit-phase.component';
import { WeekComponent } from './workout/week/week.component';
import { EditExerciseComponent } from './workout/week/edit-exercise/edit-exercise.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextInputComponent } from './shared/text-input/text-input.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { TextAreaComponent } from './shared/text-area/text-area.component';
import { MatInputModule } from '@angular/material/input';
import { InputBaseComponent } from './shared/input-base/input-base.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from './shared/loader/loader.component';
import { FadeInDirective } from './shared/directives/fade-in.directive';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TitleComponent } from './shared/title/title.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SelectInputComponent } from './shared/select-input/select-input.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		WorkoutComponent,
		EditWorkoutComponent,
		HomeComponent,
		EditPhaseComponent,
		WeekComponent,
		EditExerciseComponent,
		TextInputComponent,
		TextAreaComponent,
		InputBaseComponent,
		LoaderComponent,
		FadeInDirective,
		TitleComponent,
		SelectInputComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		ReactiveFormsModule,
		RouterModule,
		FormsModule,
		LayoutModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatSnackBarModule,
		MatTabsModule,
		MatSelectModule,
		MatCheckboxModule,
		provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
		provideAuth(() => getAuth()),
		provideFirestore(() => getFirestore()),
		BrowserAnimationsModule
	],
	providers: [
		{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
