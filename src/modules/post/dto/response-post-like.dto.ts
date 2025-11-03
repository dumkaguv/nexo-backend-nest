import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { ResponseUserProfileIsFollowingDto } from '@/modules/user/dto'

@Exclude()
export class ResponsePostLikeDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({ type: () => ResponseUserProfileIsFollowingDto })
  @Type(() => ResponseUserProfileIsFollowingDto)
  @Expose()
  user: ResponseUserProfileIsFollowingDto

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly createdAt: Date
}
