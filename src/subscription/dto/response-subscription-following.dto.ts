import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

import { ResponseUserDto, ResponseUserProfileDto } from '@/user/dto'

@Expose()
export class ResponseSubscriptionFollowingDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({ type: () => ResponseUserProfileDto })
  @Expose()
  user: ResponseUserDto

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly createdAt?: Date | null
}
