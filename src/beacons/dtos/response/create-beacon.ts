import { ApiResponseProperty } from '@nestjs/swagger';
import { IsString, IsObject } from 'class-validator';
import { CoordsResponseDto } from './coords';

export class CreateBeaconResponseDto {
  @ApiResponseProperty() beaconId: string;

  @ApiResponseProperty() id: string;

  @ApiResponseProperty({ type: CoordsResponseDto }) coords: CoordsResponseDto;
}
