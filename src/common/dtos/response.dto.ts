import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class BaseResponseDto<TData> {
  @ApiProperty({ example: 'Success' })
  message: string

  @ApiProperty({ isArray: false })
  @Type(() => Object)
  data: TData
}

export class PaginatedResponseDto<TData> extends BaseResponseDto<TData> {
  @ApiProperty({ example: 100 })
  total: number

  @ApiProperty({ example: 1 })
  page: number

  @ApiProperty({ example: 10 })
  pageSize: number

  @ApiProperty({ example: 5 })
  totalPages: number

  @ApiProperty({ example: 7 })
  nextPage: number

  @ApiProperty({ example: 6 })
  prevPage: number
}
