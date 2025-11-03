import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { ResponsePostFileDto } from '@/modules/post-file/dto'
import { ResponseUserProfileDto } from '@/modules/user/dto'

@Exclude()
export class ResponsePostDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({ type: 'string' })
  @Expose()
  content: string

  @ApiProperty({ type: 'boolean' })
  @Expose()
  isLiked: boolean

  @ApiProperty({ type: () => ResponseUserProfileDto })
  @Type(() => ResponseUserProfileDto)
  @Expose()
  user: ResponseUserProfileDto

  @ApiProperty({
    type: () => ResponsePostFileDto,
    required: false,
    isArray: true,
    nullable: true
  })
  @Type(() => ResponsePostFileDto)
  @Expose()
  files?: ResponsePostFileDto[] | null

  @ApiProperty({ type: 'integer' })
  @Expose()
  likesCount: number

  @ApiProperty({ type: 'integer' })
  @Expose()
  commentsCount: number

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly createdAt: Date

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly updatedAt: Date
}
