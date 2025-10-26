import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty({
    type: 'string',
    required: false
  })
  username?: string
  @ApiProperty({
    type: 'string',
    required: false
  })
  email?: string
  @ApiProperty({
    type: 'string',
    required: false
  })
  password?: string
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true
  })
  activationLink?: string | null
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true
  })
  activatedAt?: Date | null
}
