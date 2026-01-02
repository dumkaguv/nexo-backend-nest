import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { ResponseUserProfileDto } from '@/modules/user/dto'

@Exclude()
export class ResponseConversationDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({
    type: () => ResponseUserProfileDto
  })
  @Type(() => ResponseUserProfileDto)
  @Expose()
  receiver: ResponseUserProfileDto

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly createdAt: Date

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly updatedAt: Date
}
