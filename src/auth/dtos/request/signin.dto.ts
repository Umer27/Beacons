import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Trim, NormalizeEmail, sanitize } from 'class-sanitizer';

export class SigninRequestDto {
  @ApiProperty() @IsEmail() @NormalizeEmail() email: string;

  @ApiProperty() @IsString() @Trim() password: string;

  @ApiProperty() @IsString() @Trim() deviceUID: string;

  @ApiProperty() @IsString() @Trim() fcmToken: string;

  constructor() {
    sanitize(this);
  }
}
