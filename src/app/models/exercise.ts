import { AuditableEntity } from './auditable-entity';

export interface Exercise extends AuditableEntity {
	id?: string | null;
	name: string | null;
	category: string | null;
	link: string | null;
	warmUpSets: string | null;
	workingSets: string | null;
	reps: string | null;
	load: string | null;
	previousLoad: string | null;
	rpe: string | null;
	rest: string | null;
	substitutionOne: string | null;
	substitutionOneLink: string | null;
	substitutionTwo: string | null;
	substitutionTwoLink: string | null;
	notes: string | null;
}