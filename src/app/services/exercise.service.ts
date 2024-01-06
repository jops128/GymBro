import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Exercise } from '../models/exercise';
import { Observable, forkJoin, from, map, of, switchMap } from 'rxjs';
import { mapIdField } from '../helpers/response-map.helper';
import { Week } from '../models/week';
import { Workout } from '../models/workout';

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

	public updateNextExercisePreviousLoad(workout: Workout, exercise: Exercise) {
		const exercises = workout.phases!.flatMap(p => p.weeks!.flatMap(w => w.exercises))! as Exercise[];
		// get exercise index
		const exerciseIndex = exercises.findIndex(e => e.id === exercise.id);
		// get next occurence of exercise
		const nextOccurence = exercises.slice(exerciseIndex + 1).filter(e => e.name === exercise.name && e.category === exercise.category);
		
		if (!nextOccurence.length) {
			return of(null);
		}
		const nextExercise = nextOccurence[0];
		const phase = workout.phases!.find(p => p.weeks!.some(w => w.exercises!.some(e => e.id === nextExercise.id)))!;
		const weekId = phase.weeks!.find(w => w.exercises!.some(e => e.id === nextExercise.id))!.id!;
		nextExercise.previousLoad = exercise.load;

		return this.updateExercise(workout.id!, phase.id!, weekId, nextExercise.id!, nextExercise);
	}
}
