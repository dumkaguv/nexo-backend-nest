import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { ResponseUserProfileDto } from '@/user/dto'

@Exclude()
export class ResponsePostLikeDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({ type: () => ResponseUserProfileDto })
  @Type(() => ResponseUserProfileDto)
  @Expose()
  user: ResponseUserProfileDto

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly createdAt: Date
}
