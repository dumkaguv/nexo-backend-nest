import { ApiProperty } from '@nestjs/swagger'

import { PostComment } from './postComment.entity'
import { PostFile } from './postFile.entity'
import { PostLike } from './postLike.entity'
import { User } from './user.entity'

export class Post {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
  @ApiProperty({
    type: 'string'
  })
  content: string
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  userId: number
  @ApiProperty({
    type: () => User,
    required: false
  })
  user?: User
  @ApiProperty({
    type: () => PostFile,
    isArray: true,
    required: false
  })
  files?: PostFile[]
  @ApiProperty({
    type: () => PostLike,
    isArray: true,
    required: false
  })
  likes?: PostLike[]
  @ApiProperty({
    type: () => PostComment,
    isArray: true,
    required: false
  })
  comments?: PostComment[]
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
}
