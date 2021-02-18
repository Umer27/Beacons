import { Test, TestingModule } from '@nestjs/testing';
import { BeaconsController } from './beacons.controller';

describe('Beacons Controller', () => {
  let controller: BeaconsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeaconsController],
    }).compile();

    controller = module.get<BeaconsController>(BeaconsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
