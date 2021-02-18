import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersModel } from './users.schema';
import { UsersService } from './users.service';

describe('Users Controller', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [
        // MongooseModule.forRootAsync({
        //   useFactory: () => ({ uri: `${environment.dbUrl}` }),
        // }),
        // MongooseModule.forFeatureAsync([
        //   { name: User.name, useFactory: () => Users },
        // ]),
      ],
      providers: [
        UsersService,
        { provide: getModelToken(UsersModel.name), useValue: UsersModel },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async () => {
    const user = new UsersModel();
    const createdUser = await controller.create(user);

    expect(createdUser);
  });
});
