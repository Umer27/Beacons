import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

import { RolesEnum } from '../../models/roles.enum';

export class CreateStaffRequestDto {
  @ApiProperty() @IsEmail() email: string;

  @ApiProperty({ minLength: 6, maxLength: 64 })
  @IsString()
  @MinLength(6)
  @MaxLength(64)
  password: string;

  @ApiProperty() @IsString() @IsNotEmpty() fullName: string;

  @ApiProperty() phoneNumber: string;

  @ApiProperty({ enum: RolesEnum }) @IsString() @IsIn(Object.values(RolesEnum)) role: RolesEnum;

  @ApiProperty() @IsString() employeeIdNumber: string;
}
