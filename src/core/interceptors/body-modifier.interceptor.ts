import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseResponseDto } from '../../shared/dtos/response/base-response.dto';

@Injectable()
export class BodyModifierInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const res = httpContext.getResponse<Response>();

    return next.handle().pipe(
      map(body => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (req.method.toLowerCase().includes('get') && Array.isArray(body) && !body.length) {
            return new BaseResponseDto({ success: false, statusCode: 200, body });
          }
          return new BaseResponseDto({ success: true, statusCode: res.statusCode, body });
        }
        return body;
      }),
    );
  }
}
