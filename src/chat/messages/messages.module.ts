import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { ConversationsModule } from '../conversations/conversations.module';
import { UsersModule } from '../../users/users.module';

@Module({
  controllers: [MessagesController],
  exports: [MessagesService],
  imports: [ConversationsModule, UsersModule],
  providers: [MessagesService],
})
export class MessagesModule {}
