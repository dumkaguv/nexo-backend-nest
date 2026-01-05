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

  @ApiProperty({ example: 10 })
  totalPages: number

  @ApiProperty({ example: 2, nullable: true, required: false })
  nextPage?: number

  @ApiProperty({ example: 1, nullable: true, required: false })
  prevPage?: number
}
