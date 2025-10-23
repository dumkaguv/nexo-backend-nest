import { ApiProperty } from '@nestjs/swagger'

export class CreateMessageDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true
  })
  content?: string | null
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true
  })
  readAt?: Date | null
}
