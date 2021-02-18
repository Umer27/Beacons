import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { firestore } from 'firebase-admin';

import { UsersEntity } from '../../users/users.entity';
import { ConversationsEntity } from '../conversations/conversations.entity';

export class MessagesEntity {
  @IsString() id: string;

  @IsString() conversationId: string;

  conversation: ConversationsEntity;

  @IsString() @IsNotEmpty() body: string;

  @IsString() senderId: string;

  @IsNumber() timestamp: firestore.FieldValue;

  sender: Pick<UsersEntity, 'id' | 'fullName' | 'image'>;

  constructor(obj?: Partial<MessagesEntity>) {
    Object.assign(this, obj);
  }
}
