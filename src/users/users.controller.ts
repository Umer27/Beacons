import {
  Body,
  Controller,
  Post,
  Delete,
  Get,
  Patch,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateAmbulatoryPatientRequestDto } from './dtos/request/create-ambulatory-patient-request.dto';
import { CreateNonAmbulatoryPatientRequestDto } from './dtos/request/create-non-ambulatory-patient-request.dto';
import { CreateStaffRequestDto } from './dtos/request/create-staff-request.dto';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';
import { CrudInterface } from '../shared/models/crud.interface';
import { GetUserResponseDto } from './dtos/response/get-user-response.dto';
import { GetManyUsersRequestDto } from './dtos/request/get-many-users-request.dto';
import { UpdateUserResponseDto } from './dtos/response/update-user-response.dto';
import { UpdateUserRequestDto } from './dtos/request/update-user-request.dto';
import { CreateNonAmbulatoryPatientResponseDto } from './dtos/response/create-non-ambulatory-patient-response.dto';
import { CreateAmbulatoryPatientResponseDto } from './dtos/response/create-ambulatory-patient-response.dto';
import { CreateStaffResponseDto } from './dtos/response/create-staff-response.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController implements Partial<CrudInterface<UsersEntity>> {
  constructor(public readonly service: UsersService) {}

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete on user response' })
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
  @Get()
  @ApiOkResponse({
    isArray: true,
    type: GetUserResponseDto,
    description: 'Get many users response',
  })
  getMany(@Query() query?: GetManyUsersRequestDto): Promise<UsersEntity[]> {
    return this.service.getMany(query);
  }
  @Get(':id')
  @ApiOkResponse({ description: 'Get one user response', type: GetUserResponseDto })
  getOne(@Param('id') id: string): Promise<UsersEntity> {
    return this.service.getOne(id);
  }
  @Patch(':id')
  @ApiOkResponse({ description: 'Update one user response', type: UpdateUserResponseDto })
  updateOne(@Param('id') id: string, @Body() body: UpdateUserRequestDto): Promise<UsersEntity> {
    return this.service.updateOne(id, body);
  }

  @Post('/patient/ambulatory')
  @ApiCreatedResponse({
    description: 'Create ambulatory patient response',
    type: CreateNonAmbulatoryPatientResponseDto,
  })
  createAmbulatoryPatient(@Body() body: CreateAmbulatoryPatientRequestDto): Promise<UsersEntity> {
    return this.service.createAmbulatoryPatient(body);
  }

  @Post('/patient/non-ambulatory')
  @ApiCreatedResponse({
    description: 'Create ambulatory patient response',
    type: CreateAmbulatoryPatientResponseDto,
  })
  createNonAmbulatoryPatient(
    @Body() body: CreateNonAmbulatoryPatientRequestDto,
  ): Promise<UsersEntity> {
    return this.service.createNonAmbulatoryPatient(body);
  }

  @Post('/staff')
  @ApiCreatedResponse({
    description: 'Create ambulatory patient response',
    type: CreateStaffResponseDto,
  })
  createStaff(@Body() body: CreateStaffRequestDto): Promise<UsersEntity> {
    return this.service.createStaff(body);
  }
}
