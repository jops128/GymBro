import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable, forkJoin, from, map, switchMap } from 'rxjs';
import { Phase } from '../models/phase';
import { mapIdField } from '../helpers/response-map.helper';

@Injectable({
	providedIn: 'root'
})
export class PhaseService {

	constructor(private firestore: Firestore) { }

	public savePhase(workoutId: string, phase: Phase) {
		const workoutDocRef = doc(this.firestore, 'workouts', workoutId);
		const phasesCollectionRef = collection(workoutDocRef, 'phases');
		return from(addDoc(phasesCollectionRef, phase));
	}

	public updatePhase(workoutId: string, phaseId: string, phase: Partial<Phase>) {
		const phaseDocRef = doc(this.firestore, 'workouts', workoutId, 'phases', phaseId);
		return from(updateDoc(phaseDocRef, phase));
	}

	public deletePhase(workoutId: string, phaseId: string) {
		const phaseDocRef = doc(this.firestore, 'workouts', workoutId, 'phases', phaseId);
		return from(deleteDoc(phaseDocRef));
	}

	public getPhaseById(workoutId: string, phaseId: string): Observable<Phase> {
		const phaseDocRef = doc(this.firestore, 'workouts', workoutId, 'phases', phaseId);
		return from(getDoc(phaseDocRef)).pipe(
			switchMap(phaseDoc => {
				if (!phaseDoc.exists()) {
					throw new Error('Phase not found');
				}
				const phase = mapIdField<Phase>(phaseDoc);
				const weeksCollectionRef = collection(phaseDoc.ref, 'weeks');
				return from(getDocs(weeksCollectionRef)).pipe(
					map(weeksSnapshot => {
						return { ...phase, numberOfWeeks: weeksSnapshot.size };
					})
				);
			})
		);
	}
}
