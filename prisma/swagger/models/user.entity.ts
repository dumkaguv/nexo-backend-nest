import { ApiProperty } from '@nestjs/swagger'

import { Message } from './message.entity'
import { Post } from './post.entity'
import { PostComment } from './postComment.entity'
import { PostLike } from './postLike.entity'
import { Profile } from './profile.entity'
import { Subscription } from './subscription.entity'
import { Token } from './token.entity'

export class User {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
  @ApiProperty({
    type: 'string'
  })
  username: string
  @ApiProperty({
    type: 'string'
  })
  email: string
  @ApiProperty({
    type: 'string'
  })
  password: string
  @ApiProperty({
    type: 'string',
    nullable: true
  })
  activationLink: string | null
  @ApiProperty({
    type: 'boolean'
  })
  isActivated: boolean
  @ApiProperty({
    type: () => Token,
    required: false,
    nullable: true
  })
  token?: Token | null
  @ApiProperty({
    type: () => Profile,
    required: false,
    nullable: true
  })
  profile?: Profile | null
  @ApiProperty({
    type: () => Post,
    isArray: true,
    required: false
  })
  posts?: Post[]
  @ApiProperty({
    type: () => Message,
    isArray: true,
    required: false
  })
  sentMessages?: Message[]
  @ApiProperty({
    type: () => Message,
    isArray: true,
    required: false
  })
  receivedMessages?: Message[]
  @ApiProperty({
    type: () => PostLike,
    isArray: true,
    required: false
  })
  likesOnPosts?: PostLike[]
  @ApiProperty({
    type: () => PostComment,
    isArray: true,
    required: false
  })
  comments?: PostComment[]
  @ApiProperty({
    type: () => Subscription,
    isArray: true,
    required: false
  })
  following?: Subscription[]
  @ApiProperty({
    type: () => Subscription,
    isArray: true,
    required: false
  })
  followers?: Subscription[]
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
