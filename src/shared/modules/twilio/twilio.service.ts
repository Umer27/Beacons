import { HttpService, Injectable, HttpException } from '@nestjs/common';

import { environment } from '../../../environments/environment';

function twilioURL(endPoint: 'Verifications' | 'VerificationCheck') {
  return `https://verify.twilio.com/v2/Services/${environment.twilioSid}/${endPoint}`;
}

@Injectable()
export class TwilioService {
  private readonly b64Auth = Buffer.from(
    environment.twilioAccountsid + ':' + environment.twilioAuthToken,
  ).toString('base64');
  private readonly Authorization = 'Basic ' + this.b64Auth;
  private twilioHeaders = {
    Authorization: this.Authorization,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  constructor(private readonly http: HttpService) {}

  private toURIComponent(params: Record<string, string>) {
    return Object.entries(params)
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join('&');
  }

  async sendVerificationCode(phoneNumber: string) {
    const params = { To: phoneNumber, Channel: 'sms' };
    const data = this.toURIComponent(params);
    try {
      const res = await this.http
        .post(twilioURL('Verifications'), data, { headers: this.twilioHeaders })
        .toPromise();
      return res;
    } catch (error) {
      const {
        response: { status, statusText },
      } = error;
      if (status === 400 && (statusText as string).includes('Invalid parameter `To`')) {
        throw {
          statusCode: 400,
          message: ['phoneNumber must be a valid phone number'],
          error: 'Bad Request',
        };
      }
      if (status === 429) {
        throw new HttpException(
          { error: 'Too many requests', message: 'Too many requests', status: 429 },
          429,
        );
      }

      throw { statusText: statusText, status: status };
    }
  }

  async checkCode({ code, phoneNumber }: { phoneNumber: string; code: string }) {
    const data = this.toURIComponent({ Code: code.toString(), To: phoneNumber.toString() });
    try {
      const res = await this.http
        .post(twilioURL('VerificationCheck'), data, { headers: this.twilioHeaders })
        .toPromise();
      return res.data;
    } catch (error) {
      const {
        response: { status, statusText },
      } = error;
      console.log(error.response, { status, statusText });
      if (status === 404) {
        throw {
          statusCode: 404,
          message: 'Invalid code',
          error: 'Not Found',
        };
      }

      if (status === 429) {
        throw new HttpException(
          { error: 'Too many requests', message: 'Too many requests', status: 429 },
          429,
        );
      }

      throw { statusText: statusText, status: status };
    }
  }
}
