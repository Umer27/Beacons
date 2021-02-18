import { ApiResponseProperty } from '@nestjs/swagger';

export class SenderResponseDto {
  @ApiResponseProperty() id: string;

  @ApiResponseProperty() firstName: string;

  @ApiResponseProperty() lastName: string;

  @ApiResponseProperty() image: string;
}
