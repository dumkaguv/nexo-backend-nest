import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
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
