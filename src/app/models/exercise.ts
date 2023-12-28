export interface Exercise {
	id?: string | null;
	name: string | null;
	warmUpSets: string | null;
	workingSets: string | null;
	reps: string | null;
	load: string | null;
	previousLoad: string | null;
	rpe: string | null;
	rest: string | null;
	substitutionOne: string | null;
	substitutionTwo: string | null;
	notes: string | null;
}