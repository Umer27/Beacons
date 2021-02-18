import {
  Injectable,
  ConflictException,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { CrudInterface } from '../shared/models/crud.interface';
import { BeaconsEntity } from './beacons.entity';
import { firestore } from 'firebase-admin';
import { CreateBeaconRequestDto } from './dtos/request/create-beacon';
import { GetBeaconRequestDto } from './dtos/request/get-beacon';
import { UpdateBeaconRequestDto } from './dtos/request/update-beacon';
import { Coords } from './models/coords';
import { classToPlain } from 'class-transformer';
import {
  getResponseWithIdAndPath,
  getResponsesWithIdsAndPaths,
} from '../shared/utils/operators/append-id-to-response';

@Injectable()
export class BeaconsService implements CrudInterface<BeaconsEntity> {
  private readonly db: firestore.Firestore;
  private readonly collection: firestore.CollectionReference<firestore.DocumentData>;
  constructor() {
    this.db = firestore();
    this.collection = this.db.collection('beacons');
  }
  createOne(body: CreateBeaconRequestDto): Promise<BeaconsEntity> {
    return this.getMany(new GetBeaconRequestDto({ beaconId: body.beaconId, limit: 1, offset: 0 }))
      .then(beacon => {
        if (beacon) {
          throw new ConflictException('Beacon already exists');
        }
      })
      .then(
        () =>
          new BeaconsEntity({
            beaconId: body.beaconId,
            coords: new Coords({ x: body.coords.x, y: body.coords.y }),
          }),
      )
      .then(beacon => this.collection.add(classToPlain(beacon)))
      .then(res => res.id)
      .then(id => this.getOne(id));
  }
  createMany(body: CreateBeaconRequestDto[]): Promise<BeaconsEntity[]> {
    const beaconIds = body.map(item => item.beaconId);
    return this.getMany(new GetBeaconRequestDto({ beaconIds }))
      .then(beacons => {
        if (beacons.length) {
          const conflictingBeaconIds = beacons.map(beacon => beacon.beaconId);
          throw new ConflictException(
            `Beacons with beacon ids: ${conflictingBeaconIds.join(', ')} already exsists`,
          );
        }
      })
      .then(() =>
        body.map(
          item =>
            new BeaconsEntity({
              beaconId: item.beaconId,
              coords: new Coords({ x: item.coords.x, y: item.coords.y }),
            }),
        ),
      )
      .then(beacons => this.collection.add(classToPlain(beacons)))
      .then(() => this.getMany(new GetBeaconRequestDto({ beaconIds })));
  }
  async delete(id: string): Promise<void> {
    await this.collection.doc(id).update({ isDeleted: true });
  }
  getMany(query?: GetBeaconRequestDto): Promise<BeaconsEntity[]> {
    const { limit, offset } = query;

    if (limit < 1) {
      return Promise.resolve([]);
    }

    const plainQuery = classToPlain(query) as GetBeaconRequestDto;

    let dbQuery = !limit ? this.collection : this.collection.limit(limit);
    dbQuery = offset ? dbQuery.offset(offset) : dbQuery;
    dbQuery = dbQuery.where('isDeleted', '==', false);
    dbQuery = plainQuery.beaconId ? dbQuery.where('beaconId', '==', plainQuery.beaconId) : dbQuery;
    dbQuery = plainQuery.beaconIds
      ? dbQuery.where('beaconId', 'in', plainQuery.beaconIds)
      : dbQuery;
    dbQuery = plainQuery.coords?.x ? dbQuery.where('coords.x', '==', plainQuery.coords.x) : dbQuery;
    dbQuery = plainQuery.coords?.y ? dbQuery.where('coords.y', '==', plainQuery.coords.y) : dbQuery;
    return dbQuery
      .get()
      .then(res => res.docs)
      .then(getResponsesWithIdsAndPaths)
      .then(beacons => beacons.map(beacon => new BeaconsEntity(beacon)));
  }
  getOne(id: string): Promise<BeaconsEntity> {
    return this.collection
      .doc(id)
      .get()
      .then(getResponseWithIdAndPath)
      .then(beacon => {
        if (!beacon) {
          throw new NotFoundException(`Can not find beacon with id: ${id}`);
        }
        return beacon;
      })
      .then(beacon => new BeaconsEntity(beacon));
  }
  updateOne(id: string, body: UpdateBeaconRequestDto): Promise<BeaconsEntity> {
    return this.collection
      .doc(id)
      .update(classToPlain(body))
      .then(() => this.getOne(id));
  }
  replaceOne(id: string, body: Record<string, any>): Promise<BeaconsEntity> {
    throw new Error('Method not implemented.');
  }
}
