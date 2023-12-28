import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Exercise } from '../models/exercise';
import { Observable, from, map } from 'rxjs';
import { mapIdField } from '../helpers/response-map.helper';

@Injectable({
	providedIn: 'root'
})
export class ExerciseService {

	constructor(private firestore: Firestore) { }

	public saveExercise(workoutId: string, phaseId: string, weekId: string, exercise: Exercise) {
		const exerciseCollectionRef = collection(this.firestore, 'workouts', workoutId, 'phases', phaseId, 'weeks', weekId, 'exercises');
		return from(addDoc(exerciseCollectionRef, exercise));
	}

	public updateExercise(workoutId: string, phaseId: string, weekId: string, exerciseId: string, exercise: Partial<Exercise>) {
		const exerciseDocRef = doc(this.firestore, 'workouts', workoutId, 'phases', phaseId, 'weeks', weekId, 'exercises', exerciseId);
		return from(updateDoc(exerciseDocRef, exercise));
	}

	public deleteExercise(workoutId: string, phaseId: string, weekId: string, exerciseId: string) {
		const exerciseDocRef = doc(this.firestore, 'workouts', workoutId, 'phases', phaseId, 'weeks', weekId, 'exercises', exerciseId);
		return from(deleteDoc(exerciseDocRef));
	}

	public getExerciseById(workoutId: string, phaseId: string, weekId: string, exerciseId: string): Observable<Exercise> {
		const exerciseDocRef = doc(this.firestore, 'workouts', workoutId, 'phases', phaseId, 'weeks', weekId, 'exercises', exerciseId);
		return from(getDoc(exerciseDocRef)).pipe(
			map(exerciseDoc => {
				if (!exerciseDoc.exists()) {
					throw new Error('Exercise not found');
				}
				return mapIdField<Exercise>(exerciseDoc);
			})
		);
	}
}
