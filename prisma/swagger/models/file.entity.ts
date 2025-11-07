import { ApiProperty } from '@nestjs/swagger'

import { MessageFile } from './messageFile.entity'
import { PostFile } from './postFile.entity'
import { Profile } from './profile.entity'

export class File {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
  @ApiProperty({
    type: 'string'
  })
  publicId: string
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
    type: () => MessageFile,
    isArray: true,
    required: false
  })
  MessageFile?: MessageFile[]
  @ApiProperty({
    type: () => PostFile,
    isArray: true,
    required: false
  })
  PostFile?: PostFile[]
  @ApiProperty({
    type: () => Profile,
    isArray: true,
    required: false
  })
  Profile?: Profile[]
  @ApiProperty({
    type: 'string',
    format: 'date-time'
  })
  uploadedAt: Date
}
