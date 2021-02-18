import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAmbulatoryPatientRequestDto {
  @ApiProperty() @IsString() firstName: string;

  @ApiProperty() @IsString() lastName: string;

  @ApiProperty() @IsNumber() dateOfBirth: number;

  @ApiProperty() @IsString() @IsEmail() email: string;

  @ApiProperty({ minLength: 6, maxLength: 64 })
  @IsString()
  @MinLength(6)
  @MaxLength(64)
  password: string;
}
