import { ApiProperty } from '@nestjs/swagger'

import { Message } from './message.entity'

export class MessageFile {
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
  messageId: number
  @ApiProperty({
    type: () => Message,
    required: false
  })
  message?: Message
  @ApiProperty({
    type: 'string',
    format: 'date-time'
  })
  uploadedAt: Date
}
