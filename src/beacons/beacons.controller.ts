import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth/auth.guard';
import { CrudInterface } from '../shared/models/crud.interface';
import { BeaconsEntity } from './beacons.entity';
import { BeaconsService } from './beacons.service';
import { CreateBeaconRequestDto } from './dtos/request/create-beacon';
import { UpdateBeaconRequestDto } from './dtos/request/update-beacon';
import { CreateBeaconResponseDto } from './dtos/response/create-beacon';
import { GetBeaconResponseDto } from './dtos/response/get-beacon';
import { UpdateBeaconResponseDto } from './dtos/response/update-beacon';
import { GetBeaconRequestDto } from './dtos/request/get-beacon';
import { GetCoordsRequestDto } from './dtos/request/get-coords';

@ApiBearerAuth()
@ApiTags('Beacons')
@Controller('beacons')
// @UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class BeaconsController implements CrudInterface<BeaconsEntity> {
  constructor(private readonly beaconsService: BeaconsService) {}
  @Post()
  @ApiCreatedResponse({
    description: 'Create one beacon response',
    type: CreateBeaconResponseDto,
  })
  createOne(@Body() body: CreateBeaconRequestDto): Promise<BeaconsEntity> {
    return this.beaconsService.createOne(body);
  }
  @Post('bulk')
  @ApiCreatedResponse({
    description: 'Create many beacons response',
    isArray: true,
    type: CreateBeaconResponseDto,
  })
  createMany(body: CreateBeaconRequestDto[]): Promise<BeaconsEntity[]> {
    return this.beaconsService.createMany(body);
  }
  @Delete(':id')
  @ApiOkResponse({ description: 'Delete one beacon response' })
  delete(@Param('id') id: string): Promise<void> {
    return this.beaconsService.delete(id);
  }
  @Get()
  @ApiOkResponse({
    isArray: true,
    description: 'Get many beacons response',
    type: GetBeaconResponseDto,
  })
  getMany(@Query() query?: GetBeaconRequestDto): Promise<BeaconsEntity[]> {
    return this.beaconsService.getMany(query);
  }
  @Get(':id')
  @ApiOkResponse({ description: 'Get one beacon response', type: GetBeaconResponseDto })
  getOne(@Param('id') id: string): Promise<BeaconsEntity> {
    return this.beaconsService.getOne(id);
  }
  @Patch(':id')
  @ApiOkResponse({ description: 'Update one beacon', type: UpdateBeaconResponseDto })
  updateOne(@Param() id: string, @Body() body: UpdateBeaconRequestDto): Promise<BeaconsEntity> {
    return this.beaconsService.updateOne(id, body);
  }
  replaceOne(id: string, body: Record<string, any>): Promise<BeaconsEntity> {
    return this.beaconsService.replaceOne(id, body);
  }
}
