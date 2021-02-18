import { ApiResponseProperty } from '@nestjs/swagger';

export class BaseResponseDto<T> {
  @ApiResponseProperty() body: T;

  @ApiResponseProperty() message?: string | string[];

  @ApiResponseProperty() statusCode: number;

  @ApiResponseProperty() success: boolean;

  @ApiResponseProperty() error?: string;

  constructor(obj: Partial<BaseResponseDto<T>>) {
    Object.assign(this, obj);
  }
}
