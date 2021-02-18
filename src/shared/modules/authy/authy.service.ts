import { Injectable } from '@nestjs/common';

import { AuthyCreateUserResponseInterface } from './models/authy-create-user-response.interface';
import { AuthyVerifyOtpResponseInterface } from './models/authy-verify-otp-response.interface';
import { AuthyRequestOTPResponseInterface } from './models/authy-request-otp-response.interface';
import { environment } from '../../../environments/environment';

const authyFactory = require('authy');

type registerCallback = (err, res) => void;

interface Authy {
  register_user: (email: string, phoneNumber: string, cb: registerCallback) => void;

  request_sms: (authyId: number | string, force: boolean, cb: registerCallback) => void;

  verify: (
    authyId: number | string,
    otp: number | string,
    force: boolean,
    cb: registerCallback,
  ) => void;
}

@Injectable()
export class AuthyService {
  private readonly authy: Authy;
  constructor() {
    this.authy = authyFactory(environment.authyApiKey);
  }

  registerUser(body: {
    email: string;
    phoneNumber: string;
  }): Promise<AuthyCreateUserResponseInterface> {
    const authyRegisterUser = (
      resolve: (res: AuthyCreateUserResponseInterface) => void,
      reject,
    ) => {
      // This will retry if authy api throws not found error, in case of other errors it will reject
      // In case of success returns the response
      return this.authy.register_user(body.email, body.phoneNumber, function(err, res) {
        if (err) {
          if (err.errno === 'ENOTFOUND' && err.code === 'ENOTFOUND') {
            console.log('Authy error; Retrying...');
            return authyRegisterUser(resolve, reject);
          } else if (err.error_code === '60027' && err.cellphone === 'is invalid') {
            reject({
              statusCode: 400,
              message: ['phoneNumber must be a valid phone number'],
              error: 'Bad Request',
            });
          } else {
            reject(err);
          }
        }
        return resolve(res);
      });
    };

    return new Promise((resolve: (res: AuthyCreateUserResponseInterface) => void, reject) =>
      authyRegisterUser(resolve, reject),
    );
  }

  sendOtp(authyId: number | string) {
    return new Promise((resolve: (res: AuthyRequestOTPResponseInterface) => void, reject) =>
      this.authy.request_sms(authyId, /* force = */ true, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      }),
    );
  }

  verifyOtp(body: {
    authyId: number | string;
    otp: number | string;
  }): Promise<AuthyVerifyOtpResponseInterface> {
    return new Promise((resolve: (res: AuthyVerifyOtpResponseInterface) => void, reject) =>
      this.authy.verify(body.authyId, body.otp, /* force = */ true, (err, res) => {
        if (err) {
          reject(err);
        }
        return resolve(res);
      }),
    );
  }
}
