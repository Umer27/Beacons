import { NormalizeEmail, Trim, sanitize } from 'class-sanitizer';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsPhoneNumber,
} from 'class-validator';
import { firestore } from 'firebase-admin';

import { RolesEnum } from './models/roles.enum';
import { CallInterface } from './models/call.interface';

export class UsersEntity {
  @IsBoolean() @IsOptional() doNotDisturb: boolean;

  @IsBoolean() @IsOptional() isAmbulatory: boolean;

  @IsBoolean() isVerifiedByOTP: boolean;

  @IsEnum(RolesEnum) role: RolesEnum;

  @IsNumber() @IsOptional() dateOfBirth: number;

  @IsOptional() call: CallInterface;

  @IsPhoneNumber('US') phoneNumber: string;

  @IsString() @Exclude({ toPlainOnly: true }) @IsOptional() @Trim() password: string;

  @IsString() @IsEmail() @NormalizeEmail() @IsOptional() email: string;

  @IsString() @IsUrl() @IsOptional() image: string;

  @IsString() deviceUID: string;

  @IsString() fcmToken: string;

  @IsString() fullName: string;

  @IsString() id: string;

  @IsString() employeeIdNumber: string;

  constructor(obj?: Partial<UsersEntity> | (firestore.DocumentData & Record<'id', string>)) {
    Object.assign(this, { ...obj, isVerifiedByOTP: obj.isVerifiedByOTP ?? false });
    sanitize(this);
  }
}
