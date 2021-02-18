import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsOptional, IsEmail } from 'class-validator';

import { RolesEnum } from '../../models/roles.enum';
import { BaseGetManyRequestDto } from '../../../shared/dtos/request/base-get-many-request.dto';

export class GetManyUsersRequestDto extends BaseGetManyRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsEmail() email: string;

  @ApiPropertyOptional() @IsString() @IsOptional() firstName: string;

  @ApiPropertyOptional() @IsString() @IsOptional() lastName: string;

  @ApiPropertyOptional({ enum: RolesEnum }) @IsEnum(RolesEnum) @IsOptional() role: RolesEnum;

  @ApiPropertyOptional() @IsNumber() @IsOptional() dateOfBirth: number;

  @ApiPropertyOptional() @IsString({ each: true }) ids: string[];

  constructor(obj: Partial<GetManyUsersRequestDto>) {
    super(obj);
    Object.assign(this, obj);
  }
}
