import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import admin from 'firebase-admin';

import { UsersService } from '../users/users.service';
import { PatientSignupRequestDto } from './dtos/request/patient-signup.dto';
import { SigninRequestDto } from './dtos/request/signin.dto';
import { StaffSignupRequestDto } from './dtos/request/staff-signup.dto';
import { PatientSignupResponseDto } from './dtos/response/patient-signup.dto';
import { SigninResponseDto } from './dtos/response/signin.dto';
import { StaffSignupResponseDto } from './dtos/response/staff-signup.dto';
import { tap } from '../shared/utils/operators/tap';
import { UsersEntity } from '../users/users.entity';
import { SendOtpRequestDto } from './dtos/request/send-otp.dto';
import { AuthyService } from '../shared/modules/authy/authy.service';
import { VerifyOtpRequestDto } from './dtos/request/verify-otp.dto';
import { UpdateUserRequestDto } from '../users/dtos/request/update-user-request.dto';
import { ForgetPasswordRequestDto } from './dtos/request/forget-password.dto';
import { GetManyUsersRequestDto } from '../users/dtos/request/get-many-users-request.dto';
import { TwilioService } from '../shared/modules/twilio/twilio.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authyService: AuthyService,
    private readonly twilioService: TwilioService,
  ) {}

  signIn(body: SigninRequestDto): Promise<SigninResponseDto> {
    return this.usersService
      .getMany({ email: body.email, limit: 1, offset: 0 })
      .then(([user]) => user)
      .then(user => {
        if (!user) {
          throw new UnauthorizedException('Invalid email or password');
        }
        return user;
      })
      .then(user =>
        compare(body.password, user.password).then(res => {
          if (!res) {
            throw new UnauthorizedException('Invalid email or password');
          }
          return user;
        }),
      )
      .then(tap(user => admin.auth().revokeRefreshTokens((user as UsersEntity).id)))
      .then(user =>
        admin
          .auth()
          .createCustomToken(user.id)
          .then(token => new SigninResponseDto({ ...user, token })),
      )
      .catch(err => {
        throw new UnauthorizedException('Invalid email or password');
      });
  }

  async staffSignUp(body: StaffSignupRequestDto): Promise<StaffSignupResponseDto> {
    const user = await this.usersService.createStaff(body);
    const token = await admin.auth().createCustomToken(user.id, { isVerfiedByOTP: false });
    return new StaffSignupResponseDto({ ...user, token });
  }

  patientSignUp(body: PatientSignupRequestDto): Promise<PatientSignupResponseDto> {
    return this.usersService
      .createAmbulatoryPatient(body)
      .then(user => admin.auth().createCustomToken(user.id))
      .then(token => ({ token }));
  }

  sendOtp(body: SendOtpRequestDto) {
    return this.usersService
      .getOne(body.userId)
      .then(user => this.twilioService.sendVerificationCode(user.phoneNumber));
  }

  async verifyOtp(body: VerifyOtpRequestDto) {
    try {
      const user = await this.usersService.getOne(body.userId);
      const res = await this.twilioService.checkCode({
        code: body.otp,
        phoneNumber: user.phoneNumber,
      });
      if (res.valid) {
        const updatedUser = await this.usersService.updateOne(
          body.userId,
          new UpdateUserRequestDto({ isVerifiedByOTP: true }),
        );
        const token = await admin.auth().createCustomToken(user.id, { isVerfiedByOTP: true });
        return { user: updatedUser, token };
      }
      return res;
    } catch (error) {
      if (error.statusCode === 404) {
        throw new NotFoundException(error);
      }
      throw error;
    }
  }

  forgotPassword(body: ForgetPasswordRequestDto) {
    const query = new GetManyUsersRequestDto({
      limit: 1,
      offset: 0,
      ...(body.email ? { email: body.email } : {}),
      ...(body.phoneNumber ? { phoneNumber: body.phoneNumber } : {}),
    });

    return this.usersService
      .getMany(query)
      .then(users => {
        if (!users || !users.length) {
          {
          }
          throw new NotFoundException(
            `Can not find user ${body.email || body.phoneNumber ? 'with' : ''} ${
              body.email
                ? 'email: ' + body.email
                : body.phoneNumber
                ? 'phone number: ' + body.phoneNumber
                : ''
            }`,
          );
        }
        return users;
      })
      .then(([user]) => user.email)
      .then(email =>
        admin.auth().generatePasswordResetLink(email, {
          handleCodeInApp: true,
          iOS: { bundleId: 'com.connxysTechnology.ProxiHealth' },
          url: 'proxi.health',
        }),
      );
  }
}
