import { ApiProperty } from '@nestjs/swagger'

export class PostFileDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
  @ApiProperty({
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date
}
