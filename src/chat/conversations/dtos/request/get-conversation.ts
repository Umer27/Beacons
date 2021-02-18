import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { BaseGetManyRequestDto } from '../../../../shared/dtos/request/base-get-many-request.dto';

export class GetConversationRequestDto extends BaseGetManyRequestDto {
  @ApiProperty() @IsString() userId: string;

  @ApiPropertyOptional() @IsString() @IsOptional() title: string;
}
