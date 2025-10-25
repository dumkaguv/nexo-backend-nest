import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Type } from 'class-transformer'

import { Post } from 'prisma/swagger/models/post.entity'

import { PostCommentDto } from 'prisma/swagger/models/postComment.dto'
import { PostFileDto } from 'prisma/swagger/models/postFile.dto'
import { PostLikeDto } from 'prisma/swagger/models/postLike.dto'

import { UserResponseDto } from '@/user/dto'

export class PostResponseDto extends OmitType(Post, [
  'userId',
  'user',
  'files',
  'likes',
  'comments'
] as const) {
  @ApiProperty({ type: () => UserResponseDto })
  @Type(() => UserResponseDto)
  user: UserResponseDto

  @ApiProperty({ type: () => [PostFileDto], required: false })
  @Type(() => PostFileDto)
  files?: PostFileDto[]

  @ApiProperty({ type: () => [PostLikeDto], required: false })
  @Type(() => PostLikeDto)
  likes?: PostLikeDto[]

  @ApiProperty({ type: () => [PostCommentDto], required: false })
  @Type(() => PostCommentDto)
  comments?: PostCommentDto[]
}
