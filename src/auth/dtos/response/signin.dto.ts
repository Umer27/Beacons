import { BaseAuthResponse } from './base-auth.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { RolesEnum } from '../../../users/models/roles.enum';

export class SigninResponseDto extends BaseAuthResponse {
  @ApiResponseProperty() id: string;

  @ApiResponseProperty() fullName: string;

  @ApiResponseProperty() deviceUID: string;

  @ApiResponseProperty() fcmToken: string;

  @ApiResponseProperty() email: string;

  @ApiResponseProperty() phoneNumber: string;

  @ApiResponseProperty() role: RolesEnum;

  constructor(obj: Partial<SigninResponseDto>) {
    super(obj);
    Object.assign(this, obj);
  }
}
