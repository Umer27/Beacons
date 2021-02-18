import { ApiResponseProperty } from '@nestjs/swagger';

import { CoordsResponseDto } from './coords';

export class UpdateBeaconResponseDto {
  @ApiResponseProperty() beaconId: string;

  @ApiResponseProperty() id: string;

  @ApiResponseProperty({ type: CoordsResponseDto }) coords: CoordsResponseDto;
}
