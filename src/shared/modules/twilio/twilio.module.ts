import { Module, HttpModule } from '@nestjs/common';
import { TwilioService } from './twilio.service';

@Module({
  exports: [TwilioService],
  imports: [HttpModule],
  providers: [TwilioService],
})
export class TwilioModule {}
