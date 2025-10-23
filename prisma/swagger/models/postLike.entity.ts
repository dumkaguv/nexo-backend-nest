import { ApiProperty } from '@nestjs/swagger'

import { Post } from './post.entity'
import { User } from './user.entity'

export class PostLike {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  userId: number
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  postId: number
  @ApiProperty({
    type: () => User,
    required: false
  })
  user?: User
  @ApiProperty({
    type: () => Post,
    required: false
  })
  post?: Post
  @ApiProperty({
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date
}
