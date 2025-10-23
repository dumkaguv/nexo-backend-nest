import { ApiProperty } from '@nestjs/swagger'

import { User } from './user.entity'

export class Subscription {
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
  followingId: number
  @ApiProperty({
    type: () => User,
    required: false
  })
  user?: User
  @ApiProperty({
    type: () => User,
    required: false
  })
  following?: User
  @ApiProperty({
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date
}
