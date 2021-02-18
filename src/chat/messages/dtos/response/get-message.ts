import { ApiResponseProperty } from '@nestjs/swagger';
import { GetConversationResponseDto } from '../../../conversations/dtos/response/get-conversation';
import { SenderResponseDto } from './sender';

export class GetMessageResponseDto {
  @ApiResponseProperty() id: string;

  @ApiResponseProperty() conversationId: string;

  @ApiResponseProperty({ type: GetConversationResponseDto })
  conversation: GetConversationResponseDto;

  @ApiResponseProperty() body: string;

  @ApiResponseProperty() timestamp: number;

  @ApiResponseProperty() senderId: string;

  @ApiResponseProperty() sender: SenderResponseDto;
}
