import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateNonAmbulatoryPatientRequestDto {
  @ApiProperty() @IsString() @IsNotEmpty() firstName: string;

  @ApiProperty() @IsString() @IsNotEmpty() lastName: string;

  @ApiProperty() @IsNumber() dateOfBirth: number;
}
