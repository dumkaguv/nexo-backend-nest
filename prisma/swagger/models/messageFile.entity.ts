import { ApiProperty } from '@nestjs/swagger'

import { File } from './file.entity'
import { Message } from './message.entity'

export class MessageFile {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    nullable: true
  })
  messageId: number | null
  @ApiProperty({
    type: () => Message,
    required: false,
    nullable: true
  })
  message?: Message | null
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  fileId: number
  @ApiProperty({
    type: () => File,
    required: false
  })
  file?: File
  @ApiProperty({
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date
}
