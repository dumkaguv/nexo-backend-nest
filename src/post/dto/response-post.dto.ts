import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

import { PostCommentDto } from 'prisma/swagger/models/postComment.dto'
import { PostLikeDto } from 'prisma/swagger/models/postLike.dto'

import { ResponsePostFileDto } from '@/post-file/dto'
import { ResponsePostLikeDto } from '@/post-like/dto'
import { ResponseUserDto } from '@/user/dto'

export class ResponsePostDto {
  @ApiProperty({ type: () => ResponseUserDto })
  @Type(() => ResponseUserDto)
  user: ResponseUserDto

  @ApiProperty({
    type: () => [ResponsePostFileDto],
    required: false,
    nullable: true
  })
  @Type(() => ResponsePostFileDto)
  files?: ResponsePostFileDto | null

  @ApiProperty({
    type: () => PostLikeDto,
    required: false,
    isArray: true,
    nullable: true
  })
  @Type(() => PostLikeDto)
  likes?: ResponsePostLikeDto[] | null

  @ApiProperty({ type: () => [PostCommentDto], required: false })
  @Type(() => PostCommentDto)
  comments?: PostCommentDto[]
}
