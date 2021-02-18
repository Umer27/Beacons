import { ApiResponseProperty } from '@nestjs/swagger';

import { RolesEnum } from '../../models/roles.enum';

export class CreateStaffResponseDto {
  @ApiResponseProperty() id: string;

  @ApiResponseProperty() path: string;

  @ApiResponseProperty() email: string;

  @ApiResponseProperty() fullName: string;

  @ApiResponseProperty() phoneNumber: string;

  @ApiResponseProperty() role: RolesEnum;

  @ApiResponseProperty() deviceUID: string;

  @ApiResponseProperty() fcmToken: string;
}
