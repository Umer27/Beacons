import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';

import { UpdateCoordsRequestDto } from './update-coords';

export class UpdateBeaconRequestDto {
  @ApiPropertyOptional() @IsString() @IsOptional() beaconId: string;

  @ApiPropertyOptional({ type: UpdateCoordsRequestDto })
  @IsObject()
  @ValidateNested()
  @IsOptional()
  coords: UpdateCoordsRequestDto;
}
