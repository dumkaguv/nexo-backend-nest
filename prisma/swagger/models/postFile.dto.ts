import { ApiProperty } from '@nestjs/swagger'

export class PostFileDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
  @ApiProperty({
    type: 'string'
  })
  url: string
  @ApiProperty({
    type: 'string',
    nullable: true
  })
  type: string | null
  @ApiProperty({
    type: 'string',
    format: 'date-time'
  })
  uploadedAt: Date
}
