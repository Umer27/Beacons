import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class BaseGetManyRequestDto {
  @ApiPropertyOptional({ default: 50 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  @Transform(value => +value ?? 50)
  limit: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  @Transform(value => +value ?? 0)
  offset: number;

  constructor(obj: Partial<BaseGetManyRequestDto>) {
    Object.assign(this, { limit: obj?.limit, offset: obj?.offset });
  }
}
