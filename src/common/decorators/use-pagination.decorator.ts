import { SetMetadata } from '@nestjs/common'

export const ResponseMessage = (message: string) =>
  SetMetadata('responseMessage', message)

export const UsePagination = () => SetMetadata('usePagination', true)
