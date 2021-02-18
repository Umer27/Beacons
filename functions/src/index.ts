import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { environment } from '../../src/environments/environment';

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: environment.firebaseClientEmail,
    privateKey: environment.firebasePrivateKey,
    projectId: environment.firebaseProjectId,
  }),
  databaseURL: environment.dbUrl,
});

exports.addLastMessageToConversation = functions.firestore
  .document('/messages/{documentId}')
  .onCreate(async (snapShot, context) => {
    const { conversation, sender, ...lastMessage } = snapShot.data();

    functions.logger.log(
      `Updating last message of Conversation with conversationId: ${lastMessage.conversationId} to ${context.params.documentId}`,
      lastMessage,
    );

    await admin
      .firestore()
      .collection('conversations')
      .doc(lastMessage.conversationId)
      .update({ lastMessage });
  });

exports.sendMessageNotification = functions.firestore
  .document('/messages/${documentId}')
  .onCreate(async snapShot => {
    const { conversation, sender, ...lastMessage } = snapShot.data();
    const users = (conversation.users as Record<'id' | 'fcmToken', string>[]).filter(
      user => user.id !== sender.id,
    );

    const fcmTokens = users.map(user => user.fcmToken);

    if (!fcmTokens.length) {
      return;
    }

    const payload: { notification: { title: string; body: string; icon?: string } } = {
      notification: {
        title: conversation.title || sender.firstName,
        body: lastMessage.body,
        ...(sender.image ? { icon: sender.image } : {}),
      },
    };

    return (
      admin
        .messaging()
        .sendToDevice(fcmTokens, payload)
        .then(response => response.results)
        // Handling error scenarios below this line
        // Deleting FCM tokens from user if we get invalid or not registered token errors
        .then(results =>
          results.map(({ error }, idx) => {
            if (!error) {
              return '';
            }
            functions.logger.log('Failure sending notifications to', fcmTokens[idx], error);
            if (
              error.code === 'messaging/invalid-registration-token' ||
              error.code === 'messaging/registration-token-not-registered'
            ) {
              return fcmTokens[idx];
            }
            return '';
          }),
        )
        .then(tokens => tokens.filter(Boolean))
        .then(tokens => users.filter(user => tokens.includes(user.fcmToken)))
        .then(usersToUpdate => {
          if (!usersToUpdate.length) {
            return;
          }

          const refs = usersToUpdate.map(user =>
            admin
              .firestore()
              .collection('users')
              .doc(user.id),
          );

          const FieldValue = admin.firestore.FieldValue;
          const batch = admin.firestore().batch();

          refs.forEach(ref => batch.update(ref, { fcmToken: FieldValue.delete() }));

          return batch.commit();
        })
    );
  });

exports.sendCallNotification = functions.firestore
  .document('/users/${documentId}')
  .onUpdate(async change => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    if (!newValue.call || !newValue.call.status || !newValue.call.with) {
      // We can not need notificaiton if any thing is missing from call object
      return;
    }

    if (
      newValue.call.status === previousValue.call.status &&
      newValue.call.with === previousValue.call.with
    ) {
      // We do not need notification if any field other than call is updated
      return;
    }

    if (newValue.call.status !== 'ring_in') {
      // We are only sending notifications for ringing in.
      // @see call status enums for all statuses.
      return;
    }

    const { fcmToken } = newValue.call;

    if (!fcmToken) {
      // We can not send notification if we do not have notification token
      return;
    }

    const payload: { notification: { title: string; body: string; icon?: string } } = {
      notification: {
        title: 'Calling',
        body: newValue.call.with,
        icon: newValue.call.with.image,
      },
    };

    return admin
      .messaging()
      .sendToDevice(newValue.call.fcmToken, payload)
      .then(response => response.results)
      .then(([result]) => {
        const { error } = result;
        if (!error) {
          return;
        }

        functions.logger.log('Failure sending notifications to', fcmToken, error);

        if (
          error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered'
        ) {
          const FieldValue = admin.firestore.FieldValue;

          return admin
            .firestore()
            .collection('users')
            .doc(newValue.id)
            .update({ fcmToken: FieldValue.delete() });
        }

        return;
      });
  });
