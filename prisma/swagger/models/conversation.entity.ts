import { ApiProperty } from '@nestjs/swagger'

import { Message } from './message.entity'
import { User } from './user.entity'

export class Conversation {
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
    type: () => Message,
    isArray: true,
    required: false
  })
  messages?: Message[]
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
