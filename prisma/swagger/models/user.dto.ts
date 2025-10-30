import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
  @ApiProperty({
    type: 'string'
  })
  username: string
  @ApiProperty({
    type: 'string'
  })
  email: string
  @ApiProperty({
    type: 'string'
  })
  password: string
  @ApiProperty({
    type: 'string',
    nullable: true
  })
  activationLink: string | null
  @ApiProperty({
    type: 'boolean'
  })
  isActivated: boolean
  @ApiProperty({
    type: 'boolean'
  })
  isFollowing: boolean
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
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true
  })
  activatedAt: Date | null
}
