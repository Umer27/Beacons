import { ApiResponseProperty } from '@nestjs/swagger';
import { SenderResponseDto } from './sender';

export class CreateMessageResponseDto {
  @ApiResponseProperty() id: string;

  @ApiResponseProperty() body: string;

  @ApiResponseProperty() conversationId: string;

  @ApiResponseProperty() timestamp: number;

  @ApiResponseProperty() senderId: string;

  @ApiResponseProperty() sender: SenderResponseDto;
}
