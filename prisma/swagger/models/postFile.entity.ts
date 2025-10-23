import { ApiProperty } from '@nestjs/swagger'

import { Post } from './post.entity'

export class PostFile {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
  @ApiProperty({
    type: 'string'
  })
  url: string
  @ApiProperty({
    type: 'string',
    nullable: true
  })
  type: string | null
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  postId: number
  @ApiProperty({
    type: () => Post,
    required: false
  })
  post?: Post
  @ApiProperty({
    type: 'string',
    format: 'date-time'
  })
  uploadedAt: Date
}
