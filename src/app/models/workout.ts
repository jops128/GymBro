import { Phase } from './phase';

export interface Workout {
	id?: string | null;
	name: string | null;
	userId?: string | null;
	description: string | null;
	categories?: string[] | null;
	phases?: Phase[] | null;
}