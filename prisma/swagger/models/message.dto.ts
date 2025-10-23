import { ApiProperty } from '@nestjs/swagger'

export class MessageDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
  @ApiProperty({
    type: 'string',
    nullable: true
  })
  content: string | null
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
