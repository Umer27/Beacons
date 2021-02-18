import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMessageResponseDto {
  @ApiProperty() @IsString() @IsNotEmpty() body: string;
}
