import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { EditWorkoutComponent } from './workout/edit-workout/edit-workout.component';
import { WorkoutComponent } from './workout/workout.component';
import { EditPhaseComponent } from './workout/edit-phase/edit-phase.component';
import { EditExerciseComponent } from './workout/week/edit-exercise/edit-exercise.component';

const routes: Routes = [
	{
		path: '', component: LayoutComponent, canActivate: [authGuard], children: [
			{ path: '', component: HomeComponent },
			{ path: 'workout/:id/week/:weekId/:phaseId/exercise-edit/:exerciseId', component: EditExerciseComponent },
			{ path: 'workout/:id/week/:weekId/:phaseId/exercise-add', component: EditExerciseComponent },
			{ path: 'workout/:id/phase-edit/:phaseId', component: EditPhaseComponent },
			{ path: 'workout/:id/phase-add', component: EditPhaseComponent },
			{ path: 'workout/:id', component: WorkoutComponent },
			{ path: 'workout-add', component: EditWorkoutComponent },
			{ path: 'workout-edit/:id', component: EditWorkoutComponent }
		]
	},
	{ path: 'login', component: LoginComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
