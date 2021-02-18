import { ApiResponseProperty } from '@nestjs/swagger';

export class CreateAmbulatoryPatientResponseDto {
  @ApiResponseProperty() id: string;

  @ApiResponseProperty() path: string;

  @ApiResponseProperty() firstName: string;

  @ApiResponseProperty() lastName: string;

  @ApiResponseProperty() dateOfBirth: number;

  @ApiResponseProperty() email: string;
}
