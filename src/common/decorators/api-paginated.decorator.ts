/* eslint-disable @typescript-eslint/no-explicit-any */

import { applyDecorators } from '@nestjs/common'

import { ApiQueryMany } from 'src/common/utils'

import { ApiOkResponseWrapped } from './api-response.decorator'
import { UsePagination } from './use-pagination.decorator'

export const ApiPaginated = (model: any) => {
  return applyDecorators(
    UsePagination(),
    ApiQueryMany(),
    ApiOkResponseWrapped(model, true)
  )
}
