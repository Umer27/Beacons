import { ApiProperty } from '@nestjs/swagger';
import { Trim } from 'class-sanitizer';
import { IsString } from 'class-validator';

import { CreateStaffRequestDto } from '../../../users/dtos/request/create-staff-request.dto';

export class StaffSignupRequestDto extends CreateStaffRequestDto {
  @ApiProperty() @IsString() @Trim() deviceUID: string;

  @ApiProperty() @IsString() @Trim() fcmToken: string;
}
