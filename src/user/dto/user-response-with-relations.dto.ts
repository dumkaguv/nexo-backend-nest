import { ApiProperty } from '@nestjs/swagger'
import { MessageDto } from 'prisma/swagger/models/message.dto'
import { PostDto } from 'prisma/swagger/models/post.dto'
import { PostCommentDto } from 'prisma/swagger/models/postComment.dto'
import { PostLikeDto } from 'prisma/swagger/models/postLike.dto'
import { SubscriptionDto } from 'prisma/swagger/models/subscription.dto'
import { UpdateProfileDto } from 'prisma/swagger/models/update-profile.dto'

export class UserResponseWithRelationsDto {
  @ApiProperty({ type: 'integer' })
  id: number

  @ApiProperty({ type: 'string' })
  username: string

  @ApiProperty({ type: 'string' })
  email: string

  @ApiProperty({
    type: 'string',
    nullable: true
  })
  activationLink: string | null

  @ApiProperty({
    type: 'boolean'
  })
  isActivated: boolean

  @ApiProperty({ type: () => UpdateProfileDto, required: false })
  profile?: UpdateProfileDto

  @ApiProperty({
    type: () => PostDto,
    isArray: true,
    required: false
  })
  posts?: PostDto[]

  @ApiProperty({
    type: () => MessageDto,
    isArray: true,
    required: false
  })
  sentMessages?: MessageDto[]

  @ApiProperty({
    type: () => MessageDto,
    isArray: true,
    required: false
  })
  receivedMessages?: MessageDto[]

  @ApiProperty({
    type: () => PostLikeDto,
    isArray: true,
    required: false
  })
  likesOnPosts?: PostLikeDto[]

  @ApiProperty({
    type: () => PostCommentDto,
    isArray: true,
    required: false
  })
  comments?: PostCommentDto[]

  @ApiProperty({
    type: () => SubscriptionDto,
    isArray: true,
    required: false
  })
  following?: SubscriptionDto[]

  @ApiProperty({
    type: () => SubscriptionDto,
    isArray: true,
    required: false
  })
  followers?: SubscriptionDto[]

  @ApiProperty({
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date

  @ApiProperty({
    type: 'string',
    format: 'date-time'
  })
  updatedAt: Date

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true
  })
  activatedAt: Date | null
}
