type DtoObject = Record<string, any>;

export interface CrudInterface<Entity> {
  createOne(body: DtoObject): Promise<Entity>;

  createMany(body: DtoObject[]): Promise<Entity[]>;

  delete(id: string): Promise<void>;

  getMany(query?: DtoObject): Promise<Array<Entity>>;

  getOne(id: string): Promise<Entity>;

  updateOne(id: string, body: DtoObject): Promise<Entity>;

  replaceOne(id: string, body: DtoObject): Promise<Entity>;
}
