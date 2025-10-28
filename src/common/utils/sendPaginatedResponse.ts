/* eslint-disable @typescript-eslint/no-explicit-any */

import { ClassConstructor, plainToInstance } from 'class-transformer'

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
