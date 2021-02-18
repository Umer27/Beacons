import { firestore } from 'firebase-admin';

export function getResponseWithIdAndPath(
  doc: firestore.QueryDocumentSnapshot<firestore.DocumentData>,
): firestore.DocumentData & Record<'id', string> {
  return { id: doc.id, path: doc.ref.path, ...doc.data() };
}

export function getResponsesWithIdsAndPaths(
  docs: firestore.QueryDocumentSnapshot<firestore.DocumentData>[],
): Array<firestore.DocumentData & Record<'id', string>> {
  return docs.map(getResponseWithIdAndPath);
}
