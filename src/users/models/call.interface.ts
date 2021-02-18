import { UsersEntity } from '../users.entity';
import { CallStatusEnum } from './call-status.enum';

export interface CallInterface {
  with: Pick<UsersEntity, 'id' | 'fullName' | 'image'>;

  status: CallStatusEnum;
}
