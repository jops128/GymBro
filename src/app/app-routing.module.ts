import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { EditWorkoutComponent } from './workout/edit-workout/edit-workout.component';
import { WorkoutComponent } from './workout/workout.component';

const routes: Routes = [
	{
		path: '', component: LayoutComponent, canActivate: [authGuard], children: [
			{ path: '', component: HomeComponent },
			{ path: 'workout', component: WorkoutComponent },
			{ path: 'workout-add', component: EditWorkoutComponent },
			{ path: 'workout-edit/:id', component: EditWorkoutComponent },
		]
	},
	{ path: 'login', component: LoginComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
