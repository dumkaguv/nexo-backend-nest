import { ApiProperty } from '@nestjs/swagger'

export class PostLikeDto {
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
