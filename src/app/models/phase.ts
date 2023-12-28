import { Exercise } from './exercise';

export interface Phase {
	id: string;
	workoutId: string;
	name: string;
	description: string;
	exercises: Exercise[];
}