import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, ArrayMinSize } from 'class-validator';

export class CreateConversationRequestDto {
  @ApiProperty() @IsString({ each: true }) @ArrayMinSize(2) userIds: string[];

  @ApiPropertyOptional() @IsString() @IsOptional() title: string;
}
