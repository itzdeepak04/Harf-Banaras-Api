import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

/**
 * Response Handler Interceptor
 * 
 * Handles standardized response formatting and HTTP status codes
 * Allows services to set custom status codes using { code, data } format
 * 
 * @example
 * // In a service or controller
 * return { code: 201, data: createdItem };
 */
@Injectable()
export class ResponseHandler implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        // Check if response hasn't been sent and data has a custom code
        if (
          !res.headersSent &&
          data &&
          typeof data === 'object' &&
          'code' in data
        ) {
          // Set the HTTP status code from response data
          res.status(data.code);
        }
        return data;
      }),
    );
  }
}
