import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Response<T> {
    data: T[];
    success: boolean;
}


@Injectable()
export class GlobalResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => {
                // Agar data allaqachon array bo'lsa, o'zgarishsiz qoldirish
                // Aks holda array ichiga o'rash
                let transformedData;
                if (Array.isArray(data)) {
                    transformedData = data;
                } else if (data !== null && data !== undefined) {
                    transformedData = [data];
                } else {
                    transformedData = [];
                }

                return {
                    data: transformedData,
                    success: true,
                };
            }),
            catchError((error) => {
                const status = error instanceof HttpException
                    ? error.getStatus()
                    : HttpStatus.INTERNAL_SERVER_ERROR;

                const message = error instanceof HttpException
                    ? error.message
                    : 'Internal server error';

                // Response ni error bilan qaytarish
                const errorResponse = {
                    data: { message },
                    success: false,
                };

                // HTTP status code bilan birga error response qaytarish
                return throwError(() => new HttpException(errorResponse, status));
            }),
        );
    }
}
