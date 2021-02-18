import { Injectable } from '@nestjs/common';
import { CrudInterface } from '../shared/models/crud.interface';
import { RolesEntity } from './roles.entity';
import { GetRolesRequestDto } from './dtos/request/get-roles';
import { firestore } from 'firebase-admin';
import { classToPlain } from 'class-transformer';
import { getResponsesWithIdsAndPaths } from '../shared/utils/operators/append-id-to-response';

@Injectable()
export class RolesService implements CrudInterface<RolesEntity> {
  db: firestore.Firestore;
  collection: firestore.CollectionReference<firestore.DocumentData>;

  constructor() {
    this.db = firestore();
    this.collection = this.db.collection('roles');
  }

  createOne(body: Record<string, any>): Promise<RolesEntity> {
    throw new Error('Method not implemented.');
  }
  createMany(body: Record<string, any>[]): Promise<RolesEntity[]> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getMany(query?: GetRolesRequestDto): Promise<RolesEntity[]> {
    const { limit, offset } = query;

    if (limit < 1) {
      return Promise.resolve([]);
    }

    const plainQuery = classToPlain(query) as GetRolesRequestDto;

    let dbQuery = !limit ? this.collection : this.collection.limit(limit);
    dbQuery = offset ? dbQuery.offset(offset) : dbQuery;
    dbQuery = plainQuery.title ? dbQuery.where('title', '==', plainQuery.title) : dbQuery;

    return dbQuery
      .get()
      .then(res => res.docs)
      .then(getResponsesWithIdsAndPaths)
      .then(roles => roles.map(role => new RolesEntity(role)));
  }
  getOne(id: string): Promise<RolesEntity> {
    throw new Error('Method not implemented.');
  }
  updateOne(id: string, body: Record<string, any>): Promise<RolesEntity> {
    throw new Error('Method not implemented.');
  }
  replaceOne(id: string, body: Record<string, any>): Promise<RolesEntity> {
    throw new Error('Method not implemented.');
  }
}
