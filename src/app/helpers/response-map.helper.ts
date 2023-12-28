import { DocumentData, DocumentSnapshot } from 'firebase/firestore';

export function mapIdField<T>(doc: DocumentSnapshot<DocumentData>): T {
	const data = doc.data();
	return { ...data, id: doc.id } as T;
  }