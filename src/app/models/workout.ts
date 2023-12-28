import { Phase } from './phase';

export interface Workout {
	id?: string | null;
	name: string | null;
	description: string | null;
	phases?: Phase[] | null;
}