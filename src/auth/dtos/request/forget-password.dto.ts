import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsEmail } from 'class-validator';
import { NormalizeEmail, sanitize } from 'class-sanitizer';

export class ForgetPasswordRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsEmail() @NormalizeEmail() email: string;

  @ApiPropertyOptional() @IsOptional() @IsPhoneNumber('US') phoneNumber: string;

  constructor(obj: Partial<ForgetPasswordRequestDto>) {
    sanitize(obj);
    Object.assign(this, obj);
  }
}
