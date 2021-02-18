import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageRequestDto {
  @ApiProperty() @IsString() @IsNotEmpty() conversationId: string;

  @ApiProperty() @IsString() @IsNotEmpty() body: string;

  @ApiProperty() @IsString() @IsNotEmpty() senderId: string;
}
