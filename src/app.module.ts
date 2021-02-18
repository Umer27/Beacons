import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import Configuration from './configs/configurations';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConversationsModule } from './chat/conversations/conversations.module';
import { MessagesModule } from './chat/messages/messages.module';
import { BeaconsModule } from './beacons/beacons.module';
import { AuthyModule } from './shared/modules/authy/authy.module';
import { RolesModule } from './roles/roles.module';
import { TwilioModule } from './shared/modules/twilio/twilio.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [Configuration], isGlobal: true }),
    UsersModule,
    AuthModule,
    ConversationsModule,
    MessagesModule,
    BeaconsModule,
    AuthyModule,
    RolesModule,
    TwilioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
