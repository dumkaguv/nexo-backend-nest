/* eslint-disable @typescript-eslint/no-explicit-any */

import { plainToInstance } from 'class-transformer'

import type { ClassConstructor } from 'class-transformer'

type Data = {
  data: any
  total: number
}

export function sendPaginatedResponse(
  cls: ClassConstructor<unknown>,
  { data, total }: Data
) {
  return {
    data: plainToInstance(cls, data),
    total
  }
}
