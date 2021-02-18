import { IsNumber } from 'class-validator';

export class Coords {
  @IsNumber() x: number;

  @IsNumber() y: number;

  constructor(obj: Coords) {
    Object.assign(this, obj);
  }
}
