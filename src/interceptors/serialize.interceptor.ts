import { UserDto } from './../users/dto';
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    // Run something before a request is handled
    // by the request handler
    return next.handle().pipe(
      map((user: UserDto) => {
        // Run something before the response is sent out
        return plainToClass(UserDto, user, { excludeExtraneousValues: true });
      }),
    );
  }
}
