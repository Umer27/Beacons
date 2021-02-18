import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthyModule } from '../shared/modules/authy/authy.module';
import { TwilioModule } from '../shared/modules/twilio/twilio.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  imports: [UsersModule, AuthyModule, TwilioModule],
})
export class AuthModule {}
