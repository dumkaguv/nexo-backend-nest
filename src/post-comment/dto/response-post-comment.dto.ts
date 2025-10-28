import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { ResponseUserProfileDto } from '@/user/dto'

@Exclude()
export class ResponsePostCommentDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly postId: number

  @ApiProperty({ type: () => ResponseUserProfileDto })
  @Type(() => ResponseUserProfileDto)
  @Expose()
  user: ResponseUserProfileDto

  @ApiProperty({ type: 'string' })
  @Expose()
  content: string

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly createdAt: Date
}
