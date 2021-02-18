import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested, IsObject } from 'class-validator';

import { CreateCoordsRequestDto } from './create-coords';

export class CreateBeaconRequestDto {
  @ApiProperty() @IsString() beaconId: string;

  @ApiProperty({ type: CreateCoordsRequestDto })
  @IsObject()
  @ValidateNested()
  coords: CreateCoordsRequestDto;
}
