import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { UsersModule } from '../../users/users.module';

@Module({
  controllers: [ConversationsController],
  exports: [ConversationsService],
  imports: [UsersModule],
  providers: [ConversationsService],
})
export class ConversationsModule {}
