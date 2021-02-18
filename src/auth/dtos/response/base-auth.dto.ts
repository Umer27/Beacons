import { ApiResponseProperty } from '@nestjs/swagger';

export class BaseAuthResponse {
  @ApiResponseProperty() token: string;

  constructor(obj: Partial<BaseAuthResponse>) {
    Object.assign(this, obj);
  }
}
