import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCoordsRequestDto {
  @ApiPropertyOptional() @IsNumber() @IsOptional() x: number;

  @ApiPropertyOptional() @IsNumber() @IsOptional() y: number;
}
