import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, IsArray } from 'class-validator';

import { GetCoordsRequestDto } from './get-coords';
import { BaseGetManyRequestDto } from '../../../shared/dtos/request/base-get-many-request.dto';

export class GetBeaconRequestDto extends BaseGetManyRequestDto {
  @ApiPropertyOptional() @IsString() @IsOptional() beaconId: string;

  @ApiPropertyOptional() @IsArray() @IsString({ each: true }) beaconIds: string[];

  coords: GetCoordsRequestDto;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  set ['coords.x'](value: number) {
    this.coords = new GetCoordsRequestDto({ ...(this.coords || {}), x: value });
  }

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  set ['coords.y'](value: number) {
    this.coords = new GetCoordsRequestDto({ ...(this.coords || {}), y: value });
  }

  constructor(obj: Partial<GetBeaconRequestDto>) {
    super(obj);
    Object.assign(this, obj);
  }
}
