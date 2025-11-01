import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { ResponsePostCommentDto } from '@/modules/post-comment/dto'
import { ResponsePostFileDto } from '@/modules/post-file/dto'
import { ResponsePostLikeDto } from '@/modules/post-like/dto'
import { ResponseUserDto } from '@/modules/user/dto'

@Exclude()
export class ResponsePostDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({ type: 'string' })
  @Expose()
  content: string

  @ApiProperty({ type: () => ResponseUserDto })
  @Type(() => ResponseUserDto)
  @Expose()
  user: ResponseUserDto

  @ApiProperty({
    type: () => ResponsePostFileDto,
    required: false,
    isArray: true,
    nullable: true
  })
  @Type(() => ResponsePostFileDto)
  @Expose()
  files?: ResponsePostFileDto[] | null

  @ApiProperty({
    type: () => ResponsePostLikeDto,
    required: false,
    isArray: true,
    nullable: true
  })
  @Type(() => ResponsePostLikeDto)
  @Expose()
  likes?: ResponsePostLikeDto[] | null

  @ApiProperty({
    type: () => ResponsePostCommentDto,
    isArray: true,
    required: false,
    nullable: true
  })
  @Type(() => ResponsePostCommentDto)
  @Expose()
  comments?: ResponsePostCommentDto[] | null

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly createdAt: Date

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly updatedAt: Date
}
