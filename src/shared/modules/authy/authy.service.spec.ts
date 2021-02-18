import { Test, TestingModule } from '@nestjs/testing';
import { AuthyService } from './authy.service';

describe('AuthyService', () => {
  let service: AuthyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthyService],
    }).compile();

    service = module.get<AuthyService>(AuthyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
