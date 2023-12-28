import { Injectable } from '@angular/core';
import { Workout } from '../models/workout';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Observable, forkJoin, from, map, of, switchMap } from 'rxjs';
import { mapIdField } from '../helpers/response-map.helper';
import { Phase } from '../models/phase';
import { Week } from '../models/week';
import { Exercise } from '../models/exercise';

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

	public getCompleteWorkoutById(workoutId: string): Observable<Workout> {
		const workoutDocRef = doc(this.firestore, 'workouts', workoutId);
		return from(getDoc(workoutDocRef)).pipe(
		  switchMap(workoutDoc => {
			if (!workoutDoc.exists()) {
			  throw new Error('Workout not found');
			}
			const workoutData = workoutDoc.data() as Workout;
			const phasesCollectionRef = collection(workoutDocRef, 'phases');
			return from(getDocs(phasesCollectionRef)).pipe(
			  switchMap(phaseDocsSnapshot => {
				const phasePromises = phaseDocsSnapshot.docs.map(phaseDoc => {
				  const phaseData = mapIdField<Phase>(phaseDoc);
				  const weeksCollectionRef = collection(phaseDoc.ref, 'weeks');
				  return from(getDocs(weeksCollectionRef)).pipe(
					switchMap(weekDocsSnapshot => {
					  const weekPromises = weekDocsSnapshot.docs.map(weekDoc => {
						const weekData = mapIdField<Week>(weekDoc);
						const exercisesCollectionRef = collection(weekDoc.ref, 'exercises');
						return from(getDocs(exercisesCollectionRef)).pipe(
						  map(exerciseDocsSnapshot => {
							const exercises = exerciseDocsSnapshot.docs.map(exerciseDoc => mapIdField<Exercise>(exerciseDoc));
							return { ...weekData, exercises };
						  })
						);
					  });
					  return forkJoin(weekPromises).pipe(
						map(weeks => {
						  return { ...phaseData, weeks };
						})
					  );
					})
				  );
				});
				return forkJoin(phasePromises).pipe(
				  map(phases => {
					return { ...workoutData, phases };
				  })
				);
			  })
			);
		  })
		);
	  }
}
