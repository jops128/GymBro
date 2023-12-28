import { Exercise } from './exercise';

export interface Week {
	id?: string | null;	
	name: string | null;
	description: string | null;
	exercises: Exercise[] | null;
}