import { ApiProperty } from '@nestjs/swagger'

import { File } from './file.entity'
import { Post } from './post.entity'

export class PostFile {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
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
    type: 'integer',
    format: 'int32',
    nullable: true
  })
  fileId: number | null
  @ApiProperty({
    type: () => File,
    required: false,
    nullable: true
  })
  file?: File | null
  @ApiProperty({
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date
}
