import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMessageRequestDto {
  @ApiProperty() @IsString() @IsNotEmpty() body: string;
}
