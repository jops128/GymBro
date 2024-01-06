import { DocumentData, DocumentSnapshot } from 'firebase/firestore';

export function mapIdField<T>(doc: DocumentSnapshot<DocumentData>): T {
	const data = doc.data();
	if (data && data['createdDate']) {
		data['createdDate'] = data['createdDate'].toDate();
	}
	return { ...data, id: doc.id } as T;
  }