import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { auth } from 'firebase-admin';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const authToken = request.get('authorization');
    if (!authToken) {
      throw new UnauthorizedException('No token found');
    }

    return auth()
      .verifyIdToken(authToken, true)
      .then(auth => {
        console.log(auth);
        (request as any).auth = auth;
        return true;
      })
      .catch(error => {
        if (error.code === 'auth/argument-error') {
          throw new UnauthorizedException('Invalid token');
        }
        return false;
      });
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments

    if (err || !user) {
      console.log({ err });
      throw err || new UnauthorizedException('Please login!');
    }
    return user;
  }
}
