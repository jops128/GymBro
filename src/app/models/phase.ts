import { Exercise } from './exercise';
import { Week } from './week';

export interface Phase {
	id?: string | null;
	name: string | null;
	description: string | null;
	weeks?: Week[] | null;
	readonly numberOfWeeks?: number;
}