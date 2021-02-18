import { BaseResponseDto } from '../dtos/response/base-response.dto';

type DtoObject = Record<string, any>;

export interface CrudControllerInterface<Entity> {
  createOne(body: DtoObject): Promise<BaseResponseDto<Entity>>;

  createMany(body: DtoObject[]): Promise<BaseResponseDto<Entity[]>>;

  delete(id: string): Promise<BaseResponseDto<void>>;

  getMany(query?: DtoObject): Promise<BaseResponseDto<Array<Entity>>>;

  getOne(id: string): Promise<BaseResponseDto<Entity>>;

  updateOne(id: string, body: DtoObject): Promise<BaseResponseDto<Entity>>;

  replaceOne(id: string, body: DtoObject): Promise<BaseResponseDto<Entity>>;
}
