import { Test, TestingModule } from '@nestjs/testing';
import { BeaconsService } from './beacons.service';

describe('BeaconsService', () => {
  let service: BeaconsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeaconsService],
    }).compile();

    service = module.get<BeaconsService>(BeaconsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
