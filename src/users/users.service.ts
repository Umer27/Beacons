import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { classToPlain } from 'class-transformer';
import { firestore } from 'firebase-admin';

import { CrudInterface } from '../shared/models/crud.interface';
import {
  getResponsesWithIdsAndPaths,
  getResponseWithIdAndPath,
} from '../shared/utils/operators/append-id-to-response';
import { CreateAmbulatoryPatientRequestDto } from './dtos/request/create-ambulatory-patient-request.dto';
import { CreateNonAmbulatoryPatientRequestDto } from './dtos/request/create-non-ambulatory-patient-request.dto';
import { CreateStaffRequestDto } from './dtos/request/create-staff-request.dto';
import { GetManyUsersRequestDto } from './dtos/request/get-many-users-request.dto';
import { UpdateUserRequestDto } from './dtos/request/update-user-request.dto';
import { UsersEntity } from './users.entity';
import { TwilioService } from '../shared/modules/twilio/twilio.service';

@Injectable()
export class UsersService implements CrudInterface<UsersEntity> {
  db: firestore.Firestore;
  collection: firestore.CollectionReference<firestore.DocumentData>;

  constructor(private readonly twilio: TwilioService) {
    this.db = firestore();
    this.collection = this.db.collection('users');
  }

  createAmbulatoryPatient(body: CreateAmbulatoryPatientRequestDto): Promise<UsersEntity> {
    const user = new UsersEntity(body);

    return this.checkUserExistance(body.email)
      .then(() => genSalt(12))
      .then(salt => hash(body.password, salt))
      .then(hashedPassword =>
        this.collection.add({ ...classToPlain(user), password: hashedPassword }),
      ) // * Since firebase does not support objects that were created via the "new" operator we have to convert objects to plain
      .then(res => res.id)
      .then(id => this.getOne(id));
  }
  createNonAmbulatoryPatient(body: CreateNonAmbulatoryPatientRequestDto): Promise<UsersEntity> {
    const user = new UsersEntity(body);
    return this.collection
      .add(user)
      .then(res => res.id)
      .then(id => this.getOne(id));
  }
  async createStaff(body: CreateStaffRequestDto): Promise<UsersEntity> {
    const newUser = new UsersEntity(body);

    // ? If user exists but is not verified by OTP we will overwrite the user.
    // ? If user exists and is verified by OTP we will throw error
    // ? If user does not exists we will create user
    const existingUser = await this.checkUserExistance(body.email);
    const salt = await genSalt(12);
    const hashedPassword = await hash(body.password, salt);
    try {
      await this.twilio.sendVerificationCode(newUser.phoneNumber);

      if (existingUser) {
        return this.updateOne(
          existingUser.id,
          new UpdateUserRequestDto({
            ...newUser,
            hashedPassword,
          }),
        );
      } else {
        const { id } = this.collection.doc();
        await this.collection.doc(id).set({
          // * Since firebase does not support objects that were created via the "new" operator we have to convert objects to plain
          ...classToPlain(newUser),
          password: hashedPassword,
        });

        return new UsersEntity({ id, ...newUser });
      }
    } catch (error) {
      if (error.statusCode === 400) {
        throw new BadRequestException(error);
      }
      console.log(error);
      throw error;
    }
  }
  createOne(body: CreateStaffRequestDto): Promise<UsersEntity> {
    const user = new UsersEntity(body);

    return genSalt(12)
      .then(salt => hash(body.password, salt))
      .then(hashedPassword =>
        this.collection.add({ ...classToPlain(user), password: hashedPassword }),
      ) // * Since firebase does not support objects that were created via the "new" operator we have to convert objects to plain
      .then(res => res.id)
      .then(id => this.getOne(id));
  }
  createMany(body: CreateStaffRequestDto[]): Promise<UsersEntity[]> {
    const users = body.map(item => new UsersEntity(item));
    return this.collection.add(users) as any;
  }
  async delete(id: string): Promise<void> {
    await this.collection.doc(id).update({ isDeleted: true });
  }
  getMany(query?: Partial<GetManyUsersRequestDto>): Promise<UsersEntity[]> {
    const { limit, offset } = query;

    if (limit < 1) {
      return Promise.resolve([]);
    }

    const plainQuery = classToPlain(query) as GetManyUsersRequestDto;

    let dbQuery = !limit ? this.collection : this.collection.limit(limit);
    dbQuery = offset ? dbQuery.offset(offset) : dbQuery;
    dbQuery = plainQuery.email ? dbQuery.where('email', '==', plainQuery.email) : dbQuery;
    dbQuery =
      plainQuery.ids && plainQuery.ids.length
        ? dbQuery.where(firestore.FieldPath.documentId(), 'in', plainQuery.ids)
        : dbQuery;
    return dbQuery
      .get()
      .then(res => res.docs)
      .then(getResponsesWithIdsAndPaths)
      .then(users => users.map(user => new UsersEntity(user)));
  }
  getOne(id: string): Promise<UsersEntity> {
    return this.collection
      .doc(id)
      .get()
      .then(doc => {
        if (!doc.exists) {
          throw new NotFoundException(`Can not find user with id ${id}`);
        }
        return doc;
      })
      .then(getResponseWithIdAndPath)
      .then(user => new UsersEntity(user));
  }
  updateOne(id: string, body: UpdateUserRequestDto): Promise<UsersEntity> {
    return this.collection
      .doc(id)
      .update(
        classToPlain({
          ...body,
          ...(body.hashedPassword ? { password: body.hashedPassword } : {}),
        }),
      )
      .then(() => this.getOne(id));
  }
  replaceOne<ReplaceDto = Record<string, unknown>>(
    id: string,
    body: ReplaceDto,
  ): Promise<UsersEntity> {
    return this.collection
      .doc(id)
      .set(body)
      .then(() => this.getOne(id));
  }

  private checkUserExistance(email: string) {
    return this.getMany({ email, limit: 1, offset: 0 }).then(([user]) => {
      if (!!user && user.isVerifiedByOTP) throw new ConflictException('User already exists');
      else if (!!user && !user.isVerifiedByOTP) return user;
      else return null;
    });
  }
}
