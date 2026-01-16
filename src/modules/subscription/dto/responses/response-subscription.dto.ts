import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

import { ResponseUserProfileDto } from '@/modules/user/dto'

@Exclude()
export class ResponseSubscriptionDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({
    type: () => ResponseUserProfileDto
  })
  @Expose()
  user: ResponseUserProfileDto

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly createdAt?: Date | null
}
