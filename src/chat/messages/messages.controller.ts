import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../../auth/auth.guard';
import { CrudInterface } from '../../shared/models/crud.interface';
import { CreateMessageRequestDto } from './dtos/request/create-messsage';
import { GetMessageResponseDto } from './dtos/response/get-message';
import { UpdateMessageResponseDto } from './dtos/request/update-message';
import { CreateMessageResponseDto } from './dtos/response/create-messsage';
import { GetMessageRequestDto } from './dtos/request/get-message';
import { UpdateMessageRequestDto } from './dtos/response/update-message';
import { MessagesEntity } from './messages.entity';
import { MessagesService } from './messages.service';

@ApiBearerAuth()
@ApiTags('Messages')
@Controller('messages')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class MessagesController implements Partial<CrudInterface<MessagesEntity>> {
  constructor(private readonly messagesService: MessagesService) {}
  @Post('')
  @ApiCreatedResponse({
    description: 'Create one message response',
    type: CreateMessageResponseDto,
  })
  createOne(@Body() body: CreateMessageRequestDto): Promise<MessagesEntity> {
    return this.messagesService.createOne(body);
  }
  createMany(body: CreateMessageRequestDto[]): Promise<MessagesEntity[]> {
    return this.messagesService.createMany(body);
  }
  @Delete(':id')
  @ApiOkResponse({ description: 'Delete one message response' })
  delete(@Param('id') id: string): Promise<void> {
    return this.messagesService.delete(id);
  }
  @Get()
  @ApiOkResponse({
    isArray: true,
    type: GetMessageResponseDto,
    description: 'Get many users response',
  })
  getMany(@Query() query?: GetMessageRequestDto): Promise<MessagesEntity[]> {
    return this.messagesService.getMany(query);
  }
  @Get(':id')
  @ApiOkResponse({ description: 'Get one message response', type: GetMessageResponseDto })
  getOne(@Param('id') id: string): Promise<MessagesEntity> {
    return this.messagesService.getOne(id);
  }
  @Patch(':id')
  @ApiOkResponse({ description: 'Update one message response', type: UpdateMessageResponseDto })
  updateOne(@Param('id') id: string, body: UpdateMessageRequestDto): Promise<MessagesEntity> {
    return this.messagesService.updateOne(id, body);
  }
  replaceOne(@Param('id') id: string, body: Record<string, any>): Promise<MessagesEntity> {
    throw new Error('Method not implemented.');
  }
}
