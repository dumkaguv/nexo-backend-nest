/* eslint-disable @typescript-eslint/no-explicit-any */

import { type ApiQueryOptions, ApiQuery } from '@nestjs/swagger'

import { DEFAULT_GET_QUERY } from '@/common/constants'

export function ApiQueryMany(queries: ApiQueryOptions[] = DEFAULT_GET_QUERY) {
  return function (target: any, key?: any, descriptor?: any) {
    queries.forEach((query) => ApiQuery(query)(target, key, descriptor))
  }
}
