import { ApiProperty } from '@nestjs/swagger';

export class SendOtpRequestDto {
  @ApiProperty() userId: string;
}
