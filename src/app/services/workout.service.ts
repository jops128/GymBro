import { Injectable } from '@angular/core';
import { Workout } from '../models/workout';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable, forkJoin, from, map, of, switchMap } from 'rxjs';
import { mapIdField } from '../helpers/response-map.helper';
import { Phase } from '../models/phase';
import { Week } from '../models/week';
import { Exercise } from '../models/exercise';
import { StorageService } from './storage.service';

@Injectable({
	providedIn: 'root'
})
export class WorkoutService {

	constructor(private firestore: Firestore) { }

	public saveWorkout(workout: Workout) {
		workout.userId = StorageService.getUser()?.uid!;
		return from(addDoc(collection(this.firestore, "workouts"), workout));
	}

	public updateWorkout(id: string, workout: Partial<Workout>) {
		workout.userId = StorageService.getUser()?.uid!;
		return from(updateDoc(doc(this.firestore, "workouts", id), workout));
	}

	public deleteWorkout(id: string) {
		return from(deleteDoc(doc(this.firestore, "workouts", id)));
	}

	public getAllWorkouts(): Observable<Workout[]> {
		const workoutsCollectionRef = collection(this.firestore, 'workouts');
		const queryRef = query(workoutsCollectionRef, where('userId', '==', StorageService.getUser()?.uid));
		return from(getDocs(queryRef)).pipe(
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
				const workoutData = mapIdField<Workout>(workoutDoc);
				const phasesCollectionRef = collection(workoutDocRef, 'phases');
				return from(getDocs(phasesCollectionRef)).pipe(
					switchMap(phaseDocsSnapshot => {
						if (phaseDocsSnapshot.empty) {
							return of({ ...workoutData, phases: [] });
						}
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
												exercises.sort((a, b) => a.createdDate! > b.createdDate! ? 1 : -1)
												return { ...weekData, exercises };
											})
										);
									});
									return weekPromises.length > 0 ? forkJoin(weekPromises) : of([]);
								}),
								map(weeks => {
									weeks.sort((a, b) => a.name!.localeCompare(b.name!));
									return { ...phaseData, weeks };
								})
							);
						});
						return forkJoin(phasePromises).pipe(
							map(phases => {
								phases.sort((a, b) => a.createdDate! > b.createdDate! ? 1 : -1);
								return { ...workoutData, phases };
							})
						);
					})
				);
			})
		);
	}
}
