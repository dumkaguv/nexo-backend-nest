import { ApiProperty } from '@nestjs/swagger'

import { MessageFile } from './messageFile.entity'
import { User } from './user.entity'

export class Message {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  senderId: number
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  receiverId: number
  @ApiProperty({
    type: () => User,
    required: false
  })
  sender?: User
  @ApiProperty({
    type: () => User,
    required: false
  })
  receiver?: User
  @ApiProperty({
    type: 'string',
    nullable: true
  })
  content: string | null
  @ApiProperty({
    type: () => MessageFile,
    isArray: true,
    required: false
  })
  files?: MessageFile[]
  @ApiProperty({
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true
  })
  readAt: Date | null
}
