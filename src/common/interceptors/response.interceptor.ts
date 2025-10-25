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

import { removeForeignKeysFromResponse } from '@/common/utils'

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
      map((response) => {
        if (usePagination) {
          const total = response.total || 0
          const pageSize = Number(request.query.pageSize || DEFAULT_PAGE_SIZE)

          const page = Number(request.query.page || DEFAULT_PAGE)
          const totalPages = Math.ceil(total / pageSize)
          const nextPage = page < totalPages ? page + 1 : null
          const prevPage = page > 1 ? page - 1 : null

          const data = removeForeignKeysFromResponse(response.data)

          return {
            message,
            data,
            total,
            page,
            totalPages,
            pageSize,
            nextPage,
            prevPage
          }
        }

        return {
          message,
          data: response || {}
        }
      })
    )
  }
}
