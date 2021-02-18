import { Injectable, NotFoundException } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { firestore } from 'firebase-admin';

import { CrudInterface } from '../../shared/models/crud.interface';
import {
  getResponsesWithIdsAndPaths,
  getResponseWithIdAndPath,
} from '../../shared/utils/operators/append-id-to-response';
import { UsersService } from '../../users/users.service';
import { ConversationsEntity } from './conversations.entity';
import { CreateConversationRequestDto } from './dtos/request/create-conversation';
import { GetConversationRequestDto } from './dtos/request/get-conversation';
import { UpdateConversationRequestDto } from './dtos/request/update-conversation';

@Injectable()
export class ConversationsService implements CrudInterface<ConversationsEntity> {
  db: firestore.Firestore;
  collection: firestore.CollectionReference<firestore.DocumentData>;

  constructor(private readonly usersService: UsersService) {
    this.db = firestore();
    this.collection = this.db.collection('conversations');
  }
  createOne(body: CreateConversationRequestDto): Promise<ConversationsEntity> {
    return this.usersService
      .getMany({ ids: body.userIds, limit: body.userIds.length, offset: 0 })
      .then(users => {
        console.log(users.length, body.userIds.length);
        if (!users.length || users.length < body.userIds.length) {
          throw new NotFoundException('Can not find users');
        }
        return users;
      })
      .then(users =>
        users.map(({ id, fullName, image }) => ({
          id,
          fullName,
          image: image ?? '',
        })),
      )
      .then(users => ({
        users,
        title: body.title || users.map(user => user.fullName).join(', '),
      }))
      .then(({ users, title }) => this.collection.add({ users, title, userIds: body.userIds }))
      .then(res => res.id)
      .then(id => this.getOne(id));
  }
  createMany(body: CreateConversationRequestDto[]): Promise<ConversationsEntity[]> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<void> {
    this.collection.doc(id).delete();
  }
  getMany(query?: GetConversationRequestDto): Promise<ConversationsEntity[]> {
    const { limit, offset } = query;

    if (limit < 1) {
      return Promise.resolve([]);
    }

    const plainQuery = classToPlain(query) as GetConversationRequestDto;

    let dbQuery = !limit ? this.collection : this.collection.limit(limit);
    dbQuery = offset ? dbQuery.offset(offset) : dbQuery;
    dbQuery = plainQuery.title
      ? dbQuery.startAt(plainQuery.title).endAt(plainQuery.title + '~')
      : dbQuery;
    dbQuery = dbQuery.where('userIds', 'array-contains', plainQuery.userId);
    return dbQuery
      .get()
      .then(res => res.docs)
      .then(getResponsesWithIdsAndPaths)
      .then(conversations =>
        conversations.map(conversation => new ConversationsEntity(conversation)),
      );
  }
  getOne(id: string): Promise<ConversationsEntity> {
    return this.collection
      .doc(id)
      .get()
      .then(getResponseWithIdAndPath)
      .then(conversation => {
        if (!conversation) {
          throw new NotFoundException(`Can not find conversation with id ${id}`);
        }
        return conversation;
      })
      .then(conversation => new ConversationsEntity(conversation));
  }
  updateOne(id: string, body: UpdateConversationRequestDto): Promise<ConversationsEntity> {
    return this.collection
      .doc(id)
      .update(body)
      .then(() => this.getOne(id));
  }
  replaceOne(id: string, body: Record<string, any>): Promise<ConversationsEntity> {
    throw new Error('Method not implemented.');
  }
}
