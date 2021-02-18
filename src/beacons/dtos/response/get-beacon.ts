import { ApiResponseProperty } from '@nestjs/swagger';

import { CoordsResponseDto } from './coords';

export class GetBeaconResponseDto {
  @ApiResponseProperty() beaconId: string;

  @ApiResponseProperty() id: string;

  @ApiResponseProperty({ type: CoordsResponseDto }) coords: CoordsResponseDto;
}
