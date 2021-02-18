import { IsString } from 'class-validator';
import { UsersEntity } from '../../users/users.entity';

export class ConversationsEntity {
  @IsString() id: string;

  @IsString() lastMessageId: string;

  @IsString() userIds: Pick<UsersEntity, 'id'>[];

  lastMessage;

  @IsString() title: string;

  users: Pick<UsersEntity, 'id' | 'fullName' | 'image'>[];

  constructor(obj?: Partial<ConversationsEntity>) {
    Object.assign(this, obj);
  }
}
