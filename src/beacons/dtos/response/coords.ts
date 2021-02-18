import { ApiResponseProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CoordsResponseDto {
  @ApiResponseProperty() @IsNumber() x: number;

  @ApiResponseProperty() @IsNumber() y: number;
}
