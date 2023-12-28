import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Week } from '../models/week';
import { Observable, from, map } from 'rxjs';
import { mapIdField } from '../helpers/response-map.helper';

@Injectable({
	providedIn: 'root'
})
export class WeekService {

	constructor(private firestore: Firestore) { }

	public saveWeek(workoutId: string, phaseId: string, week: Week) {
		const phaseDocRef = doc(this.firestore, 'workouts', workoutId, 'phases', phaseId);
		const weeksCollectionRef = collection(phaseDocRef, 'weeks');
		return from(addDoc(weeksCollectionRef, week));
	}

	public saveWeeks(workoutId: string, phaseId: string, weeks: Week[]) {
		const phaseDocRef = doc(this.firestore, 'workouts', workoutId, 'phases', phaseId);
		const weeksCollectionRef = collection(phaseDocRef, 'weeks');
		return from(Promise.all(weeks.map(week => addDoc(weeksCollectionRef, week))));
	}

	public updateWeek(workoutId: string, phaseId: string, weekId: string, week: Partial<Week>) {
		const weekDocRef = doc(this.firestore, 'workouts', workoutId, 'phases', phaseId, 'weeks', weekId);
		return from(updateDoc(weekDocRef, week));
	}

	public deleteWeek(workoutId: string, phaseId: string, weekId: string) {
		const weekDocRef = doc(this.firestore, 'workouts', workoutId, 'phases', phaseId, 'weeks', weekId);
		return from(deleteDoc(weekDocRef));
	}

	public getWeekById(workoutId: string, phaseId: string, weekId: string): Observable<Week> {
		const weekDocRef = doc(this.firestore, 'workouts', workoutId, 'phases', phaseId, 'weeks', weekId);
		return from(getDoc(weekDocRef)).pipe(
			map(weekDoc => {
				if (!weekDoc.exists()) {
					throw new Error('Week not found');
				}
				return mapIdField<Week>(weekDoc);
			})
		);
	}
}
