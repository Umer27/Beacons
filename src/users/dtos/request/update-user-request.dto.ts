import { ApiPropertyOptional, ApiHideProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsIn, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

import { RolesEnum } from '../../models/roles.enum';
import { Trim } from 'class-sanitizer';

export class UpdateUserRequestDto {
  @ApiPropertyOptional() @IsEmail() @IsOptional() email: string;

  @ApiPropertyOptional() @IsString() @IsOptional() firstName: string;

  @ApiPropertyOptional() @IsString() @IsOptional() lastName: string;

  @ApiPropertyOptional({ enum: RolesEnum })
  @IsString()
  @IsIn(Object.values(RolesEnum))
  @IsOptional()
  role: RolesEnum;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isAmbulatory: boolean;

  @ApiPropertyOptional() @IsNumber() @IsOptional() dateOfBirth: number;

  @ApiPropertyOptional() @IsString() @IsUrl() @IsOptional() image: string;

  @ApiPropertyOptional() @IsBoolean() @IsOptional() doNotDisturb: boolean;

  @ApiPropertyOptional() @IsString() employeeIdNumber: string;

  @ApiHideProperty() @IsString() @Trim() hashedPassword: string;

  @ApiHideProperty() @IsString() authyUserId: number | string;

  @ApiHideProperty() @IsBoolean() isVerifiedByOTP: boolean;

  constructor(obj: Partial<UpdateUserRequestDto>) {
    Object.assign(this, obj);
  }
}
