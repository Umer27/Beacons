import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class VerifyOtpRequestDto {
  @ApiProperty() @IsString() @MaxLength(4) otp: string;

  @ApiProperty() @IsString() userId: string;
}
