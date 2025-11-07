import { ApiProperty } from '@nestjs/swagger'

export class FileDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
  @ApiProperty({
    type: 'string'
  })
  publicId: string
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
