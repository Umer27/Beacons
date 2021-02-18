import admin, { initializeApp } from 'firebase-admin';

import { environment } from '../environments/environment';
import { RolesEnum } from '../users/models/roles.enum';

(function() {
  const firebaseApp = initializeApp({
    credential: admin.credential.cert({
      clientEmail: environment.firebaseClientEmail,
      privateKey: environment.firebasePrivateKey,
      projectId: environment.firebaseProjectId,
    }),
    databaseURL: environment.dbUrl,
  });

  const roles = Object.values(RolesEnum).map(title => ({ title }));

  console.log('Adding roles to database');

  const fs = firebaseApp.firestore();
  const batch = fs.batch();

  roles.forEach(role => {
    const ref = fs.collection('roles').doc();
    batch.set(ref, role);
  });

  return batch
    .commit()
    .then(() => console.log('Roles added to database'))
    .catch(err => console.log('Error adding roles to database', err));
})();
