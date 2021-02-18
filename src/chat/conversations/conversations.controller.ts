import {
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Delete,
  Get,
  Patch,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../auth/auth.guard';
import { CrudInterface } from '../../shared/models/crud.interface';
import { ConversationsEntity } from './conversations.entity';
import { ConversationsService } from './conversations.service';
import { UpdateConversationRequestDto } from './dtos/request/update-conversation';
import { UpdateConversationResponseDto } from './dtos/response/update-conversation';
import { GetConversationResponseDto } from './dtos/response/get-conversation';
import { GetConversationRequestDto } from './dtos/request/get-conversation';
import { CreateConversationRequestDto } from './dtos/request/create-conversation';
import { CreateConversationResponseDto } from './dtos/response/create-conversation';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Conversations')
@Controller('conversations')
@UseInterceptors(ClassSerializerInterceptor)
export class ConversationsController implements Partial<CrudInterface<ConversationsEntity>> {
  constructor(private readonly conversationsService: ConversationsService) {}
  @Post('')
  @ApiCreatedResponse({
    description: 'Create one conversation response',
    type: CreateConversationResponseDto,
  })
  createOne(@Body() body: CreateConversationRequestDto): Promise<ConversationsEntity> {
    return this.conversationsService.createOne(body);
  }
  @Post('/bulk')
  @ApiCreatedResponse({
    description: 'Create one conversation response',
    isArray: true,
    type: CreateConversationResponseDto,
  })
  @ApiExcludeEndpoint()
  createMany(@Body() body: CreateConversationRequestDto[]): Promise<ConversationsEntity[]> {
    return this.conversationsService.createMany(body);
  }
  @Delete('')
  @ApiOkResponse({ description: 'Delete one conversattion response' })
  delete(@Param('id') id: string): Promise<void> {
    return this.conversationsService.delete(id);
  }
  @Get('')
  @ApiOkResponse({
    description: 'Get many conversations response',
    isArray: true,
    type: GetConversationResponseDto,
  })
  getMany(@Query() query?: GetConversationRequestDto): Promise<ConversationsEntity[]> {
    return this.conversationsService.getMany(query);
  }
  @Get(':id')
  @ApiOkResponse({
    description: 'Get one conversations response',
    type: GetConversationResponseDto,
  })
  getOne(@Param('id') id: string): Promise<ConversationsEntity> {
    return this.conversationsService.getOne(id);
  }
  @Patch('')
  @ApiOkResponse({
    description: 'Update one conversation response',
    type: UpdateConversationResponseDto,
  })
  updateOne(
    @Param('id') id: string,
    @Body() body: UpdateConversationRequestDto,
  ): Promise<ConversationsEntity> {
    return this.conversationsService.updateOne(id, body);
  }
}
