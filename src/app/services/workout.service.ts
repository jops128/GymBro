import { Injectable } from '@angular/core';
import { Workout } from '../models/workout';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { mapIdField } from '../helpers/response-map.helper';

@Injectable({
	providedIn: 'root'
})
export class WorkoutService {

	constructor(private firestore: Firestore) { }

	public saveWorkout(workout: Workout) {
		return from(addDoc(collection(this.firestore, "workouts"), workout));
	}

	public updateWorkout(id: string, workout: Partial<Workout>) {
		return from(updateDoc(doc(this.firestore, "workouts", id), workout));
	}

	public deleteWorkout(id: string) {
		return from(deleteDoc(doc(this.firestore, "workouts", id)));
	}

	public getAllWorkouts(): Observable<Workout[]> {
		return from(getDocs(collection(this.firestore, "workouts"))).pipe(
		  map(snapshot => snapshot.docs.map(doc => mapIdField<Workout>(doc)))
		);
	  }
	  
	  public getWorkoutById(id: string): Observable<Workout> {
		return from(getDoc(doc(this.firestore, "workouts", id))).pipe(
		  map(doc => mapIdField<Workout>(doc))
		);
	  }
}
