import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { ResponseFileDto } from '@/modules/file/dto'

@Exclude()
export class ResponseMessageDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly senderId: number

  @ApiProperty({ type: 'integer' })
  @Expose()
  receiverId: number

  @ApiProperty({ type: 'integer' })
  @Expose()
  conversationId: number

  @ApiProperty({ type: 'string', required: false, nullable: true })
  @Expose()
  content?: string | null

  @ApiProperty({
    type: () => ResponseFileDto,
    required: false,
    isArray: true,
    nullable: true
  })
  @Type(() => ResponseFileDto)
  @Expose()
  files?: ResponseFileDto[] | null

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly createdAt: Date
}
