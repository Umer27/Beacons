import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { BaseGetManyRequestDto } from '../../../shared/dtos/request/base-get-many-request.dto';

export class GetRolesRequestDto extends BaseGetManyRequestDto {
  @ApiPropertyOptional() @IsString() @IsOptional() title: string;

  constructor(obj: Partial<GetRolesRequestDto>) {
    super(obj);
    Object.assign(this, obj);
  }
}
