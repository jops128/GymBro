import { Phase } from './phase';

export interface Workout {
	id: string;
	name: string;
	description: string;
	phases: Phase[];
}