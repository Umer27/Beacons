import { IsString, IsObject } from 'class-validator';

import { Coords } from './models/coords';

export class BeaconsEntity {
  @IsString() id: string;

  @IsString() beaconId: string;

  @IsObject() coords: Coords;

  constructor(obj: Partial<BeaconsEntity>) {
    Object.assign(this, obj);
  }
}
