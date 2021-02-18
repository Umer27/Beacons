import { ApiResponseProperty } from '@nestjs/swagger';

export class GetRolesResponseDto {
  @ApiResponseProperty() id: string;

  @ApiResponseProperty() title: string;
}
