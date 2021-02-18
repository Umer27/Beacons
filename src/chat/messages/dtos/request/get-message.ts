import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseGetManyRequestDto } from '../../../../shared/dtos/request/base-get-many-request.dto';

export class GetMessageRequestDto extends BaseGetManyRequestDto {
  @ApiProperty() @IsString() @IsNotEmpty() conversationId: string;
}
