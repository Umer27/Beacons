import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthyModule } from '../shared/modules/authy/authy.module';
import { TwilioModule } from '../shared/modules/twilio/twilio.module';

@Module({
  imports: [AuthyModule, TwilioModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
