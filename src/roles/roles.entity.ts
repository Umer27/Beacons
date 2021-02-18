import { IsString } from 'class-validator';
import { firestore } from 'firebase-admin';

export class RolesEntity {
  @IsString() id: string;

  @IsString() title: string;

  constructor(obj?: Partial<RolesEntity> | (firestore.DocumentData & Record<'id', string>)) {
    Object.assign(this, obj);
  }
}
