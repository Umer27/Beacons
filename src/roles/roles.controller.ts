import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { GetRolesRequestDto } from './dtos/request/get-roles';
import { GetRolesResponseDto } from './dtos/response/get-roles';
import { RolesEntity } from './roles.entity';
import { RolesService } from './roles.service';
import { CrudInterface } from '../shared/models/crud.interface';

@Controller('roles')
@ApiTags('Roles')
@UseInterceptors(ClassSerializerInterceptor)
export class RolesController implements CrudInterface<RolesEntity> {
  constructor(private readonly rolesService: RolesService) {}
  createOne(body: Record<string, any>): Promise<RolesEntity> {
    return this.rolesService.createOne(body);
  }
  createMany(body: Record<string, any>[]): Promise<RolesEntity[]> {
    return this.rolesService.createMany(body);
  }
  delete(id: string): Promise<void> {
    return this.rolesService.delete(id);
  }
  @Get()
  @ApiOkResponse({ description: 'Get many roles', isArray: true, type: GetRolesResponseDto })
  getMany(@Query() query?: GetRolesRequestDto): Promise<RolesEntity[]> {
    return this.rolesService.getMany(query);
  }
  getOne(id: string): Promise<RolesEntity> {
    return this.rolesService.getOne(id);
  }
  updateOne(id: string, body: Record<string, any>): Promise<RolesEntity> {
    return this.rolesService.updateOne(id, body);
  }
  replaceOne(id: string, body: Record<string, any>): Promise<RolesEntity> {
    return this.rolesService.replaceOne(id, body);
  }
}
