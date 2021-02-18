import { Injectable, NotFoundException } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { firestore } from 'firebase-admin';
import { CrudInterface } from '../../shared/models/crud.interface';
import {
  getResponsesWithIdsAndPaths,
  getResponseWithIdAndPath,
} from '../../shared/utils/operators/append-id-to-response';
import { UsersService } from '../../users/users.service';
import { ConversationsService } from '../conversations/conversations.service';
import { CreateMessageRequestDto } from './dtos/request/create-messsage';
import { GetMessageRequestDto } from './dtos/request/get-message';
import { UpdateMessageRequestDto } from './dtos/response/update-message';
import { MessagesEntity } from './messages.entity';

@Injectable()
export class MessagesService implements CrudInterface<MessagesEntity> {
  db: firestore.Firestore;
  collection: firestore.CollectionReference<firestore.DocumentData>;

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly usersService: UsersService,
  ) {
    this.db = firestore();
    this.collection = this.db.collection('messages');
  }
  createOne(body: CreateMessageRequestDto): Promise<MessagesEntity> {
    return Promise.all([
      this.conversationsService.getOne(body.conversationId),
      this.usersService.getOne(body.senderId),
    ])
      .then(([conversation, sender]) => ({ conversation, sender }))
      .then(
        ({ conversation, sender }) =>
          new MessagesEntity({
            ...body,
            conversation,
            timestamp: firestore.FieldValue.serverTimestamp(),
            sender,
          }),
      )
      .then(message => this.collection.add(classToPlain(message)))
      .then(res => res.id)
      .then(id => this.getOne(id));
  }
  createMany(body: CreateMessageRequestDto[]): Promise<MessagesEntity[]> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
  getMany(query?: GetMessageRequestDto): Promise<MessagesEntity[]> {
    const { limit, offset } = query;

    if (limit < 1) {
      return Promise.resolve([]);
    }

    const plainQuery = classToPlain(query) as GetMessageRequestDto;

    let dbQuery = !limit ? this.collection : this.collection.limit(limit);
    dbQuery = offset ? dbQuery.offset(offset) : dbQuery;
    dbQuery = dbQuery.where('conversationId', '==', plainQuery.conversationId);

    return dbQuery
      .get()
      .then(res => res.docs)
      .then(getResponsesWithIdsAndPaths)
      .then(messages => messages.map(message => new MessagesEntity(message)));
  }
  getOne(id: string): Promise<MessagesEntity> {
    return this.collection
      .doc(id)
      .get()
      .then(getResponseWithIdAndPath)
      .then(message => {
        if (!message) {
          throw new NotFoundException(`Can not find message with id ${id}`);
        }
        return message;
      })
      .then(message => new MessagesEntity(message));
  }
  updateOne(id: string, body: UpdateMessageRequestDto): Promise<MessagesEntity> {
    return this.collection
      .doc(id)
      .update(body)
      .then(() => this.getOne(id));
  }
  replaceOne(id: string, body: Record<string, any>): Promise<MessagesEntity> {
    throw new Error('Method not implemented.');
  }
}
