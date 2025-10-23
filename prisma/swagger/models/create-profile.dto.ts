import { ApiProperty } from '@nestjs/swagger'

export class CreateProfileDto {
  @ApiProperty({
    type: 'string'
  })
  fullName: string
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true
  })
  avatarUrl?: string | null
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true
  })
  birthDay?: Date | null
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true
  })
  phone?: string | null
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true
  })
  biography?: string | null
}
