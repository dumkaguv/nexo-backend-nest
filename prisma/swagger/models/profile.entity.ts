import { ApiProperty } from '@nestjs/swagger'

import { File } from './file.entity'
import { User } from './user.entity'

export class Profile {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
  @ApiProperty({
    type: 'string'
  })
  fullName: string
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true
  })
  birthDay: Date | null
  @ApiProperty({
    type: 'string',
    nullable: true
  })
  phone: string | null
  @ApiProperty({
    type: 'string',
    nullable: true
  })
  biography: string | null
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
    type: 'integer',
    format: 'int32',
    nullable: true
  })
  avatarFileId: number | null
  @ApiProperty({
    type: () => File,
    required: false,
    nullable: true
  })
  avatar?: File | null
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
