/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'

import { Reflector } from '@nestjs/core'
import { map, Observable } from 'rxjs'

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE
} from 'src/common/constants'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  public intercept(
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
          const total = data.total || 0
          const rawPageSize = Number(request.query.pageSize)
          const pageSize = Number.isFinite(rawPageSize)
            ? Math.min(Math.max(1, rawPageSize), MAX_PAGE_SIZE)
            : DEFAULT_PAGE_SIZE
          const page = Number(request.query.page || DEFAULT_PAGE)
          const totalPages = Math.ceil(total / pageSize)
          const nextPage = page < totalPages ? page + 1 : null
          const prevPage = page > 1 ? page - 1 : null

          return {
            success: true,
            message,
            data: data.data,
            total,
            page,
            totalPages,
            pageSize,
            nextPage,
            prevPage
          }
        }

        return {
          success: true,
          message,
          data
        }
      })
    )
  }
}
