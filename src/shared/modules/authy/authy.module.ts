import { Module } from '@nestjs/common';
import { AuthyService } from './authy.service';

@Module({
  exports: [AuthyService],
  providers: [AuthyService],
})
export class AuthyModule {}
