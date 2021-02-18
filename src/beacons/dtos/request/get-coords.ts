import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';

export class GetCoordsRequestDto {
  @ApiPropertyOptional() @IsNumberString() @IsOptional() x: number;

  @ApiPropertyOptional() @IsNumberString() @IsOptional() y: number;

  constructor(obj: Partial<GetCoordsRequestDto>) {
    Object.assign(this, obj);
  }
}
