/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { type Observable, map } from 'rxjs'

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/common/constants'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> {
    const handler = context.getHandler()
    const request = context.switchToHttp().getRequest()

    const message =
      this.reflector.get<string>('responseMessage', handler) || 'Success'

    const usePagination =
      this.reflector.get<boolean>('usePagination', handler) || false

    return next.handle().pipe(
      map((data) => {
        if (usePagination) {
          const page = Number(request.query.page || DEFAULT_PAGE)
          const pageSize = Number(request.query.pageSize || DEFAULT_PAGE_SIZE)
          const total = data.total || 0

          return {
            message,
            data: data.data,
            total,
            page,
            pageSize
          }
        }

        return {
          message,
          data
        }
      })
    )
  }
}
