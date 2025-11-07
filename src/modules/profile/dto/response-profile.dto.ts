import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { ResponseFileDto } from '@/modules/file/dto'

@Exclude()
export class ResponseProfileDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({ type: 'string' })
  @Expose()
  fullName: string

  @ApiProperty({
    type: () => ResponseFileDto,
    nullable: true,
    required: false
  })
  @Type(() => ResponseFileDto)
  @Expose()
  avatar?: ResponseFileDto

  @ApiProperty({
    type: 'string',
    format: 'date',
    required: false,
    nullable: true
  })
  @Expose()
  birthDay?: Date | null

  @ApiProperty({ type: 'string', nullable: true, required: false })
  @Expose()
  phone?: string | null

  @ApiProperty({ type: 'string', nullable: true, required: false })
  @Expose()
  biography?: string | null

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    readOnly: true
  })
  @Expose()
  readonly createdAt: Date
}
