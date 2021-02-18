import { ApiResponseProperty } from '@nestjs/swagger';
import { RolesEnum } from '../../models/roles.enum';

export class GetUserResponseDto {
  @ApiResponseProperty() id: string;

  @ApiResponseProperty() path: string;

  @ApiResponseProperty() firstName: string;

  @ApiResponseProperty() lastName: string;

  @ApiResponseProperty({ enum: RolesEnum }) role?: RolesEnum;

  @ApiResponseProperty() isAmbulatory?: boolean;

  @ApiResponseProperty() email?: string;

  @ApiResponseProperty() dateOfBirth?: number;

  @ApiResponseProperty() image?: string;
}
